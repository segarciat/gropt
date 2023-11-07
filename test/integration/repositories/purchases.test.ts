import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import { pool } from '../../../src/db.js'
import { DBConnection } from '../../../src/types.js'
import { createProduct } from '../../../src/repositories/products.js'
import { createStore } from '../../../src/repositories/stores.js'
import { createPurchase } from '../../../src/repositories/purchases.js'

let mockConnection: DBConnection

tap.beforeEach(async function () {
  mockConnection = await pool["_pool"].connect()
  await mockConnection.query('BEGIN;')
})

tap.afterEach(async function () {
  await mockConnection.query('ROLLBACK;')
  const client = mockConnection as pg.PoolClient
  client.release()
})

await tap.test('Creating purchases in databases succeeds if related store and product exist.', async function (t) {
  // Arrange
  const product = await createProduct(mockConnection, { productName: 'Apples' })
  const store = await createStore(mockConnection, { storeName: 'Supermarket' })
  const purchaseDetails = {
    productId: product.id,
    storeId: store.id,
    price: 15.0,
    amount: 7,
    unit: 'lb',
    purchasedOn: new Date()
  }

  // Act
  const purchase = await createPurchase(mockConnection, purchaseDetails)

  // Assert
  t.match(product, { id: Number })
  t.match(store, { id: Number })
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })

  console.log("finished purchase test 1 successfully")
})

await tap.test('Creating a duplicate purchase throws an exception', async function (t) {
  // Arrange
  const product = await createProduct(mockConnection, { productName: 'Apples' })
  const store = await createStore(mockConnection, { storeName: 'Supermarket' })
  const purchaseDetails = {
    productId: product.id,
    storeId: store.id,
    price: 15.0,
    amount: 7,
    unit: 'lb',
    purchasedOn: new Date()
  }

  const purchase = await createPurchase(mockConnection, purchaseDetails)

  // Assert
  await t.rejects(createPurchase(mockConnection, purchaseDetails))
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })

  console.log("finished purchase test 2 successfully")
})
