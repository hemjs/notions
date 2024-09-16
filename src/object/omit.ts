/**
 * A helper to do the minimal amount of work in duplicating an object but omitting some
 * props. This ends up faster than using object ...rest or reduce to filter.
 */
export function omit<TInput extends Record<string, any>, TResult = TInput>(
  obj: TInput,
  exclusions: (keyof TInput)[],
): TResult {
  const result: Record<string, any> = {};

  for (const key in obj) {
    if (exclusions.indexOf(key) === -1 && obj.hasOwnProperty(key)) {
      result[key] = obj[key];
    }
  }

  return result as TResult;
}
