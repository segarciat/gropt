/**
 * Parses the numerical string to a float, throwing if it's not a positive number.
 * @param {*} s String meant to represent a positive number
 * @returns The numerical string parsed as a float.
 */
export function parseNumberString (s) {
  const n = parseFloat(s)
  if (isNaN(n) || n <= 0) {
    throw new Error(`Expected positive number, but got: ${s}`)
  }
  return n
}
