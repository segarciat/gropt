import { DBConnection } from '../types.js'

export interface Store {
  id: number
  storeName: string
}

export type StoreIdentifiers = Pick<Store, 'id' | 'storeName'>

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
  return parseDBStores(rows)?.[0]
}

/**
 * Gets all stores from the database.
 * @param db Connection used to make the database request.
 * @returns Array of all stores in database.
 */
export async function findAllStores (db: DBConnection): Promise<StoreIdentifiers[] | undefined> {
  const { rows } = await db.query('SELECT id, store_name FROM stores ORDER BY store_name ASC;')
  return parseDBStores(rows)
}

/**
 * Get all stores from the database matching the given pattern, if it exists
 * @param db Connection used to make the database request.
 * @param pattern Pattern for matching the store name, at the moment only supports substring.
 */
export async function findStoresByPattern (db: DBConnection, pattern: string): Promise<StoreIdentifiers[] | undefined> {
  const { rows } = await db.query(
    `SELECT id, store_name FROM stores
    WHERE POSITION(UPPER($1) in UPPER(store_name)) > 0
    ORDER BY store_name ASC;`,
    [pattern]
  )
  return parseDBStores(rows)
}

/**
 * Gets a store from the database matching the given id, if one exists.
 * @param db Connection used to make the database request.
 * @param id The id of an existing store in the database.
 * @returns The single store that matches, or undefined if none match.
 */
export async function findStoreById (db: DBConnection, id: number): Promise<Store | undefined> {
  const { rows } = await db.query(
    'SELECT * FROM stores WHERE id = $1',
    [id]
  )
  return parseDBStores(rows)?.[0]
}

/**
 * Converts row from stores table to an equivalent Store object.
 * @param row Object representing row from stores database.
 * @returns Equivalent Store object.
 */
function parseDBStores (rows: any[] | undefined): Store[] | undefined {
  if (rows !== undefined && rows.length > 0) {
    return rows.map(row => ({
      id: row.id,
      storeName: row.store_name
    }))
  }
}
