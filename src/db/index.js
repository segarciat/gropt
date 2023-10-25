import pg from 'pg'

const pool = new pg.Pool({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT,
  host: process.env.PGHOST,
  allowExitOnIdle: true
})

/**
 * Runs an SQL query given a query string and parameters to substitute.
 * @param {*} sqlString The parametrized SQL query string.
 * @param {*} parameters The parameters to substitute, required only when sqlString has parameters.
 * @returns The result of the query, which contains a rows array with results.
 */
export async function query (sqlString, parameters) {
  return await pool.query({
    text: sqlString,
    values: parameters
  })
}
