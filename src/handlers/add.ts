import { Command } from 'commander'

import { DBConnection } from '../types.js'
import { findProductByName, createProduct } from '../repositories/products.js'
import { findStoreByName, createStore } from '../repositories/stores.js'
import { createPurchase } from '../repositories/purchases.js'
import { AddCommandOptions } from '../commands/add.js'

export async function addCommandHandler (db: DBConnection, options: AddCommandOptions, command: Command): Promise<void> {
  if (options.units === undefined && options.amount !== Math.floor(options.amount)) {
    command.error(`Invalid options: received non-integer --amount ${options.amount} but did not provide --units.`)
  }

  // Validate arguments and option values.
  if (options.amount <= 0) {
    command.error(`Expected positive amount, but got ${options.amount}.`)
  }
  if (options.price <= 0) {
    command.error(`Expected positive price, but got ${options.price}.`)
  }

  const productName = options.productName.join(' ')
  const brand = options.brand?.join(' ')

  // Get product and store from database.
  console.log('Searching for matching product...')
  let product = await findProductByName(db, productName)
  if (product === undefined) {
    console.log('Did not find product. Creating it.')
    product = await createProduct(db, {
      productName,
      brand
    })
  }
  console.log(product)

  const storeName = options.productName.join(' ')
  console.log('Searching for matching store')
  let store = await findStoreByName(db, storeName)
  if (store === undefined) {
    console.log('Did not find store. Creating')
    store = await createStore(db, { storeName })
  }
  console.log(store)

  console.log('Attempting to create purchase')
  const purchase = await createPurchase(db, {
    productId: product.id,
    storeId: store.id,
    purchasedOn: options.datePurchased ?? new Date(),
    price: options.price,
    amount: options.amount,
    unit: options.units
  })
  console.log(purchase)
}
