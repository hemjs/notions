import { delay } from '../src';

test('delay', async () => {
  const start = new Date();
  const delayedPromise = delay(100);
  const result = await delayedPromise;
  const diff = new Date().getTime() - start.getTime();
  expect(result).toBeUndefined();
  expect(diff).toBeGreaterThanOrEqual(100);
});

test('delay with abort', async function () {
  const start = new Date();
  const abort = new AbortController();
  const { signal } = abort;
  const delayedPromise = delay(100, { signal });
  setTimeout(() => abort.abort(), 0);
  await expect(() => delayedPromise).rejects.toThrow();
  const diff = new Date().getTime() - start.getTime();
  expect(diff).toBeLessThan(100);
});

test('delay with non-aborted signal', async () => {
  const start = new Date();
  const abort = new AbortController();
  const { signal } = abort;
  const delayedPromise = delay(100, { signal });
  const result = await delayedPromise;
  const diff = new Date().getTime() - start.getTime();
  expect(result).toBeUndefined();
  expect(diff).toBeGreaterThanOrEqual(100);
});

test('delay with signal aborted after delay', async () => {
  const start = new Date();
  const abort = new AbortController();
  const { signal } = abort;
  const delayedPromise = delay(100, { signal });
  const result = await delayedPromise;
  abort.abort();
  const diff = new Date().getTime() - start.getTime();
  expect(result).toBeUndefined();
  expect(diff).toBeGreaterThanOrEqual(100);
});

test('delay with already aborted signal', async () => {
  const start = new Date();
  const abort = new AbortController();
  abort.abort();
  const { signal } = abort;
  const delayedPromise = delay(100, { signal });
  await expect(() => delayedPromise).rejects.toThrow();
  const diff = new Date().getTime() - start.getTime();
  expect(diff).toBeLessThan(100);
});
