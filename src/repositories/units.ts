import { DBConnection } from '../types.js'

/**
 * Obtains an array of strings from database representing valid measurement units.
 * @param db Connection use to retrieve the units.
 * @returns Array of units.
 * @throws If no units exist, throws an exception.
 */
export async function getValidUnits (db: DBConnection): Promise<string[]> {
  const result = await db.query('SELECT unnest(enum_range(NULL::measurement_unit)) as unit;')
  if (result.rows === undefined) {
    throw new Error('No valid units exist.')
  }
  return result.rows?.map(({ unit }) => unit)
}
