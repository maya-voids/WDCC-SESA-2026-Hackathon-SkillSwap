// Generic array/set helpers used across the backend. Like DataQueries, every
// function here is pure: it never mutates its inputs and returns a new array.

/**
 * Reverse the order of an arbitrary array without mutating it. Useful for
 * flipping the result of any DataQueries sort (e.g.
 * `arrayReverse(sortServicesByCreditAscending(services))`) or any other array
 * into the opposite order.
 */
export function arrayReverse<T>(array: T[]): T[] {
  return [...array].reverse();
}

/**
 * Intersection of two arrays — items that appear in both, deduplicated.
 * Order-preserving (first occurrence wins) and non-mutating. Pass a `key`
 * accessor when comparing objects (e.g. `(s) => s.id`) so two distinct objects
 * that refer to the same item are treated as equal. Useful for combining the
 * results of two DataQueries calls, e.g. services that are BOTH recent AND
 * high-credit.
 */
export function intersection<T>(
  a: T[],
  b: T[],
  key?: (item: T) => unknown,
): T[] {
  const bKeys = new Set(b.map((item) => keyOf(item, key)));
  const seen = new Set<unknown>();
  return a.filter((item) => {
    const k = keyOf(item, key);
    if (bKeys.has(k) && !seen.has(k)) {
      seen.add(k);
      return true;
    }
    return false;
  });
}

/** Resolve an item's comparison key; defaults to the item itself. */
function keyOf<T>(item: T, key?: (item: T) => unknown): unknown {
  return key ? key(item) : item;
}
