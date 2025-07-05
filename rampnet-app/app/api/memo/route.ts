import { NextRequest } from 'next/server';
import { encodePackedBytes, Uint8ArrayToHex } from '@/lib/memo';
import connectDB from '@/lib/mongodb';
import Payment from '@/_models/Payment';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Received memo request:', body);
    const { usdAmount, address, currency, network } = body;
    console.log({ usdAmount, address, currency, network });

    const fullMemo = Uint8ArrayToHex(
      encodePackedBytes(address.slice(2), network, currency, BigInt(usdAmount))
    );
    await connectDB();

    // Create new payment with pending status
    const payment = new Payment({
      memo: fullMemo,
      paymentStatus: 'pending',
      txHash: null,
      usdAmount,
      address,
      chainId: network,
      currencyTicker: currency,
    });

    await payment.save();
    console.log('Payment created in database:', {
      memo: payment.memo,
      status: payment.paymentStatus,
      createdAt: payment.createdAt,
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
