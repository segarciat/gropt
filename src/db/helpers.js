import { query } from '#src/db/index.js'

/**
 * Obtains an array of strings from database representing valid measurement units.
 */
export async function getValidUnits () {
  return (await query('SELECT unnest(enum_range(NULL::measurement_unit)) as unit;'))
    .rows
    .map(({ unit }) => unit)
}
