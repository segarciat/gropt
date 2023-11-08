import { InvalidOptionArgumentError } from 'commander'

export function multiWordParser (current: string, prev?: string): string {
  return prev === undefined ? current : `${prev} ${current}`
}

/**
 * Parse number as string, throwing an error if it's NaN.
 * @param arg The string representing a number.
 * @returns Float version of number.
 */
function numberParser (arg: string): number {
  const n = parseFloat(arg)
  if (isNaN(n)) {
    throw new InvalidOptionArgumentError(`Expected a number, but got '${arg}'.`)
  }
  return n
}

/**
 * If arg is a string representing a number, returns its as a float, otherwise it throws.
 * @param arg The string representing a number.
 * @returns Float version of arg.
 */
export function positiveNumberParser (arg: string): number {
  const n = numberParser(arg)
  if (n <= 0) {
    throw new InvalidOptionArgumentError(`Expected a positive number, but got ${n}`)
  }
  return n
}

/**
 * If arg is a string representing a positive integer, returns its as a float, otherwise it throws.
 * @param arg The string representing a number.
 * @returns Float version of arg.
 */
export function idParser (arg: string): number {
  const n = positiveNumberParser(arg)
  if (n !== Math.floor(n)) {
    throw new InvalidOptionArgumentError(`Expected a whole number, but got ${arg}`)
  }
  return n
}

/**
 * Parses a given date, throwing if the date is invalid.
 * @param arg Possible date string.
 * @returns Date string in YYYY-MM-DD format.
 */
export function dateParser (arg: string): Date {
  const date = new Date(arg)
  if (isNaN(date.getTime())) {
    throw new InvalidOptionArgumentError(`Expected a date in YYYY-MM-DD format, but got ${arg}`)
  }
  return date
}
