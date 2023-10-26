import { Command, Option } from 'commander'
import { parsePositiveNumber } from '../utils.js'
import Products from '#src/db/repositories/products.js'
import Stores from '#src/db/repositories/stores.js'
import Purchases from '#src/db/repositories/purchases.js'
import { errorCodes } from '#src/db/errors.js'
// import { parsePrice, parseProductAmount } from '../utils/parsers.js'

/**
 * Creates 'add' subcommand for gropt, to be used as gropt add, for adding a new grocery purchase.
 * @param {*} handler Function that updates database with grocery information.
 * @param {*} validUnits Array of valid of units for --measurement-unit option.
 * @returns Command object representing 'add'
 */
export function createAddSubcommand (handler, validUnits) {
  return new Command('add')
    .description('Enter price details for a new grocery item')
    .argument('<product_name...>', 'Name of grocery product item.')
    .requiredOption('-s, --store <store_name...>', 'Store where product was bought.')
    .requiredOption('-p, --price <product_price>', 'Price of product')
    .requiredOption('-a, --amount <product_amount>', 'Amount of product.')
    .addOption(new Option('-u, --measurement-unit <measurement_unit>', 'Amount measurement units. Default unitless for integer amounts.')
      .choices(validUnits)
    )
    .addOption(new Option('-d, --purchased-on <date>', 'Date when product was purchased in YYYY-MM-DD format. Defauls to today.')
      .argParser((dateStr) => new Date(dateStr))
    )
    .option('-b, --brand <brand>', 'Brand of the product.')
    .action((handler))
}

export async function addCommandHandler (productNameArg, options, command) {
  // Validate arguments and option values.
  const amount = parsePositiveNumber(options.amount)
  if (!options.measurementUnit && amount !== parseInt(amount)) {
    command.error(`Invalid options: received non-integer --amount ${amount} but did not provide --unit.`)
  }
  console.log(options)
  const price = parsePositiveNumber(options.price)

  // Get product and store from database.
  const productName = productNameArg.join(' ')
  console.log('Searching for matching product...')
  let product = await Products.findByName(productName)
  if (!product) {
    console.log('Did not find product. Creating it.')
    product = await Products.create({
      productName,
      brand: options.brand
    })
  }
  console.log(product)

  const storeName = options.store.join(' ')
  console.log('Searching for matching store')
  let store = await Stores.findByName(storeName)
  if (!store) {
    console.log('Did not find store. Creating')
    store = await Stores.create({
      storeName
    })
  }
  console.log(store)

  try {
    console.log('Attempting to create purchase')
    const purchase = await Purchases.create({
      productId: product.id,
      storeId: store.id,
      purchasedOn: options.purchasedOn || new Date(),
      price,
      amount,
      unit: options.measurementUnit
    })
    console.log(purchase)
  } catch (err) {
    if (err.code === errorCodes.UNIQUE_CONSTRAINT) {
      command.error(`A purchase for ${product.productName} at ${store.storeName} exists for ${options.purchasedOn?.toString() || 'today'}.`)
    } else {
      command.error(err.message)
    }
  }
}
