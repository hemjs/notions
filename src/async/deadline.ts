import { delay } from './delay';

export interface DeadlineOptions {
  /** Signal used to abort the deadline. */
  signal?: AbortSignal;
}

export class DeadlineError extends Error {
  constructor() {
    super('Deadline');
    this.name = this.constructor.name;
  }
}

/**
 * Create a promise which will be rejected with {@linkcode DeadlineError} when a given
 * delay is exceeded.
 */
export function deadline<T>(
  p: Promise<T>,
  ms: number,
  options: DeadlineOptions = {},
): Promise<T> {
  const controller = new AbortController();
  const { signal } = options;
  if (signal?.aborted) {
    return Promise.reject(new DeadlineError());
  }
  signal?.addEventListener('abort', () => controller.abort(signal.reason));
  const d = delay(ms, { signal: controller.signal })
    .catch(() => {
      // Do NOTHING on abort
    })
    .then(() => Promise.reject(new DeadlineError()));
  return Promise.race([p.finally(() => controller.abort()), d]);
}
