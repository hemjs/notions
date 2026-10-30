/**
 * Returns `true` if `key` should be copied from `obj`: it must be an own
 * enumerable property, and not `__proto__`, which could otherwise set the
 * prototype of the result or of anything the result is later merged into.
 */
function isCopyable(obj: object, key: PropertyKey): boolean {
  return (
    key !== '__proto__' && Object.prototype.propertyIsEnumerable.call(obj, key)
  );
}

/**
 * Creates a new object by omitting the specified properties from the given
 * object. Copies own enumerable properties, including symbols, reading any
 * getters. Every property of the result is optional, since inherited members
 * such as class methods are not copied.
 */
export function omit<T extends object, K extends keyof T>(
  obj: T,
  exclusions: readonly K[],
): Partial<Omit<T, K>> {
  const excluded = new Set<PropertyKey>(
    exclusions.map((key) => (typeof key === 'number' ? String(key) : key)),
  );
  const keys = [...Object.keys(obj), ...Object.getOwnPropertySymbols(obj)];
  const result: Partial<T> = {};

  for (const key of keys as Array<keyof T>) {
    if (isCopyable(obj, key) && !excluded.has(key)) {
      result[key] = obj[key];
    }
  }

  return result;
}

/**
 * Creates a new object by picking only the specified properties from the given
 * object, reading any getters. Keys that are not own enumerable properties of
 * `obj` are skipped, so every property of the result is optional.
 */
export function pick<T extends object, K extends keyof T>(
  obj: T,
  inclusions: readonly K[],
): Partial<Pick<T, K>> {
  const result: Partial<T> = {};

  for (const key of inclusions) {
    if (isCopyable(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
}
