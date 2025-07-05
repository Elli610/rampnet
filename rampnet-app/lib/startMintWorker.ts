import { mintQueue } from '@/lib/mintQueue';
import { WisePaymentMemo } from '@/types';

const WISE_API_TOKEN = process.env.WISE_API_KEY!;

async function fetchTransferDetails(transferId: string) {
  const res = await fetch(
    `https://wise.com/api/v3/payment/details?paymentId=${transferId}&simplifiedResult=0`,
    {
      headers: {
        Authorization: `Bearer ${WISE_API_TOKEN}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch transfer details: ${res.status}`);
  }

  return await res.json();
}

function decodeMemo(memo: string): WisePaymentMemo {
  if (!memo.startsWith('ONRAMP:')) {
    throw new Error('Invalid memo format');
  }

  const base64Payload = memo.replace('ONRAMP:', '');
  const json = Buffer.from(base64Payload, 'base64').toString('utf-8');
  return JSON.parse(json);
}

async function processJob(job: { transferId: string }) {
  console.log(`🔍 Processing transfer ID: ${job.transferId}`);

  const details = await fetchTransferDetails(job.transferId);

  const amount = details.sourceValue;
  const currency = details.sourceCurrency;
  const memo = details.paymentReference;

  console.log({ amount, currency, memo });
  if (!memo) {
    throw new Error('Missing memo in transfer');
  }

  const decoded: WisePaymentMemo = decodeMemo(memo);

  console.log('✅ Transfer Info:');
  console.log('Amount:', amount);
  console.log('Currency:', currency);
  console.log('Decoded Memo:', decoded);

  // TODO: Smart contract call to mint
  // await mintTo(decoded.address, amount, decoded.currency, decoded.network);

  // Only remove if succeeded
  mintQueue.remove();
}

export function startMintWorker() {
  if (mintQueue.hasJobRunning()) {
    console.log('⏳ Worker already running, skipping startup');
    return;
  }

  console.log('🚀 Starting Mint Worker...');

  const loop = async () => {
    if (mintQueue.hasJobRunning()) {
      console.log('⏱️ A job is already running, waiting...');
      return;
    }

    const job = mintQueue.peek();
    mintQueue.logState();

    if (!job) {
      console.log('📭 No job in queue, retrying in 5 seconds');
      return setTimeout(loop, 5000);
    }

    console.log(`📦 Found job in queue: ${JSON.stringify(job)}`);
    mintQueue.setJobRunning(true);

    try {
      console.log('🔧 Starting job processing...');
      await processJob(job);
      console.log('✅ Job processed successfully');
    } catch (err) {
      console.error('❌ Job failed:', err);
    } finally {
      mintQueue.setJobRunning(false);
      console.log('🔁 Waiting 5 seconds before next loop');
      setTimeout(loop, 5000);
    }
  };

  loop();
}
