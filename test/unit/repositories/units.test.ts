import tap from 'tap'
import { getValidUnits } from '../../../src/repositories/units.js'
import { DBConnection } from "../../../src/types.js"

await tap.test('Gets array of valid units as strings.', async function (t) {
  // Arrange
  const mockQuery = t.captureFn(
    async (text: string, values?: any[]): Promise<any> => {
      return {
        rows: [{ unit: 'lb' }, { unit: 'oz' }]
      }
    }
  ) as any

  // Act
  const actualUnits = await getValidUnits({ query: mockQuery } as DBConnection)

  // Assert
  t.same(actualUnits, ['lb', 'oz'])
  t.equal(1, mockQuery.calls.length)
  t.end()
})
