import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import * as Context from '../context.js'

let client: pg.PoolClient
let purchaseModule: any
let productModule: any
let storeModule: any

tap.before(async function () {
  client = await Context.getClientFromPool()
  purchaseModule = await Context.mockDbAt('../../../src/db/repositories/purchases.js', client)
  productModule = await Context.mockDbAt('../../../src/db/repositories/products.js', client)
  storeModule = await Context.mockDbAt('../../../src/db/repositories/stores.js', client)
})

tap.after(async function () {
  await client.release()
})

tap.beforeEach(async function () {
  await client.query('BEGIN;')
})

tap.afterEach(async function () {
  await client.query('ROLLBACK;')
})

await tap.test('Creating purchases in databases succeeds if related store and product exist.', async function (t) {
  // Arrange
  const product = await productModule.createProduct({ productName: 'Apples' })
  const store = await storeModule.createStore({ storeName: 'Supermarket' })
  const purchaseDetails = {
    productId: product.id,
    storeId: store.id,
    price: 15.0,
    amount: 7,
    unit: 'lb',
    purchasedOn: new Date()
  }

  // Act
  const purchase = await purchaseModule.createPurchase(purchaseDetails)

  // Assert
  t.match(product, { id: Number })
  t.match(store, { id: Number })
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })
})

await tap.test('Creating a duplicate purchase throws an exception', async function (t) {
  // Arrange
  const product = await productModule.createProduct({ productName: 'Apples' })
  const store = await storeModule.createStore({ storeName: 'Supermarket' })
  const purchaseDetails = {
    productId: product.id,
    storeId: store.id,
    price: 15.0,
    amount: 7,
    unit: 'lb',
    purchasedOn: new Date()
  }

  // Act
  const purchase = await purchaseModule.createPurchase(purchaseDetails)

  // Assert
  await t.rejects(purchaseModule.createPurchase(purchaseDetails))
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })
})
