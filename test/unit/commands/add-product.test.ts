import tap from 'tap'
import { Command } from 'commander'
import { DBConnection } from '../../../src/types.js'
import { AddProductHandler, AddProductHandlerOptions, buildAddProductCommand } from '../../../src/commands/add-product.js'

await tap.test('add product command correctly parses arguments', async function (t) {
  // Arrange
  const handlerSpy = t.captureFn(
    async (db: DBConnection, options: AddProductHandlerOptions, command: Command) => {}
  ) as any
  const mockPool = {
    query: async (...args: any[]) => {}
  } as any as DBConnection

  const addProductCommand = await buildAddProductCommand(
    mockPool,
    handlerSpy as AddProductHandler
  )
  const args = '--product-name Red Bell Peppers --brand McGucket  Farms'.split(/\s+/)

  // Act
  addProductCommand.parse(args, { from: 'user' })

  // Assert
  t.ok(handlerSpy.calls.length > 0)
  t.match(handlerSpy.calls[0].args[1], {
    productName: 'Red Bell Peppers',
    brand: 'McGucket Farms'
  })
})
