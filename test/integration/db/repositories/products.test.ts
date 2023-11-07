import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import * as Context from '../context.js'

let client: pg.PoolClient
let productsModule: any

tap.before(async function () {
  client = await Context.getClientFromPool()
  productsModule = await Context.mockDbAt('../../../src/db/repositories/products.js', client)
})

tap.after(async function () {
  await client.release()
})

tap.beforeEach(async function () {
  console.log('Begin')
  await client.query('BEGIN;')
})

tap.afterEach(async function () {
  console.log('Rollback')
  await client.query('ROLLBACK;')
})

await tap.test('Creating a product in database enables finding it', async function (t) {
  const productDetails = {
    productName: 'yogurt',
    brand: 'dairyFarms'
  }

  const nonExistentProduct = await productsModule.findProductByName(productDetails.productName)
  const insertedProduct = await productsModule.createProduct(productDetails)
  const foundProduct = await productsModule.findProductByName(productDetails.productName)

  t.notOk(nonExistentProduct)
  t.match(insertedProduct, { id: Number })
  t.same(insertedProduct, foundProduct)
  t.match(insertedProduct, productDetails)
})
