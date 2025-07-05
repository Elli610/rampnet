type MintJob = {
  transferId: string;
};

const queue: MintJob[] = [];

let isProcessing = false;

export function addToQueue(job: MintJob) {
  queue.push(job);
  console.log(`🧾 Queued job:`, job);
}

export function peekQueue(): MintJob | null {
  return queue.length > 0 ? queue[0] : null;
}

export function removeCurrentJob() {
  queue.shift(); // only call after successful execution
}

export function hasJobRunning() {
  return isProcessing;
}

export function setJobRunning(running: boolean) {
  isProcessing = running;
}
