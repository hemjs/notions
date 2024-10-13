/** Creates a new object by picking only the specified properties from the given object. */
export function pick<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  inclusions: K[],
): Pick<T, K> {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (inclusions.indexOf(key as any) !== -1 && obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }

  return result as Pick<T, K>;
}
