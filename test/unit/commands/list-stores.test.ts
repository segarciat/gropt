import tap from "tap"
import { buildListStores, ListStoreCommandOptions } from "../../../src/commands/list-stores.js"
import { DBConnection } from "../../../src/types.js"
import { Command } from "commander"

tap.test("list stores comand", async function(t) {
  let handlerSpy
  let command: Command

  tap.beforeEach(async function(t) {
    const mockDb = {
      query: async (...args) => {}
    } as any
    handlerSpy = t.captureFn(
      async (db: DBConnection, opts: ListStoreCommandOptions, command: Command) => {
    })
    command = buildListStores(mockDb as DBConnection, handlerSpy)
  })

  tap.test("call with no options", async function(t) {
    // Arrange
    const args = "".split(/\s+/)

    // Act
    command.parse(args, { from: "user" })

    // Assert
    t.equal(handlerSpy.calls.length, 1)
    t.match(handlerSpy.calls[0].args[1], {})
  })

  tap.test("call with --id option", async function(t) {
    // Arrange
    const invalidIdMustBeInteger = "--id seven".split(/\s+/)
    const invalidIdArgMustBePositiveInteger = "--id 0".split(/\s+/)
    const validIdArg = "--id 1".split(/\s+/)
    command.exitOverride()

    // Act
    command.parse(validIdArg, { from: "user"} )
    t.throws(() => command.parse(invalidIdMustBeInteger, { from: "user"}))
    t.throws(() => command.parse(invalidIdArgMustBePositiveInteger, { from: "user"}))

    t.equal(handlerSpy.calls.length, 1)
    t.match(handlerSpy.calls[0].args[1], { id: 1 })
  })

  tap.test("call with --pattern option", async function(t) {
    // Arrange
    const arg = "--pattern trader joes".split(/\s+/)

    // Act
    command.parse(arg, { from: "user"})

    // Assert
    t.equal(handlerSpy.calls.length, 1)
    t.match(handlerSpy.calls[0].args[1], { pattern: "trader joes"})
  })

  tap.test("conflicting options fails", async function(t) {
    // Arrange
    const arg = "--pattern trader joes --id 7".split(/\s+/)

    // Act && Assert
    t.throws(() => command.parse(arg, { from: "user"}))
  })
})