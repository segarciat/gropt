import { Command, Option } from 'commander'
import { DBConnection } from '../types.js'
import { idParser, multiWordParser } from './parsers.js'

export interface ListStoreCommandOptions {
  id?: number
  pattern?: string
}

export type ListStoresHandler = (db: DBConnection, options: ListStoreCommandOptions, command: Command) => Promise<void>

export function buildListStores (db: DBConnection, handler: ListStoresHandler): Command {
  return new Command('store')
    .description('Show stores that you have saved to your database')
    .exitOverride()
    .addOption(new Option('-i, --id <id>', 'Match store of given ID.').argParser(idParser).conflicts('pattern'))
    .addOption(new Option('-p, --pattern <pattern...>', 'Text contained in the store name.').argParser(multiWordParser))
    .action(async (options, command) => {
      await handler(db, options, command)
    })
}
