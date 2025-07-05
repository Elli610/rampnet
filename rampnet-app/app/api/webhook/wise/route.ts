import { NextRequest } from 'next/server';
import crypto from 'crypto';

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

export async function POST(req: NextRequest) {
  const signature = req.headers.get('x-signature-sha256') || '';

  const rawBody = await req.text(); // Needed for verification
  const isVerified = verifySignature(rawBody, signature);

  if (!isVerified) {
    console.error('❌ Invalid signature – rejecting request');
    return new Response('Invalid signature', { status: 400 });
  }

  const payload = JSON.parse(rawBody);
  console.log('📦 Verified Wise Webhook Payload:');
  console.log(JSON.stringify(payload, null, 2));

  const { event_type, data } = payload;

  if (event_type === 'balance.credit') {
    const memo = data?.details?.paymentReference || '';
    const amount = data?.amount?.value;
    const currency = data?.amount?.currency;

    console.log(`💰 Balance Credit Received: ${amount} ${currency}`);
    console.log(`📝 Memo: ${memo}`);

    // TODO: Parse `memo` to extract target address or purpose
    // TODO: Trigger smart contract call using the data

    // Example:
    // if (memo.startsWith('mint:')) {
    //   const address = memo.split(':')[1];
    //   await mintTo(address, amount);
    // }
  }

  return new Response('Webhook received and verified', { status: 200 });
}
