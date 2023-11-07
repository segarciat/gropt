import { DBConnection } from '../types.js'

export interface StoreLocation {
  lat: number
  lng: number
}

export interface Store {
  id: number
  storeName: string
  location?: StoreLocation
}

/**
 * Creates a new store in the database.
 * @param db Connection used to make the database request.
 * @param store Store details to save.
 */
export async function createStore (db: DBConnection, store: Omit<Store, 'id'>): Promise<Store> {
  const { storeName, location } = store
  const { rows } = await db.query(
    'INSERT INTO stores (store_name, location) VALUES ($1, $2) RETURNING *;',
    [storeName, location === undefined ? undefined : `(${location.lng}, ${location.lat})`]
  )
  return parseDBStore(rows?.[0])
}

/**
 * Get store from the database matching the given name, if it exists.
 * @param db Connection used to make the database request.
 * @param storeName Name of desired store.
 */
export async function findStoreByName (db: DBConnection, storeName: string): Promise<Store | undefined> {
  const { rows } = await db.query(
    'SELECT * FROM stores WHERE store_name = $1;',
    [storeName]
  )
  if (rows !== undefined && rows.length > 0) {
    console.log(rows[0])
    return parseDBStore(rows[0])
  }
}

/**
 * Converts row from stores table to an equivalent Store object.
 * @param row Object representing row from stores database.
 * @returns Equivalent Store object.
 */
function parseDBStore (row: any): Store {
  return {
    id: row.id,
    storeName: row.store_name,
    location: row.location === null
      ? undefined
      : {
          lng: row.location.x,
          lat: row.location.y
        }
  }
}
