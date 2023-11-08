import tap from "tap"
import { DBConnection } from "../../../src/types.js"
import { Store } from "../../../src/repositories/stores.js"
import { AddStoreHandlerOptions } from "../../../src/commands/add-store.js"

tap.test("add store handler should call createStore with db connection", async function(t) {
  // Arrange
  const store: AddStoreHandlerOptions = {
    storeName: 'Bell Peppers',
  }
  const mockConnection = {
    query: async (...args) => {}
  } as any
  const createStoreSpy = await t.captureFn(
    async (db: DBConnection, store: Omit<Store, 'id'>) => {}
  )

  const { addStoreHandler } = await t.mockImport("../../../src/handlers/add-store.js", {
    "../../../src/repositories/stores.js": {
      createStore: createStoreSpy
    }
  }) as typeof import("../../../src/handlers/add-store.js")

  // Act
  await addStoreHandler(mockConnection, store)

  // Assert
  t.equal(createStoreSpy.calls.length, 1)
  t.equal(createStoreSpy.calls[0].args[0], mockConnection)
  t.match(createStoreSpy.calls[0].args[1], store)
})