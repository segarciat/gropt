import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import * as Context from '../context.js'

let client: pg.PoolClient
let storesModule: any

tap.before(async function () {
  client = await Context.getClientFromPool()
  storesModule = await Context.mockDbAt('../../../src/db/repositories/stores.js', client)
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

await tap.test('Creating a store in database enables finding it', async function (t) {
  const storeDetails = {
    storeName: 'Circle',
    location: { x: 25, y: 27 }
  }

  const nonExistentStore = await storesModule.findStoreByName(storeDetails.storeName)
  const insertedStore = await storesModule.createStore(storeDetails)
  const foundStore = await storesModule.findStoreByName(storeDetails.storeName)

  t.notOk(nonExistentStore)
  t.match(insertedStore, { id: Number })
  t.same(insertedStore, foundStore)
  t.match(insertedStore, storeDetails)
})

await tap.test('Creating a store without location succeeds', async function (t) {
  const storeName = 'Best Supermarket'

  const insertedStore = await storesModule.createStore({ storeName })

  t.match(insertedStore, { id: Number, storeName })
  t.notOk(insertedStore.location)
})
