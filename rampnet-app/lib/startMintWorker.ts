import {
  peekQueue,
  removeCurrentJob,
  hasJobRunning,
  setJobRunning,
} from './mintQueue';

async function processJob(job: any) {
  try {
    console.log(
      `🚀 Minting to: ${job.memo} with ${job.amount} ${job.currency}`
    );

    // Simulate smart contract call
    await new Promise((res) => setTimeout(res, 1000));

    console.log('✅ Minting success:', job);
    removeCurrentJob(); // remove only on success
  } catch (err) {
    console.error('❌ Minting failed:', err);
    // Don't remove job — it will retry on next tick
  }
}

export function startMintWorker() {
  console.log('start');
  if (hasJobRunning()) return; // already running

  const loop = async () => {
    if (hasJobRunning()) return;

    const job = peekQueue();
    console.log(job);
    if (!job) return setTimeout(loop, 5000); // wait 5s

    setJobRunning(true);
    await processJob(job);
    setJobRunning(false);

    setTimeout(loop, 5000); // wait 5s before next attempt
  };

  loop();
}
