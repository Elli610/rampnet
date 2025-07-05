import { NextRequest } from 'next/server';
import { WisePaymentMemo } from '@/types';

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

    return new Response(
      JSON.stringify({
        success: true,
        memo: `ONRAMP:${base64Memo}`,
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
