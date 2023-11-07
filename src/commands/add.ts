import { Command, Option } from 'commander'
import { DBConnection } from '../types.js'
import { getValidUnits } from '../repositories/units.js'

export interface AddCommandOptions {
  productName: string[]
  storeName: string[]
  price: number
  amount: number
  units: string
  datePurchased: Date
  brand: string[]
}

export type AddHandler = (db: DBConnection, options: AddCommandOptions, command: Command) => Promise<void>

/**
 * Creates subcommand 'add' for recording a new grocery purchase.
 * @param handler Function executed with arguments and options parsed by this command.
 * @param db
 * @returns A prepared 'add' Command object.
 */
export async function buildAddCommand (handler: AddHandler, db: DBConnection): Promise<Command> {
  const validUnits = await getValidUnits(db)
  return new Command('add')
    .description('Add a new grocery purchase.')
    .argument('<product_name...>', 'Name of product.')
    .requiredOption('-s, --store-name <store_name...>', 'Store where product was purchased.')
    .requiredOption('-p, --price <price>', 'Price of product.', parseFloat)
    .requiredOption('-a, --amount <amount>', 'Product quantity, or weight if -u is specified.', parseFloat)
    .addOption(new Option('-u, --units <units>', 'Amount measurement units. Defaults to unitless for integer amounts.')
      .choices(validUnits)
    )
    .addOption(new Option('-d, --date-purchased <date>', 'Date when product was purchased in YYYY-MM-DD format. Defauls to today.')
      .argParser((dateStr) => new Date(dateStr))
    )
    .option('-b, --brand <brand...>', 'Brand of the product.')
    .action(async (productName: string[], options: Omit<AddCommandOptions, 'productName'>, command) => {
      await handler(db, { ...options, productName }, command)
    })
}
