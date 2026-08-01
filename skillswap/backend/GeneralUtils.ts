// Generic array helpers used across the backend. Like DataQueries, every
// function here is pure: it never mutates its input and returns a new array.

/**
 * Reverse the order of an arbitrary array without mutating it. Useful for
 * flipping the result of any DataQueries sort (e.g.
 * `arrayReverse(sortServicesByCreditAscending(services))`) or any other array
 * into the opposite order.
 */
export function arrayReverse<T>(array: T[]): T[] {
  return [...array].reverse();
}
