import pg from 'pg'

const pool = new pg.Pool({
  allowExitOnIdle: true
})

/**
 * Runs an SQL query given a query string and parameters to substitute.
 * @param {*} sqlString The parametrized SQL query string.
 * @param {*} parameters The parameters to substitute, required only when sqlString has parameters.
 * @returns The result of the query, which contains a rows array with results.
 */
export async function query (sqlString: string, parameters?: any[]): Promise<pg.QueryResult<any>> {
  return await pool.query({
    text: sqlString,
    values: parameters
  })
}

/**
 * Obtain a database client. Necessary when doing transactions. When done with client,
 * it's necessary that you run "release".
 */
export async function getClient (): Promise<pg.PoolClient> {
  return await pool.connect()
}
