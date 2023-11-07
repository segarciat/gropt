import { findProductByName, createProduct } from '../db/repositories/products.js'
import { findStoreByName, createStore } from '../db/repositories/stores.js'
import { createPurchase } from '../db/repositories/purchases.js'
import { AddHandlerOptions } from '../commands/add.js'
import { Command } from 'commander'

export async function addCommandHandler (options: AddHandlerOptions, command: Command): Promise<void> {
  const { amount, price, productName, storeName } = options
  // Validate arguments and option values.
  if (amount <= 0) {
    command.error(`Expected positive amount, but got ${amount}.`)
  }
  if (price <= 0) {
    command.error(`Expected positive price, but got ${price}.`)
  }

  // Get product and store from database.
  console.log('Searching for matching product...')
  let product = await findProductByName(productName)
  if (product === undefined) {
    console.log('Did not find product. Creating it.')
    product = await createProduct({
      productName,
      brand: options.brand
    })
  }
  console.log(product)

  console.log('Searching for matching store')
  let store = await findStoreByName(storeName)
  if (store === undefined) {
    console.log('Did not find store. Creating')
    store = await createStore({
      storeName
    })
  }
  console.log(store)

  console.log('Attempting to create purchase')
  const purchase = await createPurchase({
    productId: product.id,
    storeId: store.id,
    purchasedOn: options.datePurchased ?? new Date(),
    price,
    amount,
    unit: options.unit
  })
  console.log(purchase)
}
