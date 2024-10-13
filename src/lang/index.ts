/** Describes index keys for any type. */
export type Key = string | number | symbol;

/** Represents a gamut of "falsy" values. */
export type Falsy = null | undefined | false | 0 | -0 | 0n | '';

/** Represents an object that is considered "empty". */
export type EmptyObject = Record<Key, null | undefined | ''>;

/** Represents a value that is considered "empty" in various contexts. */
export type EmptyLike = Falsy | Array<Falsy> | EmptyObject;

/**
 * Returns `true` if `value` is a boolean, else `false`.
 */
export function isBoolean(value?: any): value is boolean {
  return typeof value === 'boolean';
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
 */
export function isEmpty(value?: any): value is EmptyLike {
  if (value instanceof Array) {
    value = value.filter((val) => !isEmpty(val));
    return value.length === 0;
  } else if (value && typeof value === 'object') {
    for (const key in value) {
      if (
        value[key] === null ||
        value[key] === undefined ||
        value[key] === ''
      ) {
        delete value[key];
      }
    }
    return Object.keys(value).length === 0;
  } else if (typeof value === 'string') {
    return value.trim().length === 0;
  } else {
    return (
      !value ||
      (value + '').toLocaleLowerCase() === 'null' ||
      (value + '').toLocaleLowerCase() === 'undefined'
    );
  }
}

/**
 * Returns `true` if `value` is a function, else `false`.
 */
export function isFunction(value?: any): value is Function {
  return typeof value === 'function';
}

/**
 * Returns `true` if `value` is nullish, else `false`.
 */
export function isNil(value?: any): value is null | undefined {
  return typeof value === 'undefined' || value === null;
}

/**
 * Returns `true` if `value` is `null`, else `false`.
 */
export function isNull(value?: any): value is null {
  return value === null;
}

/**
 * Returns `true` if `value` is a number, else `false`.
 */
export function isNumber(value?: any): value is number {
  return typeof value === 'number';
}

/**
 * Returns `true` if `value` is an object, else `false`.
 */
export function isObject(value?: any): value is object {
  return value !== null && typeof value === 'object';
}

/**
 * Returns `true` if `value` is a plain object, else `false`.
 */
export function isPlainObject(value?: any): value is object {
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

/**
 * Returns `true` if `value` is a string, else `false`.
 */
export function isString(value?: any): value is string {
  return typeof value === 'string';
}

/**
 * Returns `true` if `value` is a symbol, else `false`.
 */
export function isSymbol(value?: any): value is symbol {
  return typeof value === 'symbol';
}

/**
 * Returns `true` if `value` is `undefined`, else `false`.
 */
export function isUndefined(value?: any): value is undefined {
  return typeof value === 'undefined';
}
