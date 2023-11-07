import tap from 'tap'
import { getValidUnits } from '../../../src/db/helpers.js'

tap.before(async function () {
  await import('dotenv/config')
})

await tap.test('Loads array of strings representing units from database', async function (t) {
  const units = await getValidUnits()

  t.type(units, Array)
  t.ok(units.length)
  units.forEach(el => t.type(el, String))
})
