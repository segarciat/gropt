import tap from "tap"
import { Command } from "commander"
import { DBConnection } from "../../../src/types.js"
import * as productsRepo from "../../../src/repositories/products.js"

tap.test("list products handler", async function(t) {
  let mockConnection
  let command: Command

  tap.beforeEach(async function(t) {
    command = new Command()
    mockConnection = {
      query: async (...args) => {}
    } as any
  })

  tap.test("calls findAllProducts", async function(t) {
    // Arrange
    const findAllProductsSpy = t.captureFn(async (db: DBConnection) => {})
    const { listProductsHandler } = await t.mockImport("../../../src/handlers/list-products.js", {
      "../../../src/repositories/products.js": t.createMock(productsRepo, {
        findAllProducts: findAllProductsSpy
      })
    }) as typeof import("../../../src/handlers/list-products.js")

    // Act
    await listProductsHandler(mockConnection, {}, command)

    // Assert
    t.equal(findAllProductsSpy.calls.length, 1)
    t.ok(true)
  })

  tap.test("calls findProductById", async function(t) {
    // Arrange
    const findProductByIdSpy = t.captureFn(async (db: DBConnection, id: number) => {})
    const { listProductsHandler } = await t.mockImport("../../../src/handlers/list-products.js", {
      "../../../src/repositories/products.js": t.createMock(productsRepo, {
        findProductById: findProductByIdSpy
      })
    }) as typeof import("../../../src/handlers/list-products.js")
    const id = 1

    // Act
    await listProductsHandler(mockConnection, {id}, command)

    // Assert
    t.equal(findProductByIdSpy.calls.length, 1)
    t.equal(findProductByIdSpy.calls[0].args[1], id)
  })

  tap.test("calls findProductsByPattern", async function(t) {
    // Arrange
    const findProductsByPatternSpy = t.captureFn(async (db: DBConnection, pattern: string) => {})
    const { listProductsHandler } = await t.mockImport("../../../src/handlers/list-products.js", {
      "../../../src/repositories/products.js": t.createMock(productsRepo, {
        findProductsByPattern: findProductsByPatternSpy
      })
    }) as typeof import("../../../src/handlers/list-products.js")
    const options = {
      namePattern: "pepper",
      brandPattern: "farm"
    }

    // Act
    await listProductsHandler(mockConnection, options, command)

    // Assert
    t.equal(findProductsByPatternSpy.calls.length, 1)
    t.equal(findProductsByPatternSpy.calls[0].args[1], options.namePattern)
    t.equal(findProductsByPatternSpy.calls[0].args[2], options.brandPattern)
  })
})