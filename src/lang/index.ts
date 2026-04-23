/** Describes index keys for any type. */
export type Key = string | number | symbol;

/** Represents a gamut of "falsy" values. */
export type Falsy = null | undefined | false | 0 | 0n | '';

/** Represents an object that is considered "empty". */
export type EmptyObject = Record<Key, null | undefined | ''>;

/** Represents a value that is considered "empty" in various contexts. */
export type EmptyLike = Falsy | Array<Falsy> | EmptyObject;

/** Represents an instantiable class `T` with constructor parameters. */
export type Class<T, Args extends unknown[] = unknown[]> = {
  prototype: Pick<T, keyof T>;
  new (...args: Args): T;
};

const EMPTY_BIGINT = BigInt(0);

function isEmptyObjectValue(entry: unknown): boolean {
  return isNil(entry) || entry === '';
}

/** Returns `true` if `value` is a boolean, else `false`. */
export function isBoolean(value?: unknown): value is boolean {
  return typeof value === 'boolean';
}

/** Returns `true` if `value` is a class, else `false`. */
export function isClass<T = unknown>(value: unknown): value is Class<T> {
  return typeof value === 'function' && value.toString().startsWith('class ');
}

/**
 * Returns `true` if `value` is empty, else `false`:
 *
 * - **array:** `[]`, `[<empty values>]`.
 * - **object:** `{}`, `{ key: <null|undefined|''> }`.
 * - **string:** `''`, `'    '`.
 * - **null:** `null`.
 * - **undefined:** `undefined`.
 * - **boolean:** `false`.
 * - **integer:** `0`.
 * - **float:** `0.0`.
 * - **nan:** `NaN`.
 * - **bigint:** `0n`.
 *
 * Non-plain objects (e.g. `Set`, `Map`, `Date`) are never treated as empty.
 */
export function isEmpty(value?: unknown): value is EmptyLike {
  if (isNil(value)) {
    return true;
  }

  if (isString(value)) {
    return value.trim().length === 0;
  }

  if (isBoolean(value)) {
    return value === false;
  }

  if (isNumber(value)) {
    return Number.isNaN(value) || value === 0;
  }

  if (typeof value === 'bigint') {
    return value === EMPTY_BIGINT;
  }

  if (Array.isArray(value)) {
    return value.every((entry) => isEmpty(entry));
  }

  if (isPlainObject(value)) {
    return Object.values(value).every((entry) => isEmptyObjectValue(entry));
  }

  return false;
}

/** Returns `true` if `value` is a function, else `false`. */
export function isFunction(
  value?: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/** Returns `true` if `value` is nullish, else `false`. */
export function isNil(value?: unknown): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/** Returns `true` if `value` is `null`, else `false`. */
export function isNull(value?: unknown): value is null {
  return value === null;
}

/** Returns `true` if `value` is a number, else `false`. */
export function isNumber(value?: unknown): value is number {
  return typeof value === 'number';
}

/** Returns `true` if `value` is an object, else `false`. */
export function isObject(value?: unknown): value is object {
  return value !== null && typeof value === 'object';
}

/** Returns `true` if `value` is a plain object, else `false`. */
export function isPlainObject(value?: unknown): value is object {
  if (!isObject(value)) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  if (proto === null) {
    return true;
  }

  const ctor =
    Object.prototype.hasOwnProperty.call(proto, 'constructor') &&
    proto.constructor;

  return (
    typeof ctor === 'function' &&
    ctor instanceof ctor &&
    Function.prototype.toString.call(ctor) ===
      Function.prototype.toString.call(Object)
  );
}

/** Returns `true` if `value` is a string, else `false`. */
export function isString(value?: unknown): value is string {
  return typeof value === 'string';
}

/** Returns `true` if `value` is a symbol, else `false`. */
export function isSymbol(value?: unknown): value is symbol {
  return typeof value === 'symbol';
}

/** Returns `true` if `value` is `undefined`, else `false`. */
export function isUndefined(value?: unknown): value is undefined {
  return typeof value === 'undefined';
}
