import {mockState} from './prisma'
export class AsaasError extends Error { category='validation' }
export const logAsaasFailure=()=>{}
export async function asaasFetch(endpoint:string,method='GET',body?:any) {
  if(endpoint.startsWith('/customers?'))return {data:[],hasMore:false}
  if(endpoint==='/customers')return {id:'cus_synthetic'}
  if(endpoint==='/payments'&&method==='POST') {mockState.payment={...body,id:'pay_synthetic',status:'PENDING'};return mockState.payment}
  if(endpoint.endsWith('/pixQrCode'))return {encodedImage:'',payload:'PIX-SIMULADO-SEM-VALOR',expirationDate:'2030-01-01'}
  if(endpoint==='/payments/pay_synthetic')return {...mockState.payment,status:'RECEIVED'}
  throw new Error('Unexpected mocked provider operation')
}
