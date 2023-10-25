import { query } from '#src/db/index.js'

export default class DbHelpers {
  /**
   * Obtains an array of strings from database representing valid measurement units.
   */
  static async getValidUnits () {
    const result = await query('SELECT unnest(enum_range(NULL::measurement_unit)) as unit;')
    return result.rows.map(({ unit }) => unit)
  }
}
