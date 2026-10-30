/** Describes index keys for any type. */
export type Key = string | number | symbol;

/** Represents an instantiable class `T` with constructor parameters. */
export type Class<T, Args extends unknown[] = unknown[]> = {
  prototype: Pick<T, keyof T>;
  new (...args: Args): T;
};

/** Represents a value that is neither an object nor a function. */
export type Primitive =
  bigint | boolean | null | number | string | symbol | undefined;

/** Options to tune what `isEmpty` considers "empty". */
export interface IsEmptyOptions {
  /** Treat whitespace-only strings as empty. Defaults to `true`. */
  trimStrings?: boolean;
  /** Treat `0`, `-0` and `0n` as empty. Defaults to `false`. */
  zeroIsEmpty?: boolean;
  /** Treat `false` as empty. Defaults to `false`. */
  falseIsEmpty?: boolean;
}

/**
 * Returns `true` if `value` carries the built-in `tag` and survives `check`,
 * which rejects lookalikes. Works across realms, unlike `instanceof`.
 */
function hasBrand(
  value: unknown,
  tag: string,
  check: (value: never) => unknown,
): boolean {
  if (Object.prototype.toString.call(value) !== `[object ${tag}]`) {
    return false;
  }

  try {
    check(value as never);
    return true;
  } catch {
    return false;
  }
}

/** Returns `true` if `value` is an `ArrayBuffer` or `SharedArrayBuffer`. */
function isBinaryBuffer(value: unknown): value is ArrayBufferLike {
  const readLength = (buffer: ArrayBufferLike) => buffer.byteLength;

  return (
    hasBrand(value, 'ArrayBuffer', readLength) ||
    hasBrand(value, 'SharedArrayBuffer', readLength)
  );
}

/** Returns `true` if `value` is a bigint, else `false`. */
export function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

/** Returns `true` if `value` is a boolean, else `false`. */
export function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

/**
 * Returns `true` if `value` is a class, else `false`. Native classes such as
 * `Map` are indistinguishable from functions and return `false`.
 */
export function isClass<T = unknown>(value: unknown): value is Class<T> {
  return (
    typeof value === 'function' &&
    /^class(?=[\s{/])(?!\s*\()/.test(Function.prototype.toString.call(value))
  );
}

/** Returns `true` if `value` is a `Date`, else `false`. */
export function isDate(value: unknown): value is Date {
  return hasBrand(value, 'Date', (date: Date) =>
    Date.prototype.getTime.call(date),
  );
}

/** Returns `true` if `value` is neither `null` nor `undefined`, else `false`. */
export function isDefined<T>(value: T): value is NonNullable<T> {
  return !isNil(value);
}

/**
 * Returns `true` if `value` is empty, else `false`:
 *
 * - **null / undefined:** always.
 * - **string:** `''`, and whitespace-only unless `trimStrings` is `false`.
 * - **number:** `NaN`, and `0` if `zeroIsEmpty`.
 * - **bigint:** `0n` if `zeroIsEmpty`.
 * - **boolean:** `false` if `falseIsEmpty`.
 * - **array:** `length` is `0`.
 * - **typed array / `DataView` / `ArrayBuffer`:** `byteLength` is `0`.
 * - **`Map` / `Set`:** `size` is `0`.
 * - **`Date`:** invalid.
 * - **plain object:** no own keys, including symbols and non-enumerable keys.
 *
 * Anything else (e.g. functions, symbols, class instances) is never empty.
 */
export function isEmpty(value: unknown, options: IsEmptyOptions = {}): boolean {
  const {
    trimStrings = true,
    zeroIsEmpty = false,
    falseIsEmpty = false,
  } = options;

  if (isNil(value)) {
    return true;
  }

  if (isString(value)) {
    return (trimStrings ? value.trim() : value).length === 0;
  }

  if (isBoolean(value)) {
    return falseIsEmpty && !value;
  }

  if (isNumber(value)) {
    return Number.isNaN(value) || (zeroIsEmpty && value === 0);
  }

  if (isBigInt(value)) {
    return zeroIsEmpty && !value;
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (ArrayBuffer.isView(value) || isBinaryBuffer(value)) {
    return value.byteLength === 0;
  }

  if (isMap(value) || isSet(value)) {
    return value.size === 0;
  }

  if (isDate(value)) {
    return Number.isNaN(value.getTime());
  }

  return isPlainObject(value) && Reflect.ownKeys(value).length === 0;
}

/**
 * Returns `true` if `value` is an `Error`, else `false`. Works across realms,
 * unlike `instanceof`, and rejects a spoofed `Symbol.toStringTag`.
 */
export function isError(value: unknown): value is Error {
  return (
    isObject(value) &&
    !(Symbol.toStringTag in value) &&
    Object.prototype.toString.call(value) === '[object Error]'
  );
}

/** Returns `true` if `value` is a finite number, else `false`. */
export function isFiniteNumber(value: unknown): value is number {
  return Number.isFinite(value);
}

/**
 * Returns `true` if `value` is a function, else `false`. This includes classes,
 * which throw when called without `new`.
 */
export function isFunction(
  value: unknown,
): value is (...args: unknown[]) => unknown {
  return typeof value === 'function';
}

/** Returns `true` if `value` is a `Map`, else `false`. */
export function isMap<K = unknown, V = unknown>(
  value: unknown,
): value is Map<K, V> {
  return hasBrand(value, 'Map', (map: Map<unknown, unknown>) =>
    Map.prototype.has.call(map, undefined),
  );
}

/** Returns `true` if `value` is nullish, else `false`. */
export function isNil(value: unknown): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/** Returns `true` if `value` is `null`, else `false`. */
export function isNull(value: unknown): value is null {
  return value === null;
}

/** Returns `true` if `value` is a number, else `false`. */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

/** Returns `true` if `value` is an object, else `false`. */
export function isObject(value: unknown): value is object {
  return value !== null && typeof value === 'object';
}

/** Returns `true` if `value` is a plain object, else `false`. */
export function isPlainObject(value: unknown): value is Record<Key, unknown> {
  if (
    !isObject(value) ||
    Object.prototype.toString.call(value) !== '[object Object]'
  ) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  return proto === null || Object.getPrototypeOf(proto) === null;
}

/** Returns `true` if `value` is a primitive, else `false`. */
export function isPrimitive(value: unknown): value is Primitive {
  return !isObject(value) && !isFunction(value);
}

/**
 * Returns `true` if `value` is a thenable, which is what `await` treats as a
 * promise, else `false`.
 */
export function isPromise<T = unknown>(
  value: unknown,
): value is PromiseLike<T> {
  if (isPrimitive(value)) {
    return false;
  }

  try {
    return isFunction((value as { then?: unknown }).then);
  } catch {
    return false;
  }
}

/** Returns `true` if `value` is a `Set`, else `false`. */
export function isSet<T = unknown>(value: unknown): value is Set<T> {
  return hasBrand(value, 'Set', (set: Set<unknown>) =>
    Set.prototype.has.call(set, undefined),
  );
}

/** Returns `true` if `value` is a string, else `false`. */
export function isString(value: unknown): value is string {
  return typeof value === 'string';
}

/** Returns `true` if `value` is a symbol, else `false`. */
export function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

/** Returns `true` if `value` is `undefined`, else `false`. */
export function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}
