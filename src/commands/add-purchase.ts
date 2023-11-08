import { Command, Option } from 'commander'
import { DBConnection } from '../types.js'
import { getValidUnits } from '../repositories/units.js'
import { dateParser, idParser, positiveNumberParser } from './parsers.js'

export interface AddPurchaseHandlerOptions {
  /** Positive integer for ID in product table in database. */
  productId: number
  /** Positive integer for ID in store table in database. */
  storeId: number
  /** Date when item was purchased. */
  datePurchased?: Date
  /** Positive number representing item price. */
  cost: number
  /** Positive integer representing quantity, allowing float if units is defined. */
  amount: number
  /** Unit string valid in database. */
  units?: string
}

export type AddPurchaseHandler = (db: DBConnection, options: AddPurchaseHandlerOptions, command: Command) => Promise<void>

export async function buildAddPurchaseCommand (db: DBConnection, handler: AddPurchaseHandler): Promise<Command> {
  const validUnits = await getValidUnits(db)
  return new Command('purchase')
    .description('Adds a new purchase')
    .exitOverride()
    .addOption(new Option('-p, --product-id <product_id>', 'ID of product purchased.')
      .makeOptionMandatory()
      .argParser(idParser)
    )
    .addOption(new Option('-s, --store-id <store_id>', 'ID of store where product was purchased.')
      .makeOptionMandatory()
      .argParser(idParser)
    )
    .addOption(new Option('-c, --cost <cost>', 'Cost of product.')
      .makeOptionMandatory()
      .argParser(positiveNumberParser)
    )
    .addOption(new Option('-a, --amount <amount>', 'Product quantity, or weight if -u is specified.')
      .makeOptionMandatory()
      .argParser(positiveNumberParser)
    )
    .addOption(new Option('-d, --date-purchased <date>', 'Date when product was purchased in YYYY-MM-DD format. Defauls to today.')
      .argParser(dateParser)
    )
    .addOption(new Option('-u, --units <units>', 'Amount measurement units. Defaults to unitless for integer amounts.')
      .choices(validUnits)
    )
    .action(async (options: AddPurchaseHandlerOptions, command: Command) => {
      await handler(db, options, command)
    })
}
