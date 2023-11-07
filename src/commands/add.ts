import { Command, Option } from 'commander'

export interface AddHandlerOptions {
  productName: string
  storeName: string
  price: number
  amount: number
  unit?: string
  datePurchased?: Date
  brand?: string
}

export type AddHandler = (
  options: AddHandlerOptions,
  command: Command
) => Promise<void>

/**
 * Creates subcommand 'add' for recording a new grocery purchase.
 * @param handler Function executed with arguments and options parsed by this command.
 * @param validUnits Measurement Unit choices for -u option.
 * @returns A prepared 'add' Command object.
 */
export function buildAddCommand (handler: AddHandler, validUnits: string[]): Command {
  interface AddCommandOptions {
    productName: string[]
    storeName: string[]
    price: number
    amount: number
    units: string
    datePurchased: Date
    brand: string[]
  }
  return new Command('add')
    .description('Add a new grocery purchase.')
    .exitOverride()
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
    .option('-b, --brand <brand>', 'Brand of the product.')
    .action(async (productNameArg: string[], options: AddCommandOptions, command: Command) => {
      if (options.units === undefined && options.amount !== Math.floor(options.amount)) {
        command.error(`Invalid options: received non-integer --amount ${options.amount} but did not provide --units.`)
      }
      const handlerOptions: AddHandlerOptions = {
        ...options,
        productName: productNameArg.join(' '),
        storeName: options.storeName.join(' '),
        brand: options.brand?.join(' ')
      }

      await handler(handlerOptions, command)
    })
}
