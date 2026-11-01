# @hemjs/notions

> Type-safe utilities for values, objects, and more.

Includes runtime checks that narrow `unknown` values, plus `omit` and `pick` for safely copying objects.

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Type guards](#type-guards)
  - [isClass](#isclass)
  - [isDate, isMap and isSet](#isdate-ismap-and-isset)
  - [isEmpty](#isempty)
  - [isError](#iserror)
  - [isObject and isPlainObject](#isobject-and-isplainobject)
  - [isPromise](#ispromise)
- [Object helpers](#object-helpers)
  - [omit](#omit)
  - [pick](#pick)
  - [Copying rules](#copying-rules)
- [Types](#types)
- [License](#license)

## Installation

Notions is published as an ES module and requires Node.js 22.12 or later.

```sh
npm install @hemjs/notions
```

```sh
yarn add @hemjs/notions
```

```sh
pnpm add @hemjs/notions
```

CommonJS code can still load it with `require()`, which Node.js 22.12 and later support for ES modules.

## Quick start

```ts
import { isDefined, isEmpty, isError, omit } from '@hemjs/notions';

['a', null, undefined].filter(isDefined);
// => ['a']

isEmpty('   ');
// => true

try {
  run();
} catch (error) {
  console.error(isError(error) ? error.message : error);
}

omit({ id: 1, password: 'secret' }, ['password']);
// => { id: 1 }
```

## Type guards

Each guard takes one `value` of any type, returns a boolean and, except for `isEmpty`, narrows the type when `true`.

| Guard            | Returns `true` for                         | Narrows to                        |
| ---------------- | ------------------------------------------ | --------------------------------- |
| `isBigInt`       | A bigint                                   | `bigint`                          |
| `isBoolean`      | `true` or `false`                          | `boolean`                         |
| `isClass`        | A class ([details](#isclass))              | `Class<T>`                        |
| `isDate`         | A `Date`, valid or not                     | `Date`                            |
| `isDefined`      | Anything except `null` and `undefined`     | `NonNullable<T>`                  |
| `isEmpty`        | An empty value ([details](#isempty))       | Does not narrow                   |
| `isError`        | An `Error` or `DOMException`               | `Error`                           |
| `isFiniteNumber` | A number, excluding `NaN` and `Infinity`   | `number`                          |
| `isFunction`     | A function or class                        | `(...args: unknown[]) => unknown` |
| `isMap`          | A `Map`                                    | `Map<K, V>`                       |
| `isNil`          | `null` or `undefined`                      | `null \| undefined`               |
| `isNull`         | `null`                                     | `null`                            |
| `isNumber`       | A number, including `NaN` and `Infinity`   | `number`                          |
| `isObject`       | A non-null object, including arrays        | `object`                          |
| `isPlainObject`  | A plain object                             | `Record<Key, unknown>`            |
| `isPrimitive`    | Anything except objects and functions      | `Primitive`                       |
| `isPromise`      | A thenable                                 | `PromiseLike<T>`                  |
| `isSet`          | A `Set`                                    | `Set<T>`                          |
| `isString`       | A string, excluding `new String()` objects | `string`                          |
| `isSymbol`       | A symbol                                   | `symbol`                          |
| `isUndefined`    | `undefined`                                | `undefined`                       |

The guards below have behavior worth knowing.

### `isClass`

Reads the function's source text, so it can only recognize classes written with the `class` keyword. Native classes such as `Map`, bound classes and classes compiled to ES5 return `false`.

```ts
class Bar {}

isClass(Bar);
// => true
isClass(new Bar());
// => false
isClass(Map);
// => false
```

### `isDate`, `isMap` and `isSet`

These recognize values from another realm, such as an iframe or `vm` context, where `instanceof` fails. They reject lookalikes such as `Object.create(Map.prototype)` and objects with a spoofed `Symbol.toStringTag`. Subclasses return `true`, and so do invalid dates.

```ts
isDate(new Date('x'));
// => true
isMap(Object.create(Map.prototype));
// => false
```

### `isEmpty`

```ts
function isEmpty(value: unknown, options?: IsEmptyOptions): boolean;
```

| Value                                                       | Empty when                                                   |
| ----------------------------------------------------------- | ------------------------------------------------------------ |
| `null`, `undefined`                                         | Always                                                       |
| String                                                      | `''`, or whitespace-only unless `trimStrings` is `false`     |
| Number                                                      | `NaN`, or `0` and `-0` when `zeroIsEmpty` is `true`          |
| Bigint                                                      | `0n` when `zeroIsEmpty` is `true`                            |
| Boolean                                                     | `false` when `falseIsEmpty` is `true`                        |
| Array                                                       | `length` is `0`                                              |
| `ArrayBuffer`, `SharedArrayBuffer`, typed array, `DataView` | `byteLength` is `0`                                          |
| `Map`, `Set`                                                | `size` is `0`                                                |
| `Date`                                                      | The date is invalid                                          |
| Plain object                                                | It has no own keys, including symbol and non-enumerable keys |

Anything else, including functions, symbols and class instances, is never empty. Array entries and object values are not inspected.

```ts
isEmpty([]);
// => true
isEmpty([null]);
// => false
isEmpty({ a: null });
// => false
isEmpty(0);
// => false
isEmpty(0, { zeroIsEmpty: true });
// => true
isEmpty('  ', { trimStrings: false });
// => false
```

See [`IsEmptyOptions`](#isemptyoptions) for the options.

### `isError`

Works across realms, and accepts `DOMException`, which covers the reason given by an aborted `fetch`. It uses the native `Error.isError` where available. On runtimes without it, an `Error` subclass with its own `Symbol.toStringTag` returns `false`.

```ts
isError(new TypeError('x'));
// => true
isError({ message: 'x' });
// => false
```

### `isObject` and `isPlainObject`

`isObject` returns `true` for any non-null object, including arrays, and `false` for functions. Functions are not primitives either, so `isObject` and `isPrimitive` can both return `false`.

`isPlainObject` is stricter. It accepts objects created by `{}`, `new Object()` or `Object.create(null)`, and rejects class instances, `Math`, `arguments` and objects with a custom `Symbol.toStringTag`.

```ts
isObject([]);
// => true
isObject(() => {});
// => false
isPlainObject({});
// => true
isPlainObject(Object.create(null));
// => true
isPlainObject(new Date());
// => false
```

### `isPromise`

Checks for a callable `then`, which is what `await` treats as a promise. That is why it narrows to `PromiseLike<T>` rather than `Promise<T>`. A `then` getter that throws returns `false`.

```ts
isPromise(Promise.resolve());
// => true
isPromise({ then() {} });
// => true
isPromise({});
// => false
```

## Object helpers

Both helpers return a new object and leave the source unchanged.

### `omit`

Copies every property except the listed keys.

```ts
function omit<T extends object, K extends keyof T>(
  obj: T,
  exclusions: readonly K[],
): Partial<Omit<T, K>>;
```

```ts
const person = { name: 'Alice', age: 30, city: 'Nairobi' };

omit(person, ['age']);
// => { name: 'Alice', city: 'Nairobi' }
```

### `pick`

Copies only the listed keys.

```ts
function pick<T extends object, K extends keyof T>(
  obj: T,
  inclusions: readonly K[],
): Partial<Pick<T, K>>;
```

```ts
const person = { name: 'Alice', age: 30, city: 'Nairobi' };

pick(person, ['name', 'age']);
// => { name: 'Alice', age: 30 }
```

### Copying rules

`omit` and `pick` follow the same rules:

- **Own enumerable properties only:** symbol keys are included. Inherited members such as class methods are not, and neither are non-enumerable properties such as `Error.message`.
- **Optional results:** because of that rule, every property of the result is optional, so read it with `?.` or a check.
- **No `__proto__`:** these keys are always dropped, so untrusted JSON can't set a prototype on the result or on anything it's merged into.
- **Getters are read:** the value is copied rather than the getter, so a getter that throws aborts the call.

```ts
const person = { name: 'Alice', age: 30 };

omit(person, ['age']).name?.toUpperCase();
// => 'ALICE'
```

## Types

### `Class`

An instantiable class `T` with constructor parameters `Args`.

```ts
type Class<T, Args extends unknown[] = unknown[]> = {
  prototype: Pick<T, keyof T>;
  new (...args: Args): T;
};
```

### `IsEmptyOptions`

Options to tune what `isEmpty` considers empty.

| Option         | Default | Effect                                 |
| -------------- | ------- | -------------------------------------- |
| `trimStrings`  | `true`  | Treat whitespace-only strings as empty |
| `zeroIsEmpty`  | `false` | Treat `0`, `-0` and `0n` as empty      |
| `falseIsEmpty` | `false` | Treat `false` as empty                 |

### `Key`

The keys an object can be indexed by.

```ts
type Key = string | number | symbol;
```

### `Primitive`

A value that is neither an object nor a function.

```ts
type Primitive = bigint | boolean | null | number | string | symbol | undefined;
```

## License

[MIT](LICENSE)
