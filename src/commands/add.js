import { Command, Option } from 'commander'
import { parseNumberString } from '../utils/validation.js'
// import { parsePrice, parseProductAmount } from '../utils/parsers.js'

export const validUnits = ['oz', 'lb', 'g', 'cups']

/**
 * Creates 'add' subcommand for gropt, to be used as gropt add, for adding a new grocery purchase.
 * @param {*} handler Function that updates database with grocery information.
 * @returns Command object representing 'add'
 */
export function createAddCommand(handler) {
  return new Command('add')
    .description('Enter price details for a new grocery item')
    .argument('<product_name...>', 'Name of grocery product item.')
    .requiredOption('-s, --store <store_name...>', 'Store where product was bought.')
    .requiredOption('-p, --price <product_price>', 'Price of product')
    .requiredOption('-a, --amount <product_amount>', 'Amount of product.')
    .addOption(new Option('-u, --unit <measurement_unit>', 'Amount measurement units. Default unitless for integer amounts.')
      .choices(validUnits)
    )
    .option('-d, --date-purchased <date>', 'Date when product was purchased. Defauls to today.')
    .option('-b, --brand <brand>', 'Brand of the product.')
    .action((handler))
}

export function addCommandHandler(productNameArg, options, command) {
  // Validate arguments and option values.
  const amount = parseNumberString(options.amount)
  if (!options.unit && amount !== parseInt(amount)) {
    throw new Error(`Invalid options: received non-integer --amount ${amount} but did not provide --unit.`)
  }
  const price = parseNumberString(options.price)

  // Get product and store from database.
  const productName = productNameArg.join(' ')
  const { brand } = options
  const store = options.store.join(' ')
  // TODO: Get the productId from productName/brand combination, and storeId, from database.
}
