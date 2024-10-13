/** Creates a new object by omitting the specified properties from the given object. */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  exclusions: K[],
): Omit<T, K> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (exclusions.indexOf(key as any) === -1 && obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }

  return result as Omit<T, K>;
}
