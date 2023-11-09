import { DBConnection } from '../types.js'

export interface Store {
  id: number
  storeName: string
}

/**
 * Creates a new store in the database.
 * @param db Connection used to make the database request.
 * @param store Store details to save.
 */
export async function createStore (db: DBConnection, store: Omit<Store, 'id'>): Promise<Store | undefined> {
  const { storeName } = store
  const { rows } = await db.query(
    `INSERT INTO stores (store_name) 
     SELECT $1::VARCHAR
     WHERE NOT EXISTS
      (
        SELECT store_name
        FROM stores
        WHERE UPPER(store_name) = UPPER($1)
      )
     RETURNING *;`,
    [storeName]
  )
  return parseDBStore(rows)?.[0]
}

/**
 * Get store from the database matching the given name, if it exists.
 * @param db Connection used to make the database request.
 * @param storeName Name of desired store.
 */
export async function findStoreByName (db: DBConnection, storeName: string): Promise<Store[] | undefined> {
  const { rows } = await db.query(
    'SELECT * FROM stores WHERE store_name = $1;',
    [storeName]
  )
  return parseDBStore(rows)
}

/**
 * Converts row from stores table to an equivalent Store object.
 * @param row Object representing row from stores database.
 * @returns Equivalent Store object.
 */
function parseDBStore (rows: any[] | undefined): Store[] | undefined {
  if (rows !== undefined && rows.length > 0) {
    return rows.map(row => ({
      id: row.id,
      storeName: row.store_name
    }))
  }
}
