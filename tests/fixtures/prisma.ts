import { Decimal } from '@prisma/client/runtime/client'
const state=globalThis as unknown as {mockCommerce?:any}
const product={id:'synthetic-product',slug:'synthetic-product',name:'Produto Sintético',description:'Produto exclusivo de teste',price:new Decimal(20),stock:100,images:[],colors:[],sizes:[],createdAt:new Date(),updatedAt:new Date()}
const data=state.mockCommerce??={orders:new Map(),events:new Map(),payment:null}
export const mockState=data
export const prisma:any={
  blogCategory:{findMany:async()=>[]},
  category:{findMany:async()=>[]},
  post:{findMany:async()=>[]},
  product:{findMany:async()=>[product],findUnique:async()=>product,updateMany:async()=>({count:1})},
  order:{findUnique:async({where}:any)=>data.orders.get(where.id)??null,
    create:async({data:entry}:any)=>{const row={...entry,id:'synthetic-order',createdAt:new Date(),items:entry.items.create};data.orders.set(row.id,row);return row},
    update:async({where,data:patch}:any)=>Object.assign(data.orders.get(where.id),patch),
    updateMany:async({where,data:patch}:any)=>{const row=data.orders.get(where.id);if(!row||row.statusPagamento!==where.statusPagamento)return {count:0};Object.assign(row,patch);return {count:1}}},
  asaasWebhookEvent:{upsert:async({where,create}:any)=>{if(!data.events.has(where.id))data.events.set(where.id,{...create,processedAt:null});return data.events.get(where.id)},update:async({where,data:patch}:any)=>Object.assign(data.events.get(where.id),patch)},
  $queryRaw:async()=>[],$transaction:async(callback:any)=>callback(prisma)
}
export default prisma
