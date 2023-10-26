import { query } from '#src/db/index.js'
import { toCamelCase } from '#src/utils.js'
import { wrapAndRethrowDbError } from '#src/db/errors.js'

export default class Purchases {
  static async create ({ productId, storeId, purchasedOn, price, amount, unit }) {
    try {
      const { rows } = await query(`INSERT INTO 
        purchases (product_id, store_id, purchased_on, price, amount, unit)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
      `, [productId, storeId, purchasedOn, price, amount, unit]
      )
      return toCamelCase(rows[0])
    } catch (err) {
      wrapAndRethrowDbError(err)
    }
  }
}
