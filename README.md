# @hemjs/notions

> Utilities for arrays, objects, strings, and more.

## Table of contents

- [Installation](#installation)
- [Async](#async)
  - [deadline](#deadline)
  - [delay](#delay)
- [Lang](#lang)
  - [isBoolean](#isboolean)
  - [isEmpty](#isempty)
  - [isFunction](#isfunction)
  - [isNil](#isnil)
  - [isNull](#isnull)
  - [isNumber](#isnumber)
  - [isObject](#isobject)
  - [isPlainObject](#isplainobject)
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

## Async

### `deadline`

Creates a promise which will be rejected with `DeadlineError` when a given delay is exceeded.

**Type:**

```ts
function deadline<T>(
  p: Promise<T>,
  ms: number,
  options?: DeadlineOptions,
): Promise<T>;
```

**Example:**

```ts
import { deadline } from '@hemjs/notions';

const myPromise = fetch('https://api.example.com/data');

deadline(myPromise, 1000) // Wait for 1 second
  .then((data) => {
    // Handle successful response
  })
  .catch((error) => {
    if (error instanceof DeadlineError) {
      console.error('Promise timed out!');
    } else {
      console.error('Error:', error);
    }
  });
```

**Parameters:**

- `p`: The promise to be wrapped with a deadline.
- `ms`: The delay in milliseconds before the deadline triggers.
- `options`: (Optional) An object containing:
  - `signal`: An `AbortSignal` object to manually abort the deadline.

**Returns:**

A new promise that resolves or rejects according to the original promise and the deadline.

**Errors:**

- If the deadline is met before the original promise resolves, the returned promise is rejected with a `DeadlineError`.
- If the original promise rejects, the returned promise also rejects with the original promise's rejection reason.

**Cancellation:**

You can cancel the deadline manually by providing an `AbortSignal` in the options object and aborting the signal elsewhere in your code.

**Notes:**

- The `catch` block within the `deadline` function does nothing on abort to prevent potential errors due to rejected signals.

### `delay`

Resolves a `Promise` after a given amount of milliseconds.

**Type:**

```ts
function delay(ms: number, options?: DelayOptions): Promise<void>;
```

**Example:**

```ts
import { delay } from '@hemjs/notions';

async function doSomethingAfterDelay() {
  await delay(2000); // Wait for 2 seconds
  console.log('Done!');
}

doSomethingAfterDelay();
```

**Parameters:**

- `ms`: The number of milliseconds to wait before resolving the promise.
- `options`: (Optional) An object containing:
  - `signal`: An `AbortSignal` object to manually abort the delay.

**Returns:**

A promise that resolves after the specified delay, with no data to fulfill.

**Errors:**

If the delay is aborted using the `AbortSignal`, the promise is rejected with the reason provided by the signal.

**Cancellation:**

You can cancel the delay before it completes by providing an `AbortSignal` in the options object and aborting the signal elsewhere in your code.

**Notes:**

- The function uses `setTimeout` internally to create the delay.
- The provided `AbortSignal` is used to listen for abort events and reject the promise accordingly.

## Lang

### `isBoolean`

Determines whether a given value is of type boolean.

**Type:**

```ts
function isBoolean(value?: any): value is boolean;
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

### `isEmpty`

Determines whether a given value is considered empty.

**Type:**

```ts
function isEmpty(value?: any): value is EmptyLike;
```

**Empty Definitions:**

- `null`: Returns `true` when a `null` value is given.
- `undefined`: Returns `true` when an `undefined` value is given.
- `boolean`: Returns `true` when the boolean value is `false`.
- `integer`: Returns `true` when an integer `0` value is given.
- `float`: Returns `true` when a float `0.0` value is given.
- `string`: Returns `true` when an empty string `''` is given.
- `space`: Returns `true` when an string is given which contains only whitespace.
- `array`: Return `true` when an empty array (`[]`) or an array containing only empty values is given.
- `object`: Returns `true` when an empty object (`{}`) or an object with all properties being `null`, `undefined`, or empty strings is given.

**Example:**

```ts
import { isEmpty } from '@hemjs/notions';

// Arrays
isEmpty([]);
// => true
isEmpty([0, false, '', null, undefined]);
// => true
isEmpty([1, 'hello', { a: 1 }]);
// => false

// Objects
isEmpty({});
// => true
isEmpty({ a: null, b: undefined, c: '' });
// => true
isEmpty({ a: 1, b: 'hello' });
// => false

// Strings
isEmpty('');
// => true
isEmpty('  ');
// => true
isEmpty('hello');
// => false

// Other Values
isEmpty(null);
// => true
isEmpty(undefined);
// => true
isEmpty(false);
// => true
isEmpty(0);
// => true
isEmpty(0.0);
// => true
isEmpty(true);
// => false
isEmpty(1);
// => false
isEmpty('hello');
// => false
```

**Parameters:**

- `value`: The value to be checked. Can be any data type.

**Returns:**

`true` if `value` is empty, otherwise `false`.

### `isFunction`

Determines whether a given value is of type function.

**Type:**

```ts
function isFunction(value?: any): value is (...args: any[]) => any;
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

### `isNil`

Determines whether a given value is nullish (null or undefined).

**Type:**

```ts
function isNil(value?: any): value is null | undefined;
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
function isNull(value?: any): value is null;
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
function isNumber(value?: any): value is number;
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
function isObject(value?: any): value is object;
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

Determines whether a given value is a plain object (i.e., an object without a custom prototype).

**Type:**

```ts
function isPlainObject(value?: any): value is object;
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

### `isString`

Determines whether a given value is of type string.

**Type:**

```ts
function isString(value?: any): value is string;
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
function isSymbol(value?: any): value is symbol;
```

**Example:**

```ts
import { isSymbol } from '@hemjs/notions';

isSymbol(Symbol('hello'));
// => true
isString('hello');
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
function isUndefined(value?: any): value is undefined;
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

Creates a new object with specific properties omitted from a source object.

**Type:**

```ts
function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  exclusions: K[],
): Omit<T, K>;
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

A new object containing all properties from `obj` except those listed in `exclusions`.

**Notes:**

- Uses a `for...in` loop and direct property assignments for optimal performance.

### `pick`

Creates a new object containing only the specified properties from a source object.

**Type:**

```ts
function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  inclusions: K[],
): Pick<T, K>;
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

A new object containing only the properties listed in `inclusions` from `obj`.

**Notes:**

- Uses a `for...in` loop and direct property assignments for optimal performance.

## License

This project is licensed under the **MIT license**.

See [LICENSE](LICENSE) for more information.
