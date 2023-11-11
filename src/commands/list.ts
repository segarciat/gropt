import { Command } from 'commander'
import { DBConnection } from '../types.js'
import { buildListStores } from './list-stores.js'
import { listStoresHandler } from '../handlers/list-stores.js'

export function buildListCommand (db: DBConnection): Command {
  const listStores = buildListStores(db, listStoresHandler)

  return new Command('list')
    .description('List items from your tracker')
    .addCommand(listStores)
}
