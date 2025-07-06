import { mintQueue } from '@/lib/mintQueue';
import { decodePackedBytes, hexToUint8Array } from './memo';
import { processWisePaymentAttestation } from './attestation/index';
import Payment from '@/_models/Payment';

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

async function processJob(job: { transferId: string }) {
  console.log(`🔍 Processing transfer ID: ${job.transferId}`);

  const details = await fetchTransferDetails(job.transferId);

  const amount = details.sourceValue;
  const currency = details.sourceCurrency;
  const memo = details.paymentReference;

  if (!memo) {
    throw new Error('Missing memo in transfer');
  }

  const decoded = decodePackedBytes(hexToUint8Array(memo));
  console.log('Decoded memo:', decoded);
  
  // Vérifier si le payment existe avant de le mettre à jour
  const payment = await Payment.findOne({ memo });
  if (!payment) {
    throw new Error(`Payment not found for memo: ${memo}`);
  }

  console.log(`📄 Found payment: ${payment._id}, current status: ${payment.paymentStatus}`);

  console.log('✅ Transfer Info:');
  console.log('Amount:', amount);
  console.log('Currency:', currency);
  console.log('Decoded Memo:', decoded);

  // Process Wise payment attestation
  console.log('🔐 Starting Wise payment attestation...');
  try {
    await processWisePaymentAttestation(parseInt(job.transferId));
    console.log('✅ Wise payment attestation completed successfully');
    
    // Update payment status to confirmed ONLY after successful attestation
    const updateResult = await Payment.updateOne(
      { memo }, 
      { paymentStatus: 'confirmed' }
    );
    console.log('📄 Update result:', updateResult);
    console.log('📄 Payment status updated to: confirmed');
    
  } catch (error) {
    console.error('❌ Wise payment attestation failed:', error);
    const updateResult = await Payment.updateOne(
      { memo }, 
      { paymentStatus: 'failed' }
    );
    console.log('📄 Update result:', updateResult);
    console.log('📄 Payment status updated to: failed');
    throw error; // Re-throw to trigger job failure handling
  }

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