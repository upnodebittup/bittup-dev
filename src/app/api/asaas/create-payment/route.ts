import { NextRequest, NextResponse } from 'next/server';
import { asaasFetch, AsaasPayment } from '@/core/lib/asaas';
import { prisma } from '@/core/lib/prisma';
import * as yup from 'yup';

export const runtime = 'nodejs';

// Comissão fixa da Upnode por venda (em R$)
const UPNODE_COMMISSION = 0.50;

const createPaymentSchema = yup.object({
  customerId: yup.string().required(),
  orderId: yup.string().required(),
  total: yup.number().required().positive(),

  billingType: yup
    .string()
    .oneOf(['CREDIT_CARD', 'PIX'])
    .required(),

  creditCardData: yup
    .object({
      creditCardNumber: yup.string().matches(/^\d{16}$/),
      creditCardExpirationMonth: yup.string().matches(/^(0[1-9]|1[0-2])$/),
      creditCardExpirationYear: yup.string().matches(/^\d{4}$/),
      creditCardCvv: yup.string().matches(/^\d{3,4}$/),
      creditCardHolderName: yup.string(),
    })
    .nullable()
    .notRequired()
    .when('billingType', {
      is: 'CREDIT_CARD',
      then: (schema) =>
        schema.shape({
          creditCardNumber: yup.string().matches(/^\d{16}$/).required(),
          creditCardExpirationMonth: yup.string().matches(/^(0[1-9]|1[0-2])$/).required(),
          creditCardExpirationYear: yup.string().matches(/^\d{4}$/).required(),
          creditCardCvv: yup.string().matches(/^\d{3,4}$/).required(),
          creditCardHolderName: yup.string().required(),
        }),
    }),

  dueDate: yup.string().optional(),
});

type CreatePaymentRequest = yup.InferType<typeof createPaymentSchema>;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    let validatedData: CreatePaymentRequest;
    try {
      validatedData = await createPaymentSchema.validate(body, {
        abortEarly: false,
      });
    } catch (validationError: any) {
      return NextResponse.json(
        { error: 'Validação falhou', details: validationError.errors },
        { status: 400 }
      );
    }

    if (validatedData.billingType === 'CREDIT_CARD' && !validatedData.creditCardData) {
      return NextResponse.json(
        { error: 'creditCardData é obrigatório para cartão' },
        { status: 400 }
      );
    }

    // 📦 Busca o pedido para pegar dados reais do comprador
    const order = await prisma.order.findUnique({
      where: { id: validatedData.orderId },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Pedido não encontrado' },
        { status: 404 }
      );
    }

    // 👤 Busca o cliente cadastrado pelo email do pedido para pegar walletId
    const client = await prisma.client.findUnique({
      where: { email: order.email },
    });

    const remoteIp =
      req.headers.get('x-forwarded-for') ||
      req.headers.get('x-real-ip') ||
      '127.0.0.1';

    const dueDate = ensureFutureDate(
      validatedData.dueDate || getDefaultDueDate(validatedData.billingType)
    );

    const payload: any = {
      customer: validatedData.customerId,
      billingType: validatedData.billingType,
      value: validatedData.total,
      dueDate,
      description: `Pedido #${validatedData.orderId}`,
      externalReference: validatedData.orderId,
      remoteIp,
    };

    // 💰 Splits: repassa para carteira do cliente e retira comissão da Upnode
    const upnodeWalletId = process.env.UPNODE_WALLET_ID;
    if (client?.asaasWalletId && upnodeWalletId) {
      payload.splits = [
        {
          // Cliente recebe o total menos a comissão da Upnode
          walletId: client.asaasWalletId,
          fixedValue: Number((validatedData.total - UPNODE_COMMISSION).toFixed(2)),
        },
        {
          // Upnode recebe R$0,50 fixo por venda
          walletId: upnodeWalletId,
          fixedValue: UPNODE_COMMISSION,
        },
      ];
      console.log(`[Asaas] Split configurado: cliente ${client.asaasWalletId} recebe R$${payload.splits[0].fixedValue}`);
    } else {
      console.warn('[Asaas] ⚠️ Split não configurado:', {
        clienteEncontrado: !!client,
        clienteTemWallet: !!client?.asaasWalletId,
        upnodeWalletConfigurado: !!upnodeWalletId,
      });
    }

    // 💳 CARTÃO — com dados reais do pedido
    if (validatedData.billingType === 'CREDIT_CARD' && validatedData.creditCardData) {
      const address = order.address as any;

      payload.creditCard = {
        holderName: validatedData.creditCardData.creditCardHolderName,
        number: validatedData.creditCardData.creditCardNumber,
        expiryMonth: validatedData.creditCardData.creditCardExpirationMonth,
        expiryYear: validatedData.creditCardData.creditCardExpirationYear,
        ccv: validatedData.creditCardData.creditCardCvv,
      };

      payload.creditCardHolderInfo = {
        name: order.fullName,
        email: order.email,
        cpfCnpj: order.cpf,
        postalCode: address?.cep?.replace(/\D/g, '') || '',
        addressNumber: address?.numero || 'S/N',
        phone: order.phone,
      };
    }

    console.log('[Asaas Create Payment] Payload:', {
      billingType: payload.billingType,
      value: payload.value,
      orderId: validatedData.orderId,
      customerId: validatedData.customerId,
      dueDate: payload.dueDate,
      hasSplits: !!payload.splits,
    });

    const payment = await asaasFetch<AsaasPayment>(
      '/payments',
      'POST',
      payload
    );

    console.log('[Asaas Create Payment] Success:', payment.id);

    // 🔗 Vincula o pedido ao client cadastrado se encontrado
    if (client) {
      await prisma.order.update({
        where: { id: validatedData.orderId },
        data: { clientId: client.id },
      });
    }

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      payment,
    });
  } catch (error: any) {
    console.error('[Asaas Create Payment Error]:', error);

    return NextResponse.json(
      {
        error: error.message || 'Erro ao criar cobrança no Asaas',
      },
      { status: 400 }
    );
  }
}

function getDefaultDueDate(billingType: string): string {
  const date = new Date();
  date.setDate(date.getDate() + (billingType === 'CREDIT_CARD' ? 1 : 30));
  return formatDate(date);
}

function ensureFutureDate(dateStr: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const input = new Date(dateStr);
  input.setHours(0, 0, 0, 0);

  if (input <= today) {
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    return formatDate(tomorrow);
  }

  return dateStr;
}

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
