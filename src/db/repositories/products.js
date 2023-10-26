import { toCamelCase } from '#src/utils.js'
import { query } from '#src/db/index.js'

export default class Products {
  static async create ({ productName, brand }) {
    const result = await query(
      'INSERT INTO products (product_name, brand) VALUES ($1, $2) RETURNING *;',
      [productName, brand]
    )
    return toCamelCase(result.rows[0])
  }

  static async findByName (productName) {
    const result = await query(
      'SELECT * FROM products WHERE product_name = $1;',
      [productName]
    )
    return toCamelCase(result.rows[0])
  }
}
