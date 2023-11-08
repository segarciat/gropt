import tap from "tap"
import { Command } from "commander"
import { DBConnection } from "../../../src/types.js"
import { AddPurchaseHandler, AddPurchaseHandlerOptions } from "../../../src/commands/add-purchase.js"

tap.test("add product command correctly parses arguments", async function() {
  let handlerSpy
  let addPurchaseCommand
    tap.beforeEach(async function(t) {
      handlerSpy = t.captureFn(
        async (db: DBConnection, options: AddPurchaseHandlerOptions, command: Command) => {}
      ) as any

      const mockPool = {
        query: async (...args) => {}
      } as any

      const { buildAddPurchaseCommand } = await t.mockImport("../../../src/commands/add-purchase.js", {
        "../../../src/repositories/units.js": {
          getValidUnits: async(...args) => ['lb', 'oz']
        }
      }) as typeof import("../../../src/commands/add-purchase.js")
  
      addPurchaseCommand = await buildAddPurchaseCommand(
        mockPool as DBConnection,
        handlerSpy as AddPurchaseHandler,
        )
    })

    tap.test("Parses options correctly and calls spy successfully", async function(t) {
      // Arrange
      const args = '--product-id 1 --store-id 2 --date-purchased 2000-11-29 --cost 15.7 --amount 2'.split(/\s+/)

      // Act
      addPurchaseCommand.parse(args, { from: 'user'} )

      // Assert
      t.ok(handlerSpy.calls.length > 0)
      t.match(handlerSpy.calls[0].args[1], {
        productId: 1,
        storeId: 2,
        datePurchased: new Date("2000-11-29"),
        cost: 15.7,
        amount: 2
      })
    })

    tap.test("Throws when options given are incorrect", async function(t) {
      const invalidUnitsArgs = '--product-id 1 --store-id 2 --date-purchased 2000-11-29 --cost 15.7 --amount 2 --units wrong'.split(/\s+/)
      const invalidId = '--product-id two --store-id 2 --date-purchased 2000-11-29 --cost 15.7 --amount 2'.split(/\s+/)
      const invalidDate = '--product-id two --store-id 2 --date-purchased 2000-29-11 --cost 15.7 --amount 2'.split(/\s+/)
      const invalidAmount = '--product-id two --store-id 2 --date-purchased 2000-29-11 --cost 15.7 --amount 2.7'.split(/\s+/)
      const invalidCost = '--product-id two --store-id 2 --date-purchased 2000-29-11 --cost 0 --amount 2'.split(/\s+/)

      t.throws(() => addPurchaseCommand.parse(invalidUnitsArgs, { from: 'user'}))
      t.throws(() => addPurchaseCommand.parse(invalidId, { from: 'user'}))
      t.throws(() => addPurchaseCommand.parse(invalidDate, { from: 'user'}))
      t.throws(() => addPurchaseCommand.parse(invalidAmount, { from: 'user'}))
      t.throws(() => addPurchaseCommand.parse(invalidCost, { from: 'user'}))

      t.equal(handlerSpy.calls.length, 0)
    })
})