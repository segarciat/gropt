import { AddStoreHandlerOptions } from '../commands/add-store.js'
import { createStore } from '../repositories/stores.js'
import { DBConnection } from '../types.js'

export async function addStoreHandler (db: DBConnection, options: AddStoreHandlerOptions): Promise<void> {
  const store = await createStore(db, options)
  console.table(store)
}
