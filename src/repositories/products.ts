import { DBConnection } from '../types.js'

export interface Product {
  id: number
  productName: string
  brand?: string
}

/**
 * Creates a product in database.
 * @param db Connection used to make the database request.
 * @param product Product details to insert into database.
 * @returns Result of adding product to database.
 */
export async function createProduct (db: DBConnection, product: Omit<Product, 'id'>): Promise<Product> {
  const { productName, brand } = product
  const { rows } = await db.query(
    'INSERT INTO products (product_name, brand) VALUES ($1, $2) RETURNING *;',
    [productName, brand]
  )
  return parseDBProduct(rows?.[0])
}

/**
 * Retrieves a product from the database by its name.
 * @param db Connection used to make the database request.
 * @param productName The name of the desired product.
 * @returns The matching product.
 */
export async function findProductByName (db: DBConnection, productName: string): Promise<Product | undefined> {
  const { rows } = await db.query(
    'SELECT * FROM products WHERE product_name = $1;',
    [productName]
  )
  if (rows !== undefined && rows.length > 0) {
    return parseDBProduct(rows[0])
  }
}

function parseDBProduct (row: any): Product {
  return {
    id: row.id,
    productName: row.product_name,
    brand: row.brand === null ? undefined : row.brand
  }
}
