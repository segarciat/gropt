import { Command } from 'commander'
import { DBConnection } from '../types.js'
import { buildAddProductCommand } from './add-product.js'
import { addProductHandler } from '../handlers/add-product.js'
import { buildAddStoreCommand } from './add-store.js'
import { addStoreHandler } from '../handlers/add-store.js'
import { buildAddPurchaseCommand } from './add-purchase.js'
import { addPurchaseHandler } from '../handlers/add-purchase.js'

/**
 * Create add subcommand.
 * @param db Database pool connection.
 * @returns Prepared Command.
 */
export async function buildAddCommand (db: DBConnection): Promise<Command> {
  return new Command('add')
    .description('Add an entry to tracker.')
    .addCommand(buildAddProductCommand(db, addProductHandler))
    .addCommand(buildAddStoreCommand(db, addStoreHandler))
    .addCommand(await buildAddPurchaseCommand(db, addPurchaseHandler))
}
