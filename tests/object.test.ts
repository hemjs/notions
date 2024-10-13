import { omit, pick } from '../src';

describe('omit', () => {
  it('can omit excluded props and leave non-excluded alone', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 });
    expect(omit({ a: 1, b: 2, c: { d: 4 } }, ['b', 'c'])).toEqual({ a: 1 });
  });
});

describe('pick', () => {
  it('can pick included props and leave non-included alone', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
    expect(pick({ a: 1, b: 2, c: { d: 4 } }, ['b', 'c'])).toEqual({
      b: 2,
      c: { d: 4 },
    });
  });
});
