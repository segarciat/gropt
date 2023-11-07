import camelCase from 'lodash.camelcase'

/**
 * Returns a copy of the object, but with its keys in camel case, or o if null or undefined.
 * @param o Object whose key names will be modified.
 * @returns Copy of object with camel case keys
 */
export function toCamelCase (o: any): any {
  if (o !== undefined) {
    return Object.entries(o)
      .reduce<any>((acc, [key, value]) => {
      acc[camelCase(key)] = value
      return acc
    }, {})
  }
}
