import { runInNewContext } from 'node:vm';
import {
  isBigInt,
  isBoolean,
  isClass,
  isDate,
  isDefined,
  isEmpty,
  isError,
  isFiniteNumber,
  isFunction,
  isMap,
  isNil,
  isNull,
  isNumber,
  isObject,
  isPlainObject,
  isPrimitive,
  isPromise,
  isSet,
  isString,
  isSymbol,
  isUndefined,
} from '../src';

function Foo() {}

class Bar {}

describe('isBigInt', () => {
  it('should return true when value is a bigint', () => {
    expect(isBigInt(BigInt(1))).toBe(true);
  });

  it('should return false when value is not a bigint', () => {
    expect(isBigInt(1)).toBe(false);
    expect(isBigInt('1')).toBe(false);
  });
});

describe('isBoolean', () => {
  it('should return true when value is a boolean', () => {
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  it('should return false when value is not a boolean', () => {
    expect(isBoolean(undefined)).toBe(false);
    expect(isBoolean('abc')).toBe(false);
  });
});

describe('isClass', () => {
  it('should return true when value is a class', () => {
    expect(isClass(Bar)).toBe(true);
  });

  it('should recognise classes regardless of source formatting', () => {
    // prettier-ignore
    expect(isClass(class{})).toBe(true);
    // prettier-ignore
    expect(isClass(class/*c*/A{})).toBe(true);
    // prettier-ignore
    expect(isClass(class
      A {})).toBe(true);
    expect(isClass(class extends Bar {})).toBe(true);
  });

  it('should ignore an overridden toString', () => {
    expect(
      isClass(
        class A {
          static toString() {
            return 'A';
          }
        },
      ),
    ).toBe(true);
    expect(
      isClass(
        class A {
          static toString() {}
        },
      ),
    ).toBe(true);

    const fn = () => {};
    fn.toString = null as never;
    expect(isClass(fn)).toBe(false);
  });

  it('should return false when value is not a class', () => {
    expect(isClass(Foo)).toBe(false);
    expect(isClass(new Bar())).toBe(false);
    /* eslint-disable @typescript-eslint/unbound-method */
    expect(isClass({ class() {} }.class)).toBe(false);
    // prettier-ignore
    expect(isClass({ class () {} }.class)).toBe(false);
    expect(isClass({ classy() {} }.classy)).toBe(false);
    /* eslint-enable @typescript-eslint/unbound-method */
  });
});

describe('isDate', () => {
  it('should return true when value is a date', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('x'))).toBe(true);
    expect(isDate(runInNewContext('new Date()'))).toBe(true);
  });

  it('should return false when value is not a date', () => {
    expect(isDate(Date.now())).toBe(false);
    expect(isDate({ [Symbol.toStringTag]: 'Date' })).toBe(false);
    expect(isDate(Object.create(Date.prototype))).toBe(false);
  });
});

describe('isDefined', () => {
  it('should return true when value is not nullish', () => {
    expect(isDefined(0)).toBe(true);
    expect(isDefined('')).toBe(true);
    expect(isDefined(false)).toBe(true);
  });

  it('should return false when value is nullish', () => {
    expect(isDefined(null)).toBe(false);
    expect(isDefined(undefined)).toBe(false);
  });

  it('should narrow when used as a filter', () => {
    const values: string[] = ['a', null, undefined].filter(isDefined);

    expect(values).toEqual(['a']);
  });
});

describe('isEmpty', () => {
  it('should return true for null and undefined values', () => {
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for empty strings', () => {
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('    ')).toBe(true);
  });

  it('should return false for non-empty strings', () => {
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty('null')).toBe(false);
    expect(isEmpty('undefined')).toBe(false);
  });

  it('should respect trimStrings', () => {
    expect(isEmpty('    ', { trimStrings: false })).toBe(false);
    expect(isEmpty('', { trimStrings: false })).toBe(true);
  });

  it('should treat NaN as empty', () => {
    expect(isEmpty(NaN)).toBe(true);
  });

  it('should treat zero as empty only with zeroIsEmpty', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(BigInt(0))).toBe(false);
    expect(isEmpty(0, { zeroIsEmpty: true })).toBe(true);
    expect(isEmpty(-0, { zeroIsEmpty: true })).toBe(true);
    expect(isEmpty(BigInt(0), { zeroIsEmpty: true })).toBe(true);
    expect(isEmpty(1, { zeroIsEmpty: true })).toBe(false);
    expect(isEmpty(BigInt(1), { zeroIsEmpty: true })).toBe(false);
  });

  it('should treat false as empty only with falseIsEmpty', () => {
    expect(isEmpty(false)).toBe(false);
    expect(isEmpty(false, { falseIsEmpty: true })).toBe(true);
    expect(isEmpty(true, { falseIsEmpty: true })).toBe(false);
  });

  it('should fall back to the default for undefined options', () => {
    expect(isEmpty('    ', { trimStrings: undefined })).toBe(true);
  });

  it('should only consider the length of arrays', () => {
    expect(isEmpty([])).toBe(true);
    expect(isEmpty([null])).toBe(false);
    expect(isEmpty([[]])).toBe(false);
    expect(isEmpty([1, 'hello'])).toBe(false);
  });

  it('should not recurse into self-referencing arrays', () => {
    const value: unknown[] = [];
    value.push(value);

    expect(isEmpty(value)).toBe(false);
  });

  it('should only consider the keys of plain objects', () => {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(Object.create(null))).toBe(true);
    expect(isEmpty({ a: null })).toBe(false);
    expect(isEmpty({ a: '' })).toBe(false);
    expect(isEmpty({ a: 1, b: 'hello' })).toBe(false);
  });

  it('should count symbol and non-enumerable keys', () => {
    expect(isEmpty({ [Symbol('a')]: 1 })).toBe(false);
    expect(isEmpty(Object.defineProperty({}, 'a', { value: 1 }))).toBe(false);
  });

  it('should not mutate objects passed in', () => {
    const value = { a: null, b: 1 };

    expect(isEmpty(value)).toBe(false);
    expect(value).toEqual({ a: null, b: 1 });
  });

  it('should check the size of maps and sets', () => {
    expect(isEmpty(new Map())).toBe(true);
    expect(isEmpty(new Set())).toBe(true);
    expect(isEmpty(new Map([[1, 2]]))).toBe(false);
    expect(isEmpty(new Set([1]))).toBe(false);
  });

  it('should check the byte length of binary data', () => {
    expect(isEmpty(new ArrayBuffer(0))).toBe(true);
    expect(isEmpty(new SharedArrayBuffer(0))).toBe(true);
    expect(isEmpty(new Uint8Array(0))).toBe(true);
    expect(isEmpty(new DataView(new ArrayBuffer(0)))).toBe(true);
    expect(isEmpty(new ArrayBuffer(1))).toBe(false);
    expect(isEmpty(new SharedArrayBuffer(1))).toBe(false);
    expect(isEmpty(new Uint8Array(1))).toBe(false);
    expect(isEmpty(new DataView(new ArrayBuffer(1)))).toBe(false);
  });

  it('should treat only invalid dates as empty', () => {
    expect(isEmpty(new Date())).toBe(false);
    expect(isEmpty(new Date('x'))).toBe(true);
  });

  it('should handle values from another realm', () => {
    expect(isEmpty(runInNewContext('new Map()'))).toBe(true);
    expect(isEmpty(runInNewContext('new Set([1])'))).toBe(false);
    expect(isEmpty(runInNewContext('new Date("x")'))).toBe(true);
    expect(isEmpty(runInNewContext('new ArrayBuffer(0)'))).toBe(true);
    expect(isEmpty(runInNewContext('({})'))).toBe(true);
  });

  it('should not throw on lookalike built-ins', () => {
    expect(isEmpty(Object.create(Map.prototype))).toBe(false);
    expect(isEmpty(Object.create(Date.prototype))).toBe(false);
    expect(isEmpty(Object.create(ArrayBuffer.prototype))).toBe(false);
    expect(isEmpty({ [Symbol.toStringTag]: 'Date' })).toBe(false);
  });

  it('should return false for everything else', () => {
    expect(isEmpty(true)).toBe(false);
    expect(isEmpty(1)).toBe(false);
    expect(isEmpty(Symbol('x'))).toBe(false);
    expect(isEmpty(() => null)).toBe(false);
    expect(isEmpty(new Bar())).toBe(false);
    expect(isEmpty(new Error('x'))).toBe(false);
    expect(isEmpty(new WeakMap())).toBe(false);
    expect(isEmpty(Promise.resolve())).toBe(false);
    expect(isEmpty(/x/)).toBe(false);
    expect(isEmpty(Math)).toBe(false);
    expect(isEmpty(JSON)).toBe(false);
    expect(isEmpty(Reflect)).toBe(false);
  });

  it('should not throw on a prototype constructor without a prototype', () => {
    expect(isEmpty(Object.create({ constructor: () => {} }))).toBe(false);
  });
});

describe('isError', () => {
  it('should return true when value is an error', () => {
    expect(isError(new Error('x'))).toBe(true);
    expect(isError(new TypeError('x'))).toBe(true);
    expect(isError(new (class extends Error {})())).toBe(true);
    expect(isError(runInNewContext('new Error("x")'))).toBe(true);
  });

  it('should return false when value is not an error', () => {
    expect(isError('x')).toBe(false);
    expect(isError({ message: 'x', name: 'Error' })).toBe(false);
    expect(isError({ [Symbol.toStringTag]: 'Error' })).toBe(false);
    expect(isError(Object.create(Error.prototype))).toBe(false);
  });
});

describe('isFiniteNumber', () => {
  it('should return true when value is a finite number', () => {
    expect(isFiniteNumber(0)).toBe(true);
    expect(isFiniteNumber(-1.5)).toBe(true);
  });

  it('should return false when value is not a finite number', () => {
    expect(isFiniteNumber(NaN)).toBe(false);
    expect(isFiniteNumber(Infinity)).toBe(false);
    expect(isFiniteNumber(-Infinity)).toBe(false);
    expect(isFiniteNumber('1')).toBe(false);
  });
});

describe('isFunction', () => {
  it('should return true when value is a function', () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function () {})).toBe(true);
  });

  it('should return false when value is not a function', () => {
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction('abc')).toBe(false);
  });
});

describe('isMap', () => {
  it('should return true when value is a map', () => {
    expect(isMap(new Map())).toBe(true);
    expect(isMap(new (class extends Map {})())).toBe(true);
    expect(isMap(runInNewContext('new Map()'))).toBe(true);
  });

  it('should return false when value is not a map', () => {
    expect(isMap(new Set())).toBe(false);
    expect(isMap(new WeakMap())).toBe(false);
    expect(isMap({ [Symbol.toStringTag]: 'Map' })).toBe(false);
    expect(isMap(Object.create(Map.prototype))).toBe(false);
  });
});

describe('isNil', () => {
  it('should return true when value is nil', () => {
    expect(isNil(undefined)).toBe(true);
    expect(isNil(null)).toBe(true);
  });

  it('should return false when value is not nil', () => {
    expect(isNil('abc')).toBe(false);
    expect(isNil(0)).toBe(false);
  });
});

describe('isNull', () => {
  it('should return true when value is null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false when value is not null', () => {
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
    expect(isNumber(undefined)).toBe(false); // undefined
    expect(isNumber(null)).toBe(false); // nullish
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
    expect(isObject(undefined)).toBe(false);
    expect(isObject(null)).toBe(false);
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
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject('abc')).toBe(false);
    expect(isPlainObject(123)).toBe(false);
    expect(isPlainObject([1, 2, 3])).toBe(false);
    expect(isPlainObject(new Date())).toBe(false);
    expect(isPlainObject(new Bar())).toBe(false);
  });

  it('should return false for built-in namespaces and arguments', () => {
    expect(isPlainObject(Math)).toBe(false);
    expect(isPlainObject(JSON)).toBe(false);
    expect(
      (function () {
        // eslint-disable-next-line prefer-rest-params
        return isPlainObject(arguments);
      })(),
    ).toBe(false);
  });

  it('should return false when the prototype constructor has no prototype', () => {
    expect(isPlainObject(Object.create({ constructor() {} }))).toBe(false);
    expect(isPlainObject(Object.create({ constructor: () => {} }))).toBe(false);
  });

  it('should keep class instances in the false branch when narrowing', () => {
    const value = new Date() as Date | string;

    if (!isPlainObject(value)) {
      // Only compiles if `Date` survives narrowing.
      expect(typeof value === 'string' ? value : value.getTime()).toBeDefined();
    }
  });
});

describe('isPrimitive', () => {
  it('should return true when value is a primitive', () => {
    expect(isPrimitive(null)).toBe(true);
    expect(isPrimitive(undefined)).toBe(true);
    expect(isPrimitive(true)).toBe(true);
    expect(isPrimitive(1)).toBe(true);
    expect(isPrimitive(BigInt(1))).toBe(true);
    expect(isPrimitive('a')).toBe(true);
    expect(isPrimitive(Symbol())).toBe(true);
  });

  it('should return false when value is not a primitive', () => {
    expect(isPrimitive({})).toBe(false);
    expect(isPrimitive([])).toBe(false);
    expect(isPrimitive(() => {})).toBe(false);
    expect(isPrimitive(new Number(1))).toBe(false);
  });
});

describe('isPromise', () => {
  it('should return true when value is a thenable', () => {
    const callable = Object.assign(() => {}, { then() {} });

    expect(isPromise(Promise.resolve())).toBe(true);
    expect(isPromise({ then() {} })).toBe(true);
    expect(isPromise(callable)).toBe(true);
  });

  it('should return false when value is not a thenable', () => {
    expect(isPromise(null)).toBe(false);
    expect(isPromise('then')).toBe(false);
    expect(isPromise({})).toBe(false);
    expect(isPromise({ then: true })).toBe(false);
  });

  it('should return false when reading then throws', () => {
    const value = {
      get then() {
        throw new Error('x');
      },
    };

    expect(isPromise(value)).toBe(false);
  });
});

describe('isSet', () => {
  it('should return true when value is a set', () => {
    expect(isSet(new Set())).toBe(true);
    expect(isSet(new (class extends Set {})())).toBe(true);
    expect(isSet(runInNewContext('new Set()'))).toBe(true);
  });

  it('should return false when value is not a set', () => {
    expect(isSet(new Map())).toBe(false);
    expect(isSet(new WeakSet())).toBe(false);
    expect(isSet({ [Symbol.toStringTag]: 'Set' })).toBe(false);
    expect(isSet(Object.create(Set.prototype))).toBe(false);
  });
});

describe('isString', () => {
  it('should return true when value is a string', () => {
    expect(isString('abc')).toBe(true);
  });

  it('should return false when value is not a string', () => {
    expect(isString(undefined)).toBe(false);
    expect(isString(null)).toBe(false);
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
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false when value is not undefined', () => {
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('sabc')).toBe(false);
  });
});
