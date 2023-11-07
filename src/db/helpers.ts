import { query } from '../db/index.js'

/**
 * Obtains an array of strings from database representing valid measurement units.
 */
export async function getValidUnits (): Promise<string[]> {
  const result = await query('SELECT unnest(enum_range(NULL::measurement_unit)) as unit;')
  return result.rows.map(({ unit }) => unit)
}
