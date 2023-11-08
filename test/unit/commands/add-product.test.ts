import tap from "tap"
import { Command } from "commander"
import { DBConnection } from "../../../src/types.js"
import { AddProductHandler, AddProductHandlerOptions, buildAddProductCommand } from "../../../src/commands/add-product.js"

tap.test("add product command correctly parses arguments", async function(t) {
    // Arrange
    const handlerSpy = t.captureFn(
      async (db: DBConnection, options: AddProductHandlerOptions, command: Command) => {}
    ) as any
    const mockPool = {
      query: async (...args) => {}
    } as any

    const addProductCommand = await buildAddProductCommand(
      mockPool as DBConnection,
      handlerSpy as AddProductHandler,
      )
    const args = '--product-name Red Bell Peppers --brand McGucket  Farms'.split(/\s+/)

    // Act
    addProductCommand.parse(args, { from: 'user'} )

    // Assert
    t.ok(handlerSpy.calls.length > 0)
    t.match(handlerSpy.calls[0].args[1], {
      productName: "Red Bell Peppers",
      brand: "McGucket Farms"
    })
})