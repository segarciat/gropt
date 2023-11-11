import tap from 'tap'
import { pool } from '../../src/db.js'

tap.before(async function () {
  await import('dotenv/config')
})

await tap.test('Should connect to database without rejecting', async function (t) {
  // Arrange

  // Act
  const { rows } = await pool.query('SELECT 1 + 1 as answer;')

  // Assert
  t.ok(rows)
  t.equal(rows?.[0].answer, 2)
})
