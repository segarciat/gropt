import { query } from '../../db/index.js'
import { toCamelCase } from '../../utils.js'

export interface Purchase {
  id: number
  productId: number
  storeId: number
  purchasedOn: Date
  price: number
  amount: number
  unit?: string
}

/**
 * Creates a purchase in the database from the given purchase details.
 * @param purchase The relevant purchase details.
 * @returns The product from the database.
 */
export async function createPurchase (purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
  const { productId, storeId, purchasedOn, price, amount, unit } = purchase
  const { rows } = await query(`INSERT INTO 
      purchases (product_id, store_id, purchased_on, price, amount, unit)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `, [productId, storeId, purchasedOn, price, amount, unit]
  )
  return toCamelCase(rows[0])
}
