import tap from 'tap'
import { getValidUnits } from '../../../src/repositories/units.js'
import { DBConnection } from '../../../src/types.js'

await tap.test('unit parser gets array of valid units as strings.', async function (t) {
  // Arrange
  const mockQuery = t.captureFn(
    async (text: string, values?: any[]): Promise<any> => {
      return {
        rows: [{ unit: 'lb' }, { unit: 'oz' }]
      }
    }
  )
  const mockConnnection = { query: mockQuery } as any as DBConnection

  // Act
  const actualUnits = await getValidUnits(mockConnnection)

  // Assert
  t.same(actualUnits, ['lb', 'oz'])
  t.equal(1, mockQuery.calls.length)
  t.end()
})

await tap.test('unit parser throws when database does not return any rows', async function (t) {
  const mockConnection = {
    query: async (...args: any[]) => { return {} }
  } as any as DBConnection
  await t.rejects(getValidUnits(mockConnection))
})
