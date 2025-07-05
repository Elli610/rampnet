import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { mintQueue } from '@/lib/mintQueue';

const WISE_PUBLIC_KEY = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvO8vXV+JksBzZAY6GhSO
XdoTCfhXaaiZ+qAbtaDBiu2AGkGVpmEygFmWP4Li9m5+Ni85BhVvZOodM9epgW3F
bA5Q1SexvAF1PPjX4JpMstak/QhAgl1qMSqEevL8cmUeTgcMuVWCJmlge9h7B1CS
D4rtlimGZozG39rUBDg6Qt2K+P4wBfLblL0k4C4YUdLnpGYEDIth+i8XsRpFlogx
CAFyH9+knYsDbR43UJ9shtc42Ybd40Afihj8KnYKXzchyQ42aC8aZ/h5hyZ28yVy
Oj3Vos0VdBIs/gAyJ/4yyQFCXYte64I7ssrlbGRaco4nKF3HmaNhxwyKyJafz19e
HwIDAQAB
-----END PUBLIC KEY-----
`.trim();

function verifySignature(body: string, signatureBase64: string): boolean {
  const verifier = crypto.createVerify('RSA-SHA256');
  verifier.update(body);
  verifier.end();
  return verifier.verify(WISE_PUBLIC_KEY, signatureBase64, 'base64');
}

async function getLatestTransferActivity(expectedAmount: string) {
  const WISE_API_TOKEN = process.env.WISE_API_KEY!;
  const PROFILE_ID = process.env.WISE_PROFILE_ID!;
  const res = await fetch(
    `https://api.wise.com/v1/profiles/${PROFILE_ID}/activities`,
    {
      headers: {
        Authorization: `Bearer ${WISE_API_TOKEN}`,
      },
      next: { revalidate: 0 },
    }
  );

  const json = await res.json();
  const activities = json.activities || [];

  const latest = activities.find(
    (a: any) =>
      a.type === 'TRANSFER' &&
      a.status === 'COMPLETED' &&
      a.primaryAmount.includes(expectedAmount)
  );

  return latest?.resource?.id;
}

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature-sha256') || '';
  const rawBody = await req.text();
  const isVerified = verifySignature(rawBody, signature);

  /* if (!isVerified) {
    console.error('❌ Invalid signature – rejecting request');
    return new NextResponse('Invalid signature', { status: 400 });
  }*/

  const payload = JSON.parse(rawBody);
  console.log('📦 Verified Wise Webhook Payload:', payload);

  const { event_type, data } = payload;
  console.log(event_type);

  console.log(data);
  if (event_type === 'balances#credit') {
    const amount = data?.amount;
    const currency = data?.currency;

    console.log(`💰 Balance Credit Received: ${amount} ${currency}`);

    const transferId = await getLatestTransferActivity(amount);

    if (transferId) {
      mintQueue.add({
        transferId,
      });
      mintQueue.logState();
    } else {
      console.warn('⚠️ Could not find matching transfer in Wise activities');
    }
  }

  return new NextResponse('Webhook received and verified', { status: 200 });
}
