import { toCamelCase } from '#src/utils.js'
import { query } from '#src/db/index.js'

export default class Stores {
  static async create ({ storeName, location: { x, y } }) {
    const result = await query(
      'INSERT INTO stores (store_name, location) VALUES ($1, $2) RETURNING *;',
      [storeName, `(${x}, ${y})`]
    )
    return toCamelCase(result.rows[0])
  }

  static async findByName (storeName) {
    const result = await query(
      'SELECT * FROM stores WHERE store_name = $1;',
      [storeName]
    )
    return toCamelCase(result.rows[0])
  }
}
