type MintJob = {
  transferId: string;
};

class MintQueue {
  private queue: MintJob[] = [];
  private isProcessing = false;

  add(job: MintJob) {
    this.queue.push(job);
    console.log('🧾 Queued job:', job);
  }

  peek(): MintJob | null {
    return this.queue.length > 0 ? this.queue[0] : null;
  }

  remove() {
    this.queue.shift();
  }

  hasJobRunning(): boolean {
    return this.isProcessing;
  }

  setJobRunning(running: boolean) {
    this.isProcessing = running;
  }

  logState() {
    console.log('JOBS', this.queue.length > 0 ? this.queue[0] : null);
  }
}

const globalAny = globalThis as any;

export const mintQueue: MintQueue = (globalAny.mintQueue ||= new MintQueue());
