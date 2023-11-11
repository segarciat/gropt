import { Command } from 'commander'
import { ListStoreCommandOptions } from '../commands/list-stores.js'
import { DBConnection } from '../types.js'
import { findAllStores, findStoreById, findStoresByPattern } from '../repositories/stores.js'

export async function listStoresHandler (db: DBConnection, options: ListStoreCommandOptions, command: Command): Promise<void> {
  if (options.pattern !== undefined) {
    const stores = await findStoresByPattern(db, options.pattern)
    console.table(stores)
  } else if (options.id !== undefined) {
    const store = await findStoreById(db, options.id)
    console.table(store)
  } else {
    const stores = await findAllStores(db)
    console.table(stores)
  }
}
