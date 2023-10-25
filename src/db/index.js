import pg from 'pg'

const pool = new pg.Pool()

/**
 * Performs an SQL query given a query string and parameters to substitute.
 * @param {*} text The SQL query string.
 * @param {*} values The parameters to substitute.
 * @param {*} options Extra options, such as rowmode.
 * @returns The result of the query, which contains a rows array with results.
 */
export async function query (text, values, options) {
  return await pool.query({
    ...options,
    text,
    values
  })
}
