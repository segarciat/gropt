import { Command } from 'commander'
import { DBConnection } from '../types.js'
import { buildListStores } from './list-stores.js'
import { listStoresHandler } from '../handlers/list-stores.js'
import { buildListProducts } from './list-products.js'
import { listProductsHandler } from '../handlers/list-products.js'

export function buildListCommand (db: DBConnection): Command {
  const listCommands = [
    buildListStores(db, listStoresHandler),
    buildListProducts(db, listProductsHandler)
  ]

  const listCommand = new Command('list').description('List items from your tracker')
  listCommands.forEach((command) => listCommand.addCommand(command))

  return listCommand
}
