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
  const storeDetails = {
    storeName: 'Circle',
    location: { x: 25, y: 27 }
  }

  const { default: Stores } = await t.mockImport('#src/db/repositories/stores.js', {
    '#src/db/index.js': {
      query: async (text, values) => {
        return await client.query({ text, values })
      }
    }
  })

  const nonExistentStore = await Stores.findByName(storeDetails.storeName)
  const insertedStore = await Stores.create(storeDetails)
  const foundStore = await Stores.findByName(storeDetails.storeName)

  t.notOk(nonExistentStore)
  t.match(insertedStore, { id: Number })
  t.same(insertedStore, foundStore)
  t.match(insertedStore, storeDetails)
})
