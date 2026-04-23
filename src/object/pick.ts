/** Creates a new object by picking only the specified properties from the given object. */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  inclusions: readonly K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of inclusions) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
  }

  return result;
}
