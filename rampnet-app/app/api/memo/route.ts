import { NextRequest } from 'next/server';
import { WisePaymentMemo } from '@/types';
import connectDB from '@/lib/mongodb';
import Payment from '@/_models/Payment';

function encodeWiseMemo(data: WisePaymentMemo): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received memo request:', body);
    const { usdAmount, address, currency, network } = body;

    const memoPayload: WisePaymentMemo = {
      usdAmount,
      address,
      currency,
      network,
      ts: Date.now(),
    };

    const base64Memo = encodeWiseMemo(memoPayload);
    const fullMemo = `ONRAMP:${base64Memo}`;

    // Connect to database and create payment record
    await connectDB();
    
    // Create new payment with pending status
    const payment = new Payment({
      memo: fullMemo,
      paymentStatus: 'pending',
      txHash: null
    });

    await payment.save();
    console.log('Payment created in database:', {
      memo: payment.memo,
      status: payment.paymentStatus,
      createdAt: payment.createdAt
    });

    return new Response(
      JSON.stringify({
        success: true,
        memo: fullMemo,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Memo generation error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}