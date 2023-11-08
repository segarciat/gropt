import { Argument, Command } from 'commander'
import { DBConnection } from '../types.js'
import { multiWordParser } from './parsers.js'

export interface AddStoreHandlerOptions {
  storeName: string
}

export type AddStoreHandler = (db: DBConnection, options: AddStoreHandlerOptions) => Promise<void>

export function buildAddStoreCommand (db: DBConnection, handler: AddStoreHandler): Command {
  return new Command('store')
    .description('Add a new store.')
    .addArgument(new Argument('<store_name...>', 'Name of store.')
      .argRequired()
      .argParser(multiWordParser)
    )
    .action(async (storeName: string) => {
      await handler(db, { storeName })
    })
}
