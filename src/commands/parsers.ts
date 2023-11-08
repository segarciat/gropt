import { InvalidOptionArgumentError } from 'commander'

export function multiWordParser (current: string, prev?: string): string {
  return prev === undefined ? current : `${prev} ${current}`
}

/**
 * Parse number as string, throwing an error if it's NaN.
 * @param arg The string representing a number.
 * @returns Float version of number.
 */
export function numberParser (arg: string): number {
  const n = parseFloat(arg)
  if (isNaN(n)) {
    throw new InvalidOptionArgumentError(`Expected a number, but got '${arg}'.`)
  }
  return n
}
