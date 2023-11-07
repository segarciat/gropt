import tap from 'tap'
import { pool } from '../../src/db.js'
import { getValidUnits } from '../../src/repositories/units.js'

tap.before(async function () {
  await import('dotenv/config')
})

await tap.test('Loads array of strings representing units from database', async function (t) {
  const units = await getValidUnits(pool)

  t.ok(units.length > 0)
  units.forEach(el => t.type(el, String))
})
