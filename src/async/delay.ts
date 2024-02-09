export interface DelayOptions {
  /** Signal used to abort the delay. */
  signal?: AbortSignal;
}

/**
 * Resolve a {@linkcode Promise} after a given amount of milliseconds.
 */
export function delay(ms: number, options: DelayOptions = {}): Promise<void> {
  const { signal } = options;
  if (signal?.aborted) return Promise.reject(signal.reason);
  return new Promise((resolve, reject) => {
    const abort = () => {
      clearTimeout(i);
      reject(signal?.reason);
    };
    const done = () => {
      signal?.removeEventListener('abort', abort);
      resolve();
    };
    const i = setTimeout(done, ms);
    signal?.addEventListener('abort', abort, { once: true });
  });
}
