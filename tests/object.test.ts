import { omit, pick } from '../src';

interface User {
  name: string;
  age: number;
}

class Point {
  x = 1;
  y = 2;
}

const user: User = { name: 'Alice', age: 30 };

function withHiddenProp() {
  return Object.defineProperty({ a: 1 }, 'hidden', {
    enumerable: false,
    value: 2,
  }) as { a: number; hidden: number };
}

describe('omit', () => {
  it('can omit excluded props and leave non-excluded alone', () => {
    expect(omit({ a: 1, b: 2 }, ['a'])).toEqual({ b: 2 });
    expect(omit({ a: 1, b: 2, c: { d: 4 } }, ['b', 'c'])).toEqual({ a: 1 });
  });

  it('should drop an own __proto__ key', () => {
    const source = JSON.parse('{"__proto__":{"isAdmin":true},"a":1,"b":2}') as {
      a: number;
    };
    const result = omit(source, ['a']);
    const merged = Object.assign({}, result) as { isAdmin?: boolean };

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Object.keys(result)).toEqual(['b']);
    expect(merged.isAdmin).toBeUndefined();
  });

  it('should exclude numeric keys', () => {
    expect(omit({ 1: 'x', b: 2 }, [1])).toEqual({ b: 2 });
  });

  it('should keep symbol keys unless excluded', () => {
    const kept = Symbol('kept');
    const removed = Symbol('removed');
    const result = omit({ a: 1, [kept]: 2, [removed]: 3 }, ['a', removed]);

    expect(result[kept]).toBe(2);
    expect(Object.getOwnPropertySymbols(result)).toEqual([kept]);
  });

  it('should not confuse a symbol with a string of the same description', () => {
    const key = Symbol('a');

    expect(omit({ a: 1, [key]: 2 }, [key])).toEqual({ a: 1 });
  });

  it('should skip non-enumerable props', () => {
    expect(omit(withHiddenProp(), [])).toEqual({ a: 1 });
    expect(Object.getOwnPropertyNames(omit(withHiddenProp(), []))).toEqual([
      'a',
    ]);
  });

  it('should accept interfaces and class instances', () => {
    expect(omit(user, ['age'])).toEqual({ name: 'Alice' });
    expect(omit(new Point(), ['x'])).toEqual({ y: 2 });
  });

  it('should treat copied props as optional', () => {
    const result = omit(user, ['age']);

    expect(result.name?.length).toBe(5);
  });

  it('should only copy own enumerable props of non-plain objects', () => {
    class Greeter {
      name = 'Alice';
      greet() {
        return this.name;
      }
    }

    const result = omit(new Greeter(), []);

    expect(result.greet).toBeUndefined();
    expect(omit(new Error('boom'), ['stack'])).toEqual({});
  });

  it('should read getters and copy their values', () => {
    const source = {
      get a() {
        return 1;
      },
    };

    expect(Object.getOwnPropertyDescriptor(omit(source, []), 'a')).toEqual({
      configurable: true,
      enumerable: true,
      value: 1,
      writable: true,
    });
  });

  it('should coerce primitives and throw on nullish values', () => {
    expect(omit(5 as never, [])).toEqual({});
    expect(omit('ab' as never, [])).toEqual({ 0: 'a', 1: 'b' });
    expect(() => omit(null as never, [])).toThrow(TypeError);
  });

  it('should not mutate the source', () => {
    const source = { a: 1, b: 2 };

    omit(source, ['a']);
    expect(source).toEqual({ a: 1, b: 2 });
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

  it('should drop an own __proto__ key', () => {
    const source = JSON.parse('{"__proto__":{"isAdmin":true}}') as Record<
      string,
      unknown
    >;
    const result = pick(source, ['__proto__']);

    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
    expect(Reflect.ownKeys(result)).toEqual([]);
  });

  it('should pick numeric and symbol keys', () => {
    const key = Symbol('a');

    expect(pick({ 1: 'x', b: 2 }, [1])).toEqual({ 1: 'x' });
    expect(pick({ a: 1, [key]: 2 }, [key])[key]).toBe(2);
  });

  it('should skip inherited, missing and non-enumerable props', () => {
    const inherited = Object.create({ m: 1 }) as { m: number };
    const missing = { a: 1 } as { a: number; b?: number };

    expect(pick(inherited, ['m'])).toEqual({});
    expect(pick(missing, ['b'])).toEqual({});
    expect(
      Object.getOwnPropertyNames(pick(withHiddenProp(), ['hidden'])),
    ).toEqual([]);
  });

  it('should skip non-enumerable props of built-ins', () => {
    expect(pick(new Error('boom'), ['message', 'stack'])).toEqual({});
    expect(pick([1, 2], ['length'])).toEqual({});
  });

  it('should read getters and copy their values', () => {
    const source = {
      get a() {
        return 1;
      },
    };

    expect(Object.getOwnPropertyDescriptor(pick(source, ['a']), 'a')).toEqual({
      configurable: true,
      enumerable: true,
      value: 1,
      writable: true,
    });
  });

  it('should treat picked props as optional', () => {
    const result = pick(user, ['name']);

    expect(result.name?.length).toBe(5);
  });

  it('should keep the order of the inclusions', () => {
    expect(Object.keys(pick({ a: 1, b: 2 }, ['b', 'a']))).toEqual(['b', 'a']);
  });

  it('should accept interfaces and class instances', () => {
    expect(pick(user, ['age'])).toEqual({ age: 30 });
    expect(pick(new Point(), ['x'])).toEqual({ x: 1 });
  });

  it('should be the complement of omit', () => {
    const key = Symbol('a');
    const source = { a: 1, b: 2, [key]: 3 };

    expect({ ...pick(source, ['a']), ...omit(source, ['a']) }).toEqual(source);
  });
});
