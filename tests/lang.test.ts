import {
  isBoolean,
  isEmpty,
  isFunction,
  isNil,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isString,
  isSymbol,
  isUndefined,
} from '../src';

function Foo() {}

describe('isBoolean', () => {
  it('should return true when value is a boolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it('should return false when value is not a boolean', () => {
    expect(isBoolean()).toBe(false);
    expect(isBoolean('abc')).toBe(false);
  });
});

describe('isEmpty', () => {
  it('should return true for null and undefined values', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
  });

  it('should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('    ')).toBe(true);
  });

  it('should return true for integer 0 and float 0.0', () => {
    expect(isEmpty(0)).toBe(true);
    expect(isEmpty(0.0)).toBe(true);
  });

  it('should return true boolean value false', () => {
    expect(isEmpty(false)).toBe(true);
  });

  it('should return true for empty arrays', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([undefined, null, ''])).toBe(true);
    expect(isEmpty([false])).toBe(true);
    expect(isEmpty([{}, NaN, 0, 0.0])).toBe(true);
    expect(isEmpty([{ a: null, b: undefined, c: '' }])).toBe(true);
  });

  it('should return true for empty objects', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: null, b: undefined, c: '' })).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty('123')).toBe(false);
  });

  it('should return false for arrays with non-empty elements', () => {
    expect(isEmpty([1, 'hello'])).toBe(false);
    expect(isEmpty([{ a: 1 }])).toBe(false);
  });

  it('should return false for objects with non-empty properties', () => {
    expect(isEmpty({ a: 1, b: 'hello', c: true })).toBe(false);
    expect(isEmpty({ a: {}, b: [], c: NaN })).toBe(false);
  });

  it('should distinguish between empty strings and "null" and "undefined" strings', () => {
    expect(isEmpty('null')).toBe(false);
    expect(isEmpty('undefined')).toBe(false);
  });

  it('should correctly handle nested arrays and objects', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([[], {}])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty({ a: [], b: {} })).toBe(false);
    expect(isEmpty([{ a: 1 }, 'hello'])).toBe(false);
    expect(isEmpty({ a: 1, b: 'hello' })).toBe(false);
  });
});

describe('isFunction', () => {
  it('should return true when value is a function', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
  });

  it('should return false when value is not a function', () => {
    expect(isFunction()).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction('abc')).toBe(false);
  });
});

describe('isNil', () => {
  it('should return true when value is nil', () => {
    expect(isNil()).toBe(true);
    expect(isNil(null)).toBe(true);
    expect(isNil(undefined)).toBe(true);
  });

  it('should return false when value is not nil', () => {
    expect(isNull('abc')).toBe(false);
  });
});

describe('isNull', () => {
  it('should return true when value is null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false when value is not null', () => {
    expect(isNull()).toBe(false);
    expect(isNull(undefined)).toBe(false);
    expect(isNull('abc')).toBe(false);
  });
});

describe('isNumber', () => {
  it('should return true when value is a number or NaN', () => {
    expect(isNumber(123)).toBe(true);
    expect(isNumber(1.23)).toBe(true); // with decimals
    expect(isNumber(123e-5)).toBe(true); // scientific (exponent) notation
    expect(isNumber(0o1)).toBe(true); // octal notation
    expect(isNumber(0b1)).toBe(true); // binary notation
    expect(isNumber(0x1)).toBe(true); // hexadecimal notation
    expect(isNumber(NaN)).toBe(true);
  });

  it('should return false when value is not a number', () => {
    expect(isNumber()).toBe(false); // undefined
    expect(isNumber(null)).toBe(false); // nullish
    expect(isNumber(undefined)).toBe(false); // undefined
    expect(isNumber('123')).toBe(false); // string
  });
});

describe('isObject', () => {
  it('should return true when value is an object', () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(true);
    expect(isObject(new Number(123))).toBe(true);
  });

  it('should return false when value is not an object', () => {
    expect(isObject()).toBe(false);
    expect(isObject(null)).toBe(false);
    expect(isObject(undefined)).toBe(false);
    expect(isObject('abc')).toBe(false);
    expect(isObject(123)).toBe(false);
    expect(isObject(Number(123))).toBe(false);
  });
});

describe('isPlainObject', () => {
  it('should return true when obj is plain object', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ prop: true })).toBe(true);
    expect(
      isPlainObject({
        constructor: Foo,
      }),
    ).toBe(true);
    expect(isPlainObject(Object.create(null))).toBe(true);
  });

  it('should return false when object is not plain object', () => {
    expect(isPlainObject()).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject('abc')).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
  });
});

describe('isString', () => {
  it('should return true when value is a string', () => {
    expect(isString('abc')).toBe(true);
  });

  it('should return false when value is not a string', () => {
    expect(isString()).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString(false)).toBe(false);
    expect(isString(123)).toBe(false);
    expect(isString(new String('fine'))).toBe(false); // object
  });
});

describe('isSymbol', () => {
  it('should return true when value is a Symbol', () => {
    expect(isSymbol(Symbol())).toBe(true);
    expect(isSymbol(Symbol('abc'))).toBe(true);
  });

  it('should return false when value is not a symbol', () => {
    expect(isSymbol('Symbol()')).toBe(false); // string
    expect(isSymbol(false)).toBe(false);
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
  });
});

describe('isUndefined', () => {
  it('should return true when value is undefined', () => {
    expect(isUndefined()).toBe(true);
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false when value is not undefined', () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('sabc')).toBe(false);
  });
});
