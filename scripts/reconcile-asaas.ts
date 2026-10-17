// Explicit process variables only: does not load dotenv or make provider mutations.
import { prisma } from '../src/core/lib/prisma'
import { asaasFetch, type AsaasPayment } from '../src/core/lib/asaas'
import { processAsaasEvent, reconcileAsaasPayment } from '../src/core/lib/asaas-reconciliation'
async function main() {
  if(process.env.ASAAS_ENV!=='sandbox'||process.env.BITTUP_TEST_DATABASE_CONFIRMED!=='yes')
    throw new Error('Sandbox and explicit isolated database confirmation required')
  const [mode,orderId]=process.argv.slice(2)
  if(mode==='pending') {
    const rows=await prisma.asaasWebhookEvent.findMany({where:{processedAt:null},orderBy:{receivedAt:'asc'},take:20})
    let applied=0,failed=0
    for(const row of rows) {try{await processAsaasEvent(row.id,row.paymentId);applied++}catch{failed++}}
    console.info({operation:'asaas-recovery',processed:applied,failed})
    if(failed) process.exitCode=1
  } else if(mode==='order'&&orderId&&/^[a-zA-Z0-9_-]{1,128}$/.test(orderId)) {
    const order=await prisma.order.findUnique({where:{id:orderId}})
    if(!order?.customerId)throw new Error('Order has no provider customer')
    const list=await asaasFetch<{data:AsaasPayment[];hasMore:boolean}>('/payments?externalReference='+encodeURIComponent(orderId)+'&customer='+encodeURIComponent(order.customerId)+'&limit=100','GET',undefined,10000)
    // Avoid choosing an arbitrary charge when multiple attempts exist.
    if(list.hasMore!==false||!Array.isArray(list.data)||list.data.length!==1||list.data[0].externalReference!==orderId||list.data[0].customer!==order.customerId)
      throw new Error('Ambiguous reconciliation requires manual review')
    console.info({operation:'asaas-recovery',outcome:await reconcileAsaasPayment(list.data[0].id)})
  } else throw new Error('Use pending or order <orderId>')
}
main().catch(()=>{console.error({operation:'asaas-recovery',outcome:'failed'});process.exitCode=1}).finally(()=>prisma.$disconnect())
