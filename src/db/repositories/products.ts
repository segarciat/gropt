import { toCamelCase } from '../../utils.js'
import { query } from '../../db/index.js'

export interface Product {
  id: number
  productName: string
  brand?: string
}

/**
 * Creates a product in database.
 * @returns The product item inserted in database.
 */
export async function createProduct (product: Omit<Product, 'id'>): Promise<Product> {
  const { productName, brand } = product
  const { rows } = await query(
    'INSERT INTO products (product_name, brand) VALUES ($1, $2) RETURNING *;',
    [productName, brand]
  )
  return toCamelCase(rows[0])
}

/**
 * Retrieves a product from the database by its name.
 * @param productName The name of the desired product.
 * @returns The matching product.
 */
export async function findProductByName (productName: string): Promise<Product> {
  const { rows } = await query(
    'SELECT * FROM products WHERE product_name = $1;',
    [productName]
  )
  return toCamelCase(rows[0])
}
