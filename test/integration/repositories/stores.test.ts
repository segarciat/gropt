import tap from 'tap'
import pg from 'pg'
import 'dotenv/config'
import { pool } from '../../../src/db.js'
import { DBConnection } from '../../../src/types.js'
import { findStoresByPattern, createStore, findStoreById, findAllStores } from '../../../src/repositories/stores.js'

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

await tap.test('Creating a store in database enables finding them', async function (t) {
  const storeDetails = {
    storeName: 'Circle'
  }
  const nonExistentStore = await findStoresByPattern(mockConnection, storeDetails.storeName)
  const insertedStoreId = await createStore(mockConnection, storeDetails)
  const foundById = await findStoreById(mockConnection, insertedStoreId as number)

  t.notOk(nonExistentStore)
  t.ok(insertedStoreId)
  t.same(foundById?.id, insertedStoreId)
  t.match(foundById, storeDetails)
})

await tap.test('Creating multiple stores enables finding them by pattern', async function(t) {
  const storeDetails0 = {
    storeName: 'a Circle Market'
  }

  const storeDetails1 = {
    storeName: 'b Piggy market'
  }

  const storeDetails2 = {
    storeName: 'c Store store'
  }
  const pattern = "market"

  await createStore(mockConnection, storeDetails0)
  await createStore(mockConnection, storeDetails1)
  await createStore(mockConnection, storeDetails2)
  const allStores = await findAllStores(mockConnection)
  const matchingStores = await findStoresByPattern(mockConnection, pattern)

  t.equal(allStores?.length, 3)
  t.equal(matchingStores?.length, 2)

  t.matchOnlyStrict(matchingStores?.[0], {id: Number, storeName: storeDetails0.storeName})
  t.matchOnlyStrict(matchingStores?.[1], {id: Number, storeName: storeDetails1.storeName})
})
