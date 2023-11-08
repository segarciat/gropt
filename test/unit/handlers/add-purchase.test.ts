import tap from "tap"
import { DBConnection } from "../../../src/types.js"
import { Purchase } from "../../../src/repositories/purchases.js"
import { AddPurchaseHandlerOptions } from "../../../src/commands/add-purchase.js"
import { Command } from "commander"

tap.test("add purchase handler", async function(t) {
  let mockConnection
  let createPurchaseSpy
  let command
  let addPurchaseHandler

  tap.beforeEach(async function() {
    mockConnection = {
      query: async (...args) => {}
    } as any
    createPurchaseSpy = await t.captureFn(
      async (db: DBConnection, purchase: Omit<Purchase, 'id'>) => {}
    )
    command = new Command().exitOverride()
  
    const addPurchaseHandlerModule = await t.mockImport("../../../src/handlers/add-purchase.js", {
      "../../../src/repositories/purchases.js": {
        createPurchase: createPurchaseSpy
      }
    }) as typeof import("../../../src/handlers/add-purchase.js")

    addPurchaseHandler = addPurchaseHandlerModule.addPurchaseHandler
  })

  tap.test("calls createPurchase with db connection when given correct arguments", async function(t) {
    // Arrange
    const purchase: AddPurchaseHandlerOptions = {
      productId: 1,
      storeId: 2,
      amount: 1,
      cost: 15,
    }

    // Act
    await addPurchaseHandler(mockConnection, purchase, command)

    // Assert
    t.equal(createPurchaseSpy.calls.length, 1)
    t.equal(createPurchaseSpy.calls[0].args[0], mockConnection)
    t.match(createPurchaseSpy.calls[0].args[1], {
      productId: purchase.productId,
      storeId: purchase.storeId,
      amount: purchase.amount,
      cost: purchase.cost,
      datePurchased: Date,
      units: undefined,
    })
  })

  tap.test("Results in error when units are not specified, and the amount is not an integer", async function(t) {
    // Arrange
    const purchase: AddPurchaseHandlerOptions = {
      productId: 1,
      storeId: 2,
      amount: 1.5,
      cost: 15,
    }
    command.exitOverride()

    // Act
    t.rejects(addPurchaseHandler(mockConnection, purchase, command))

    // Assert
    t.equal(createPurchaseSpy.calls.length, 0)
  })

  tap.test("Allows decimal when units are specified", async function(t) {
    // Arrange
    const purchase: AddPurchaseHandlerOptions = {
      productId: 1,
      storeId: 2,
      amount: 1.5,
      cost: 15,
      units: 'lb',
    }

    // Act
    await addPurchaseHandler(mockConnection, purchase, command)

    // Assert
    t.equal(createPurchaseSpy.calls.length, 1)
    t.equal(createPurchaseSpy.calls[0].args[0], mockConnection)
    t.match(createPurchaseSpy.calls[0].args[1], {
      productId: purchase.productId,
      storeId: purchase.storeId,
      amount: purchase.amount,
      cost: purchase.cost,
      datePurchased: Date,
      units: purchase.units,
    })
  })
})