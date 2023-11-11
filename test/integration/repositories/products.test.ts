import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import { pool } from "../../../src/db.js"
import { findProductsByPattern, createProduct, Product, findProductById, findAllProducts } from "../../../src/repositories/products.js"
import { DBConnection } from '../../../src/types.js'

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

await tap.test('Creating a product in database enables finding it', async function (t) {
  const productDetails: Omit<Product, 'id'> = {
    productName: 'yogurt',
    brand: 'dairyFarms'
  }

  const nonExistentProduct = await findProductsByPattern(mockConnection, productDetails.productName)
  const insertedProductId = await createProduct(mockConnection, productDetails)
  const foundProduct = await findProductById(mockConnection, insertedProductId!)

  t.notOk(nonExistentProduct)
  t.ok(insertedProductId)
  t.equal(foundProduct?.id, insertedProductId)
  t.match(foundProduct, productDetails)
})

await tap.test('Products can be found by a pattern', async function(t) {
  const productDetails0 = {
    productName: 'a green bell pepper',
    brand: 'best farms'
  }
  const productDetails1 = {
    productName: 'z red bell pepper',
    brand: 'local farm'
  }
  const productDetails2 = {
    productName: 'black pepper',
    brand: 'good aroma spices'
  }

  const namePattern = 'pepper'
  const brandPattern = 'farm'

  await createProduct(mockConnection, productDetails0)
  await createProduct(mockConnection, productDetails1)
  await createProduct(mockConnection, productDetails2)

  const allProducts = await findAllProducts(mockConnection)
  const matchingProducts = await findProductsByPattern(mockConnection, namePattern, brandPattern)

  t.equal(allProducts?.length, 3)
  t.equal(matchingProducts?.length, 2)

  t.matchOnlyStrict(matchingProducts?.[0], {id: Number, ...productDetails0})
  t.matchOnlyStrict(matchingProducts?.[1], {id: Number, ...productDetails1})
})
