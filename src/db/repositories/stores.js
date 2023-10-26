import { toCamelCase } from '#src/utils.js'
import { query } from '#src/db/index.js'

export default class Stores {
  static async create ({ storeName, location }) {
    const { rows } = await query(
      'INSERT INTO stores (store_name, location) VALUES ($1, $2) RETURNING *;',
      [storeName, location && `(${location?.x}, ${location?.y})`]
    )
    return toCamelCase(rows[0])
  }

  static async findByName (storeName) {
    const { rows } = await query(
      'SELECT * FROM stores WHERE store_name = $1;',
      [storeName]
    )
    return toCamelCase(rows[0])
  }
}
