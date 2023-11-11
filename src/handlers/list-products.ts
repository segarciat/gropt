import { Command } from 'commander'
import { ListProductsOptions } from '../commands/list-products.js'
import { DBConnection } from '../types.js'
import { findAllProducts, findProductById, findProductsByPattern } from '../repositories/products.js'

export async function listProductsHandler (db: DBConnection, options: ListProductsOptions, command: Command): Promise<void> {
  if (options.id !== undefined) {
    // find store by id
    const product = await findProductById(db, options.id)
    console.table(product)
  } else if (options.brandPattern !== undefined || options.namePattern !== undefined) {
    // find store by brand and name pattern
    const products = await findProductsByPattern(db, options.namePattern, options.brandPattern)
    console.table(products)
  } else {
    // Show all products, displaying only id, name, and brand
    const products = await findAllProducts(db)
    console.table(products)
  }
}
