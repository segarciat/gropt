import tap from 'tap'

tap.test('Gets array of valid units as strings.', async function (t) {
  // Arrange
  const mockQuery = async (text, values, options) => {
    return {
      rows: [{ unit: 'lb' }, { unit: 'oz' }]
    }
  }
  const { default: Helpers } = await t.mockImport('#src/db/helpers.js', {
    '#src/db/index.js': { query: mockQuery }
  })

  // Act
  const actualUnits = Helpers.getValidUnits()

  // Assert
  t.resolveMatch(actualUnits, ['lb', 'oz'])
  t.end()
})
