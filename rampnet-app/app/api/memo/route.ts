import { NextRequest } from 'next/server';
import { WisePaymentMemo, SupportedNetwork } from '@/types';

function encodeWiseMemo(data: WisePaymentMemo): string {
  return Buffer.from(JSON.stringify(data)).toString('base64');
}

function isValidNetwork(value: string): value is SupportedNetwork {
  return Object.values(SupportedNetwork).includes(value as SupportedNetwork);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { usdAmount, address, currency, network } = body;

    if (
      typeof usdAmount !== 'number' ||
      usdAmount <= 0 ||
      typeof address !== 'string' ||
      address.length < 10 ||
      typeof currency !== 'string' ||
      !isValidNetwork(network)
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid input',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
