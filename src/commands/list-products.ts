import { Command, Option } from 'commander'
import { DBConnection } from '../types.js'
import { idParser, multiWordParser } from './parsers.js'

export interface ListProductsOptions {
  id?: number
  namePattern?: string
  brandPattern?: string
}

export type ListProductsHandler = (db: DBConnection, options: ListProductsOptions, command: Command) => Promise<void>

export function buildListProducts (db: DBConnection, handler: ListProductsHandler): Command {
  return new Command('product')
    .description('Show products that you have saved to your database')
    .exitOverride()
    .addOption(new Option('-i, --id <id>', 'Match product of given ID.').argParser(idParser).conflicts(['namePattern', 'brandPattern']))
    .addOption(new Option('-p, --name-pattern <name_pattern...>', 'Text contained in the product name.').argParser(multiWordParser))
    .addOption(new Option('-b, --brand-pattern <brand_pattern...>', 'Text contained in the brand name').argParser(multiWordParser))
    .action(async (options: ListProductsOptions, command: Command) => {
      await handler(db, options, command)
    })
}
