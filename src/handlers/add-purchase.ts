import { Command } from 'commander'
import { AddPurchaseHandlerOptions } from '../commands/add-purchase.js'
import { DBConnection } from '../types.js'
import { createPurchase } from '../repositories/purchases.js'

export async function addPurchaseHandler (db: DBConnection, options: AddPurchaseHandlerOptions, command: Command): Promise<void> {
  if (options.units === undefined && options.amount !== Math.floor(options.amount)) {
    command.error(`Invalid options: received non-integer --amount ${options.amount} but did not provide --units.`)
  }

  const purchase = await createPurchase(db, {
    productId: options.productId,
    storeId: options.storeId,
    datePurchased: options.datePurchased ?? new Date(),
    cost: options.cost,
    amount: options.amount,
    units: options.units
  })
  console.table(purchase)
}
