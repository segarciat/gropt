import tap from 'tap'
import { query } from '../../src/db/index.js'

process.env.PGUSER = 'dev-user'
process.env.PGDATABASE = 'dev-user'
process.env.PGPASSWORD = 'dev-password'
process.env.PGPORT = 6000
process.env.PGHOST = '127.0.0.1'

tap.test('Should connect to database without rejecting', async function (t) {
  const result = await query('SELECT 1 + 1 as answer;')
  t.ok(result)
  t.equal(result.rows[0].answer, 2)
})
