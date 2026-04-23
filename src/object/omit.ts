/** Creates a new object by omitting the specified properties from the given object. */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  exclusions: readonly K[],
): Omit<T, K> {
  const result: Partial<T> = {};

  for (const key of Object.keys(obj) as Array<keyof T>) {
    if (!exclusions.includes(key as K)) {
      result[key] = obj[key];
    }
  }

  return result as Omit<T, K>;
}
