import tap from "tap"
import { Command } from "commander"
import { DBConnection } from "../../../src/types.js"
import * as storesRepo from "../../../src/repositories/stores.js"

tap.test("list stores handler", async function(t) {
  let mockConnection
  let command: Command

  tap.beforeEach(async function(t) {
    command = new Command()
    mockConnection = {
      query: async (...args) => {}
    } as any
  })

  tap.test("calls findAllStores", async function(t) {
    // Arrange
    const findAllStoresSpy = t.captureFn(async (db: DBConnection) => {})
    const { listStoresHandler } = await t.mockImport("../../../src/handlers/list-stores.js", {
      "../../../src/repositories/stores.js": t.createMock(storesRepo, {
        findAllStores: findAllStoresSpy
      })
    }) as typeof import("../../../src/handlers/list-stores.js")

    // Act
    await listStoresHandler(mockConnection, {}, command)

    // Assert
    t.equal(findAllStoresSpy.calls.length, 1)
    t.ok(true)
  })

  tap.test("calls findStoreById", async function(t) {
    // Arrange
    const findStoreByIdSpy = t.captureFn(async (db: DBConnection, id: number) => {})
    const { listStoresHandler } = await t.mockImport("../../../src/handlers/list-stores.js", {
      "../../../src/repositories/stores.js": t.createMock(storesRepo, {
        findStoreById: findStoreByIdSpy
      })
    }) as typeof import("../../../src/handlers/list-stores.js")
    const id = 1

    // Act
    await listStoresHandler(mockConnection, {id}, command)

    // Assert
    t.equal(findStoreByIdSpy.calls.length, 1)
    t.equal(findStoreByIdSpy.calls[0].args[1], id)
  })

  tap.test("calls findStoresByPattern", async function(t) {
    // Arrange
    const findStoresByPatternSpy = t.captureFn(async (db: DBConnection, pattern: string) => {})
    const { listStoresHandler } = await t.mockImport("../../../src/handlers/list-stores.js", {
      "../../../src/repositories/stores.js": t.createMock(storesRepo, {
        findStoresByPattern: findStoresByPatternSpy
      })
    }) as typeof import("../../../src/handlers/list-stores.js")
    const pattern = "market"

    // Act
    await listStoresHandler(mockConnection, {pattern}, command)

    // Assert
    t.equal(findStoresByPatternSpy.calls.length, 1)
    t.equal(findStoresByPatternSpy.calls[0].args[1], pattern)
  })
})