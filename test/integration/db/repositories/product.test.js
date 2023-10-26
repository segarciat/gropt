import tap from 'tap'
import 'dotenv/config'
import { getClient } from '#src/db/index.js'

let client

tap.beforeEach(async function () {
  client = await getClient()
  await client.query('BEGIN;')
})

tap.afterEach(async function () {
  await client.query('ROLLBACK;')
  await client.release()
})

tap.test('Creating a product in database enables finding it', async function (t) {
  const productDetails = {
    productName: 'yogurt',
    brand: 'dairyFarms'
  }

  const { default: Products } = await t.mockImport('#src/db/repositories/products.js', {
    '#src/db/index.js': {
      query: async (text, values) => {
        return await client.query({ text, values })
      }
    }
  })

  const nonExistentProduct = await Products.findByName(productDetails.productName)
  const insertedProduct = await Products.create(productDetails)
  const foundProduct = await Products.findByName(productDetails.productName)

  t.notOk(nonExistentProduct)
  t.match(insertedProduct, { id: Number })
  t.same(insertedProduct, foundProduct)
  t.match(insertedProduct, productDetails)
})
