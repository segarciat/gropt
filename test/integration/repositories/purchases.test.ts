import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import { pool } from '../../../src/db.js'
import { DBConnection } from '../../../src/types.js'
import { createProduct } from '../../../src/repositories/products.js'
import { createStore } from '../../../src/repositories/stores.js'
import { Purchase, createPurchase } from '../../../src/repositories/purchases.js'

let mockConnection: DBConnection

tap.beforeEach(async function () {
  mockConnection = await (pool as any)._pool.connect()
  await mockConnection.query('BEGIN;')
})

tap.afterEach(async function () {
  await mockConnection.query('ROLLBACK;')
  const client = mockConnection as pg.PoolClient
  client.release()
})

await tap.test('Creating purchases in databases succeeds if related store and product exist.', async function (t) {
  // Arrange
  const productId = await createProduct(mockConnection, { productName: 'Apples', brand: 'Natures Best' })
  const storeId = await createStore(mockConnection, { storeName: 'Supermarket' })
  const purchaseDetails: Omit<Purchase, 'id'> = {
    productId: productId ?? NaN,
    storeId: storeId ?? NaN,
    cost: 15.0,
    amount: 7,
    units: 'lb',
    datePurchased: new Date()
  }

  // Act
  const purchase = await createPurchase(mockConnection, purchaseDetails)

  // Assert
  t.ok(productId)
  t.ok(storeId)
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })
})

await tap.test('Creating a duplicate purchase throws an exception', async function (t) {
  // Arrange
  const productId = await createProduct(mockConnection, { productName: 'Apples', brand: 'Natures Best' })
  const storeId = await createStore(mockConnection, { storeName: 'Supermarket' })
  const purchaseDetails: Omit<Purchase, 'id'> = {
    productId: productId ?? NaN,
    storeId: storeId ?? NaN,
    cost: 15.0,
    amount: 7,
    units: 'lb',
    datePurchased: new Date()
  }

  const purchase = await createPurchase(mockConnection, purchaseDetails)

  // Assert
  await t.rejects(createPurchase(mockConnection, purchaseDetails))
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })
})
