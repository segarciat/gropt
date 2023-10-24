import pg from 'pg'

const pool = new pg.Pool()

export async function query(text, params, callback) {
  return await pool.query(text, params, callback)
}
