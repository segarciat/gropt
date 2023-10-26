import tap from 'tap'
import 'dotenv/config'
import Context from '../context.js'

let client
let Stores

tap.before(async function () {
  client = await Context.getClientFromPool()
  Stores = await Context.mockDbAt('#src/db/repositories/stores.js', client)
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

tap.test('Creating a store in database enables finding it', async function (t) {
  const storeDetails = {
    storeName: 'Circle',
    location: { x: 25, y: 27 }
  }

  const nonExistentStore = await Stores.findByName(storeDetails.storeName)
  const insertedStore = await Stores.create(storeDetails)
  const foundStore = await Stores.findByName(storeDetails.storeName)

  t.notOk(nonExistentStore)
  t.match(insertedStore, { id: Number })
  t.same(insertedStore, foundStore)
  t.match(insertedStore, storeDetails)
})

tap.test('Creating a store without location succeeds', async function (t) {
  const storeName = 'Best Supermarket'

  const insertedStore = await Stores.create({ storeName })

  t.match(insertedStore, { id: Number, storeName })
  t.notOk(insertedStore.location)
})
