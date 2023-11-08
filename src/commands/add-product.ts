import { Command, Option } from 'commander'
import { DBConnection } from '../types.js'
import { multiWordParser } from './parsers.js'

export interface AddProductHandlerOptions {
  productName: string
  brand: string
}

export type AddProductHandler = (db: DBConnection, options: AddProductHandlerOptions) => Promise<void>

export function buildAddProductCommand (db: DBConnection, handler: AddProductHandler): Command {
  return new Command('product')
    .description('Add a new product.')
    .addOption(new Option('-n, --product-name <product_name...>', 'Name of product.')
      .makeOptionMandatory()
      .argParser(multiWordParser)
    )
    .addOption(new Option('-b, --brand <brand...>', 'Brand of the product.')
      .argParser(multiWordParser)
    )
    .action(async (options: AddProductHandlerOptions, command) => {
      await handler(db, options)
    })
}
