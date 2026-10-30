# @hemjs/notions

> Utilities for arrays, objects, strings, and more.

## Table of contents

- [Installation](#installation)
- [Lang](#lang)
  - [isBigInt](#isbigint)
  - [isBoolean](#isboolean)
  - [isClass](#isclass)
  - [isDate](#isdate)
  - [isEmpty](#isempty)
  - [isFunction](#isfunction)
  - [isMap](#ismap)
  - [isNil](#isnil)
  - [isNull](#isnull)
  - [isNumber](#isnumber)
  - [isObject](#isobject)
  - [isPlainObject](#isplainobject)
  - [isSet](#isset)
  - [isString](#isstring)
  - [isSymbol](#issymbol)
  - [isUndefined](#isundefined)
- [Object](#object)
  - [omit](#omit)
  - [pick](#pick)
- [License](#license)

## Installation

Install with npm:

```sh
npm install --save @hemjs/notions
```

Install with yarn:

```sh
yarn add @hemjs/notions
```

## Lang

### `isBigInt`

Determines whether a given value is of type bigint.

**Type:**

```ts
function isBigInt(value: unknown): value is bigint;
```

**Example:**

```ts
import { isBigInt } from '@hemjs/notions';

isBigInt(1n);
// => true
isBigInt(1);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a bigint, otherwise `false`.

### `isBoolean`

Determines whether a given value is of type boolean.

**Type:**

```ts
function isBoolean(value: unknown): value is boolean;
```

**Example:**

```ts
import { isBoolean } from '@hemjs/notions';

isBoolean(false);
// => true
isBoolean(0);
// => false
isBoolean(null);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a boolean, otherwise `false`.

### `isClass`

Determines whether a given value is a class. Native classes such as `Map` are indistinguishable from functions and return `false`.

**Type:**

```ts
function isClass<T = unknown>(value: unknown): value is Class<T>;
```

**Example:**

```ts
import { isClass } from '@hemjs/notions';

class Bar {}

isClass(Bar);
// => true
isClass(new Bar());
// => false
isClass(0);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a class, otherwise `false`.

### `isDate`

Determines whether a given value is a `Date`, including one from another realm. Invalid dates are still dates.

**Type:**

```ts
function isDate(value: unknown): value is Date;
```

**Example:**

```ts
import { isDate } from '@hemjs/notions';

isDate(new Date());
// => true
isDate(Date.now());
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a `Date`, otherwise `false`.

### `isEmpty`

Determines whether a given value is considered empty.

**Type:**

```ts
function isEmpty(value: unknown, options?: IsEmptyOptions): boolean;

interface IsEmptyOptions {
  trimStrings?: boolean; // default: true
  zeroIsEmpty?: boolean; // default: false
  falseIsEmpty?: boolean; // default: false
}
```

**Empty Definitions:**

- `null`: Returns `true` when a `null` value is given.
- `undefined`: Returns `true` when an `undefined` value is given.
- `string`: Returns `true` when an empty string `''` is given, or a string which contains only whitespace unless `trimStrings` is `false`.
- `number`: Returns `true` for `NaN`, and for `0` when `zeroIsEmpty` is `true`.
- `bigint`: Returns `true` for bigint zero (`0n`) when `zeroIsEmpty` is `true`.
- `boolean`: Returns `true` for `false` when `falseIsEmpty` is `true`.
- `array`: Returns `true` when the `length` is `0`. Entries are not inspected.
- `binary data`: Returns `true` when the `byteLength` of an `ArrayBuffer`, `SharedArrayBuffer`, typed array or `DataView` is `0`.
- `Map` / `Set`: Returns `true` when the `size` is `0`.
- `Date`: Returns `true` for an invalid date.
- `object`: Returns `true` for a plain object with no own keys, including symbol and non-enumerable keys. Values are not inspected.

> Anything else (e.g. functions, symbols, class instances) is never treated as empty.

**Example:**

```ts
import { isEmpty } from '@hemjs/notions';

// Arrays
isEmpty([]);
// => true
isEmpty([null]);
// => false

// Objects
isEmpty({});
// => true
isEmpty({ a: null });
// => false

// Strings
isEmpty('');
// => true
isEmpty('  ');
// => true
isEmpty('  ', { trimStrings: false });
// => false
isEmpty('hello');
// => false

// Collections
isEmpty(new Map());
// => true
isEmpty(new Set([1]));
// => false

// Other Values
isEmpty(null);
// => true
isEmpty(undefined);
// => true
isEmpty(NaN);
// => true
isEmpty(new Date('x'));
// => true
isEmpty(false);
// => false
isEmpty(false, { falseIsEmpty: true });
// => true
isEmpty(0);
// => false
isEmpty(0, { zeroIsEmpty: true });
// => true
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.
- `options`: Optional settings that tune what counts as empty.

**Returns:**

`true` if `value` is empty, otherwise `false`.

### `isFunction`

Determines whether a given value is of type function. This includes classes, which throw when called without `new`.

**Type:**

```ts
function isFunction(value: unknown): value is (...args: unknown[]) => unknown;
```

**Example:**

```ts
import { isFunction } from '@hemjs/notions';

isFunction(() => {});
// => true
isFunction(Math.random);
// => true
isFunction(0);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a function, otherwise `false`.

### `isMap`

Determines whether a given value is a `Map`, including one from another realm.

**Type:**

```ts
function isMap<K = unknown, V = unknown>(value: unknown): value is Map<K, V>;
```

**Example:**

```ts
import { isMap } from '@hemjs/notions';

isMap(new Map());
// => true
isMap(new Set());
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a `Map`, otherwise `false`.

### `isNil`

Determines whether a given value is nullish (null or undefined).

**Type:**

```ts
function isNil(value: unknown): value is null | undefined;
```

**Example:**

```ts
import { isNil } from '@hemjs/notions';

isNil(null);
// => true
isNil(undefined);
// => true
isNil(0);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is nullish, otherwise `false`.

### `isNull`

Determines whether a given value is exactly null.

**Type:**

```ts
function isNull(value: unknown): value is null;
```

**Example:**

```ts
import { isNull } from '@hemjs/notions';

isNull(null);
// => true
isNull(undefined);
// => false
isNull(0);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is null, otherwise `false`.

### `isNumber`

Determines whether a given value is of type number.

**Type:**

```ts
function isNumber(value: unknown): value is number;
```

**Example:**

```ts
import { isNumber } from '@hemjs/notions';

isNumber(10);
// => true
isNumber(Math.PI);
// => true
isNumber('10');
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a number, otherwise `false`.

### `isObject`

Determines whether a given value is of type object (excluding null).

**Type:**

```ts
function isObject(value: unknown): value is object;
```

**Example:**

```ts
import { isObject } from '@hemjs/notions';

isObject({});
// => true
isObject([]);
// => true
isObject(null);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is an object (excluding null), otherwise `false`.

### `isPlainObject`

Determines whether a given value is a plain object (i.e., an object whose prototype is `null` or sits at the root of the chain, such as `Object.prototype`).

**Type:**

```ts
function isPlainObject(value: unknown): value is Record<Key, unknown>;
```

**Example:**

```ts
import { isPlainObject } from '@hemjs/notions';

isPlainObject({});
// => true
isPlainObject([]);
// => false
isPlainObject(Object.create(null));
// => true
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a plain object, otherwise `false`.

### `isSet`

Determines whether a given value is a `Set`, including one from another realm.

**Type:**

```ts
function isSet<T = unknown>(value: unknown): value is Set<T>;
```

**Example:**

```ts
import { isSet } from '@hemjs/notions';

isSet(new Set());
// => true
isSet(new Map());
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a `Set`, otherwise `false`.

### `isString`

Determines whether a given value is of type string.

**Type:**

```ts
function isString(value: unknown): value is string;
```

**Example:**

```ts
import { isString } from '@hemjs/notions';

isString('hello');
// => true
isString(Symbol('hello'));
// => false
isString(10);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a string, otherwise `false`.

### `isSymbol`

Determines whether a given value is of type symbol.

**Type:**

```ts
function isSymbol(value: unknown): value is symbol;
```

**Example:**

```ts
import { isSymbol } from '@hemjs/notions';

isSymbol(Symbol('hello'));
// => true
isSymbol('hello');
// => false
isSymbol(10);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is a symbol, otherwise `false`.

### `isUndefined`

Determines whether a given value is undefined.

**Type:**

```ts
function isUndefined(value: unknown): value is undefined;
```

**Example:**

```ts
import { isUndefined } from '@hemjs/notions';

isUndefined(undefined);
// => true
isUndefined(null);
// => false
isUndefined(0);
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is undefined, otherwise `false`.

## Object

### `omit`

Creates a new object with specific properties omitted from a source object. Only own enumerable properties are copied, including symbols. Inherited members such as class methods and non-enumerable properties such as `Error.message` are left out, so every property of the result is optional. Getters are read and their values copied, and `__proto__` keys are dropped.

**Type:**

```ts
function omit<T extends object, K extends keyof T>(
  obj: T,
  exclusions: readonly K[],
): Partial<Omit<T, K>>;
```

**Example:**

```ts
import { omit } from '@hemjs/notions';

const person = { name: 'Alice', age: 30, city: 'Nairobi' };
const publicInfo = omit(person, ['age']);
console.log(publicInfo); // Output: { name: 'Alice', city: 'Nairobi' }
```

**Parameters:**

- `obj`: The source object from which properties will be copied.
- `exclusions`: An array of property keys to exclude from the new object.

**Returns:**

A new object containing the own enumerable properties of `obj`, except those listed in `exclusions` and `__proto__`.

### `pick`

Creates a new object containing only the specified properties from a source object. Keys that are not own enumerable properties of the source, such as `Error.message`, are skipped, so every property of the result is optional. Getters are read and their values copied, and `__proto__` keys are dropped.

**Type:**

```ts
function pick<T extends object, K extends keyof T>(
  obj: T,
  inclusions: readonly K[],
): Partial<Pick<T, K>>;
```

**Example:**

```ts
import { pick } from '@hemjs/notions';

const person = { name: 'Alice', age: 30, city: 'Nairobi' };
const nameAndAge = pick(person, ['name', 'age']);
console.log(nameAndAge); // Output: { name: 'Alice', age: 30 }
```

**Parameters:**

- `obj`: The source object from which properties will be copied.
- `inclusions`: An array of property keys to include in the new object.

**Returns:**

A new object containing the properties listed in `inclusions` that are own enumerable properties of `obj`, except `__proto__`.

## License

This project is licensed under the **MIT license**.

See [LICENSE](LICENSE) for more information.
