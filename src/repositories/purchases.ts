import { DBConnection } from '../types.js'

export interface Purchase {
  id: number
  productId: number
  storeId: number
  datePurchased: Date
  cost: number
  amount: number
  units?: string
}

/**
 * Creates a purchase in the database from the given purchase details.
 * @param db Connection used to make the database request.
 * @param purchase The relevant purchase details.
 * @returns The product from the database.
 */
export async function createPurchase (db: DBConnection, purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
  const { productId, storeId, datePurchased: purchasedOn, cost, amount, units } = purchase
  const { rows } = await db.query(`INSERT INTO 
      purchases (product_id, store_id, date_purchased, cost, amount, units)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `, [productId, storeId, convertDateToISOString(purchasedOn), cost, amount, units]
  )
  return parseDBPurchase(rows?.[0])
}

function parseDBPurchase (row: any): Purchase {
  return {
    id: row.id,
    productId: row.product_id,
    storeId: row.store_id,
    datePurchased: row.date_purchased,
    cost: row.cost,
    amount: row.amount,
    units: row.units
  }
}

function convertDateToISOString (date: Date): string {
  return date.toISOString().split('T')[0]
}
