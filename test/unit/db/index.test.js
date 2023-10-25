import tap from 'tap'

tap.test('Should connect to database without rejecting', async function (t) {
  // Arrange: mock pg.Pool import.
  class MockPool {
    async query (text, values) {
      return {
        rows: [{ answer: 2 }]
      }
    }
  }
  const { query } = await t.mockImport('#src/db/index.js', {
    pg: { Pool: MockPool }
  })

  // Act
  const result = await query('SELECT 1 + 1 as answer;')

  // Assert
  t.equal(result.rows[0].answer, 2)
})
