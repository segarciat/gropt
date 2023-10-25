import tap from 'tap'
import { getValidUnits } from '#src/db/helpers.js'

tap.test('Loads array of strings representing units from database', async function (t) {
  process.env.PGUSER = 'dev-user'
  process.env.PGDATABASE = 'dev-user'
  process.env.PGPASSWORD = 'dev-password'
  process.env.PGPORT = 6000
  process.env.PGHOST = '127.0.0.1'

  const units = await getValidUnits()

  t.type(units, Array)
  t.ok(units.length)
  units.forEach(el => t.type(el, String))
})
