import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import { pool } from '../../../src/db.js'
import { DBConnection } from '../../../src/types.js'
import { findStoreByName, createStore } from '../../../src/repositories/stores.js'

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

await tap.test('Creating a store in database enables finding it', async function (t) {
  const storeDetails = {
    storeName: 'Circle',
    location: { lng: 25, lat: 27 }
  }

  const nonExistentStore = await findStoreByName(mockConnection, storeDetails.storeName)
  const insertedStore = await createStore(mockConnection, storeDetails)
  const foundStore = await findStoreByName(mockConnection, storeDetails.storeName)

  t.notOk(nonExistentStore)
  t.match(insertedStore, { id: Number })
  t.same(insertedStore, foundStore)
  t.match(insertedStore, storeDetails)
})

await tap.test('Creating a store without location succeeds', async function (t) {
  const storeName = 'Best Supermarket'

  const insertedStore = await createStore(mockConnection, { storeName })

  t.match(insertedStore, { id: Number, storeName })
  t.notOk(insertedStore.location)
})
