import { DBConnection } from '../types.js'

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
 * @param db Connection used to make the database request.
 * @param purchase The relevant purchase details.
 * @returns The product from the database.
 */
export async function createPurchase (db: DBConnection, purchase: Omit<Purchase, 'id'>): Promise<Purchase> {
  const { productId, storeId, purchasedOn, price, amount, unit } = purchase
  const { rows } = await db.query(`INSERT INTO 
      purchases (product_id, store_id, purchased_on, price, amount, unit)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `, [productId, storeId, convertDateToISOString(purchasedOn), price, amount, unit]
  )
  return parseDBPurchase(rows?.[0])
}

function parseDBPurchase (row: any): Purchase {
  return {
    id: row.id,
    productId: row.product_id,
    storeId: row.store_id,
    purchasedOn: row.purchased_on,
    price: row.price,
    amount: row.amount,
    unit: row.unit
  }
}

function convertDateToISOString (date: Date): string {
  return date.toISOString().split('T')[0]
}
