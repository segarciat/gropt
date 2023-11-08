import { AddProductHandlerOptions } from '../commands/add-product.js'
import { createProduct } from '../repositories/products.js'
import { DBConnection } from '../types.js'

export async function addProductHandler (db: DBConnection, options: AddProductHandlerOptions): Promise<void> {
  const product = await createProduct(db, options)
  console.table(product)
}
