import tap from 'tap'

await tap.test('Should connect to database without rejecting', async function (t) {
  // Arrange: mock pg.Pool import.
  class MockPool {
    async query (text: string, values: any[]): Promise<any> {
      return {
        rows: [{ answer: 2 }]
      }
    }
  }
  const { query } = await t.mockImport('../../../src/db/index.js', {
    pg: { Pool: MockPool }
  }) as typeof import('../../../src/db/index.js')

  // Act
  const result = await query('SELECT 1 + 1 as answer;')

  // Assert
  t.equal(result.rows[0].answer, 2)
})
