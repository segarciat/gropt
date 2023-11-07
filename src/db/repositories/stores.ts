import { toCamelCase } from '../../utils.js'
import { query } from '../../db/index.js'

export interface Store {
  id: number
  storeName: string
  location?: {
    x: number
    y: number
  }
}

/**
 * Creates a new store in the database.
 * @param store Store details to save.
 */
export async function createStore (store: Omit<Store, 'id'>): Promise<Store> {
  const { storeName, location } = store
  const { rows } = await query(
    'INSERT INTO stores (store_name, location) VALUES ($1, $2) RETURNING *;',
    [storeName, location === undefined ? undefined : `(${location.x}, ${location.y})`]
  )
  return toCamelCase(rows[0])
}

/**
 * Get store from the database matching the given name.
 * @param storeName Name of desired store.
 */
export async function findStoreByName (storeName: string): Promise<Store> {
  const { rows } = await query(
    'SELECT * FROM stores WHERE store_name = $1;',
    [storeName]
  )
  return toCamelCase(rows[0])
}
