import tap from 'tap'

await tap.test('Gets array of valid units as strings.', async function (t) {
  // Arrange
  const mockQuery = async (text: string, values?: any[]): Promise<any> => {
    return {
      rows: [{ unit: 'lb' }, { unit: 'oz' }]
    }
  }

  const { getValidUnits } = (await t.mockImport('../../../src/db/helpers.js', {
    '../../../src/db/index.js': { query: mockQuery }
  })) as typeof import('../../../src/db/helpers.js')

  // Act
  const actualUnits = await getValidUnits()

  // Assert
  await t.same(actualUnits, ['lb', 'oz'])
  t.end()
})
