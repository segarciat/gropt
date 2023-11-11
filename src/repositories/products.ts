import { DBConnection } from '../types.js'

export interface Product {
  id: number
  productName: string
  brand: string
}

export type ProductIdentifiers = Pick<Product, 'id' | 'productName' | 'brand'>

/**
 * Creates a product in database.
 * @param db Connection used to make the database request.
 * @param product Product details to insert into database.
 * @returns id of created product.
 */
export async function createProduct (db: DBConnection, product: Omit<Product, 'id'>): Promise<number | undefined> {
  const { productName, brand } = product
  const { rows } = await db.query(
    `INSERT INTO products (product_name, brand)
    SELECT $1::VARCHAR, $2::VARCHAR
    WHERE NOT EXISTS
     (
     SELECT product_name, brand
     FROM products
     WHERE UPPER(product_name) = UPPER($1) AND UPPER(brand) = UPPER($2)
     )
     RETURNING *;`,
    [productName, brand]
  )
  return parseDBProducts(rows)?.[0]?.id
}

/**
 *Retrieves a product from the database by its id
 * @param db Connection used to make the database request.
 * @param id The unique id of the desired product.
 * @returns The product that matches the given id.
 */
export async function findProductById (db: DBConnection, id: number): Promise<Product | undefined> {
  const { rows } = await db.query(
    'SELECT * FROM products WHERE id = $1',
    [id]
  )
  return parseDBProducts(rows)?.[0]
}

/**
 * Retrieves a product from the database by its name.
 * @param db Connection used to make the database request.
 * @param namePattern The name of the desired product.
 * @returns The matching product.
 */
export async function findProductsByPattern (db: DBConnection, namePattern?: string, brandPattern?: string): Promise<ProductIdentifiers[] | undefined> {
  const { rows } = await db.query(
    `SELECT id, product_name, brand FROM products
    WHERE POSITION(UPPER($1) in UPPER(product_name)) > 0 AND
          POSITION(UPPER($2) in UPPER(brand)) > 0
    ORDER BY product_name ASC;`,
    [namePattern ?? '', brandPattern ?? '']
  )
  return parseDBProducts(rows)
}

export async function findAllProducts (db: DBConnection): Promise<ProductIdentifiers[] | undefined> {
  const { rows } = await db.query(
    'SELECT id, product_name, brand FROM products ORDER BY product_name ASC;'
  )
  return parseDBProducts(rows)
}

function parseDBProducts (rows: any[] | undefined): Product[] | undefined {
  if (rows !== undefined && rows.length > 0) {
    return rows.map(row => ({
      id: row.id,
      productName: row.product_name,
      brand: row.brand
    }))
  }
}
