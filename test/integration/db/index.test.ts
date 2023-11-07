import tap from 'tap'
import { query } from '../../../src/db/index.js'

tap.before(async function () {
  await import('dotenv/config')
})

await tap.test('Should connect to database without rejecting', async function (t) {
  // Arrange

  // Act
  const result = await query('SELECT 1 + 1 as answer;')

  // Assert
  t.equal(result.rows[0].answer, 2)
})
