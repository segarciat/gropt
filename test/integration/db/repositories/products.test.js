import tap from 'tap'
import 'dotenv/config'
import Context from '../context.js'

let client
let Products

tap.before(async function () {
  client = await Context.getClientFromPool()
  Products = await Context.mockDbAt('#src/db/repositories/products.js', client)
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

tap.test('Creating a product in database enables finding it', async function (t) {
  const productDetails = {
    productName: 'yogurt',
    brand: 'dairyFarms'
  }

  const nonExistentProduct = await Products.findByName(productDetails.productName)
  const insertedProduct = await Products.create(productDetails)
  const foundProduct = await Products.findByName(productDetails.productName)

  t.notOk(nonExistentProduct)
  t.match(insertedProduct, { id: Number })
  t.same(insertedProduct, foundProduct)
  t.match(insertedProduct, productDetails)
})
