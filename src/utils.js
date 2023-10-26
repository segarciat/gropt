import camelCase from 'lodash.camelcase'

/**
 * Parses the numerical string to a float, throwing if it's not a positive number.
 * @param {*} s String meant to represent a positive number
 * @returns The numerical string parsed as a float.
 */
export function parsePositiveNumber (s) {
  const n = parseFloat(s)
  if (isNaN(n) || n <= 0) {
    throw new Error(`Expected positive number, but got: ${s}`)
  }
  return n
}

/**
 * Returns a copy of the object, but with its keys in camel case, or o if null or undefined.
 * @param {*} o Object whose key names will be modified.
 * @returns Copy of object with camel case keys
 */
export function toCamelCase (o) {
  if (!o) {
    return o
  } else {
    return Object.entries(o)
      .reduce((acc, [key, value]) => {
        acc[camelCase(key)] = value
        return acc
      }, {})
  }
}
