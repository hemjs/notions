import { DeadlineError, deadline, delay } from '../src';

test('return fulfilled promise', async () => {
  const controller = new AbortController();
  const { signal } = controller;
  const p = delay(100, { signal })
    .catch(() => {})
    .then(() => 'Hello');
  const result = await deadline(p, 1000);
  expect(result).toEqual('Hello');
  controller.abort();
});

test('throw DeadlineError', async () => {
  const controller = new AbortController();
  const { signal } = controller;
  const p = delay(1000, { signal })
    .catch(() => {})
    .then(() => 'Hello');
  await expect(async () => {
    await deadline(p, 100);
  }).rejects.toThrow(DeadlineError);
  controller.abort();
});

test('throw when promise is rejected', async () => {
  const controller = new AbortController();
  const { signal } = controller;
  const p = delay(100, { signal })
    .catch(() => {})
    .then(() => Promise.reject(new Error('booom')));
  await expect(async () => {
    await deadline(p, 1000);
  }).rejects.toThrow('booom');
  await expect(async () => {
    await deadline(p, 1000);
  }).rejects.toThrow(Error);
});

test('with non-aborted signal', async () => {
  const controller = new AbortController();
  const { signal } = controller;
  const p = delay(100, { signal })
    .catch(() => {})
    .then(() => 'Hello');
  const abort = new AbortController();
  const result = await deadline(p, 1000, { signal: abort.signal });
  expect(result).toEqual('Hello');
  controller.abort();
});

test('with signal aborted after delay', async () => {
  const controller = new AbortController();
  const { signal } = controller;
  const p = delay(100, { signal })
    .catch(() => {})
    .then(() => 'Hello');
  const abort = new AbortController();
  const promise = deadline(p, 100, { signal: abort.signal });
  abort.abort();
  await expect(async () => {
    await promise;
  }).rejects.toThrow(DeadlineError);
  controller.abort();
});

test('with already aborted signal', async () => {
  const controller = new AbortController();
  const { signal } = controller;
  const p = delay(100, { signal })
    .catch(() => {})
    .then(() => 'Hello');
  const abort = new AbortController();
  abort.abort();
  await expect(async () => {
    await deadline(p, 100, { signal: abort.signal });
  }).rejects.toThrow(DeadlineError);
  controller.abort();
});
