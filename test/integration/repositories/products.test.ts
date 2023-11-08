import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import { pool } from "../../../src/db.js"
import { findProductByName, createProduct, Product } from "../../../src/repositories/products.js"
import { DBConnection } from '../../../src/types.js'

let mockConnection: DBConnection

tap.beforeEach(async function () {
  mockConnection = await pool["_pool"].connect()
  await mockConnection.query('BEGIN;')
  console.log("beforeEach finished")
})

tap.afterEach(async function () {
  await mockConnection.query('ROLLBACK;')
  const client = mockConnection as pg.PoolClient
  client.release()
  console.log("afterEach finished")
})

await tap.test('Creating a product in database enables finding it', async function (t) {
  const productDetails: Omit<Product, 'id'> = {
    productName: 'yogurt',
    brand: 'dairyFarms'
  }

  const nonExistentProduct = await findProductByName(mockConnection, productDetails.productName)
  const insertedProduct = await createProduct(mockConnection, productDetails)
  const foundProduct = await findProductByName(mockConnection, productDetails.productName)

  t.notOk(nonExistentProduct)
  t.match(insertedProduct, { id: Number })
  t.same(insertedProduct, foundProduct)
  t.match(insertedProduct, productDetails)
  console.log("finished product test successfully")
})