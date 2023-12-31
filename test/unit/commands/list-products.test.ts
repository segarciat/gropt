import tap from 'tap'
import { buildListProducts, ListProductsOptions } from '../../../src/commands/list-products.js'
import { DBConnection } from '../../../src/types.js'
import { Command } from 'commander'

let handlerSpy: any
let command: Command

tap.beforeEach(async function (t) {
  const mockDb = {
    query: async (...args: any[]) => {}
  } as any as DBConnection
  handlerSpy = t.captureFn(
    async (db: DBConnection, opts: ListProductsOptions, command: Command) => {
    })
  command = buildListProducts(mockDb, handlerSpy)
})

await tap.test('call with no options', async function (t) {
  // Arrange
  const args = ''.split(/\s+/)

  // Act
  command.parse(args, { from: 'user' })

  // Assert
  t.equal(handlerSpy.calls.length, 1)
  t.match(handlerSpy.calls[0].args[1], {})
})

await tap.test('call with --id option', async function (t) {
  // Arrange
  const invalidIdMustBeInteger = '--id seven'.split(/\s+/)
  const invalidIdArgMustBePositiveInteger = '--id 0'.split(/\s+/)
  const validIdArg = '--id 1'.split(/\s+/)
  command.exitOverride()

  // Act
  command.parse(validIdArg, { from: 'user' })
  t.throws(() => command.parse(invalidIdMustBeInteger, { from: 'user' }))
  t.throws(() => command.parse(invalidIdArgMustBePositiveInteger, { from: 'user' }))

  t.equal(handlerSpy.calls.length, 1)
  t.match(handlerSpy.calls[0].args[1], { id: 1 })
})

await tap.test('call with --name-pattern option', async function (t) {
  // Arrange
  const arg = '--name-pattern bell p'.split(/\s+/)

  // Act
  command.parse(arg, { from: 'user' })

  // Assert
  t.equal(handlerSpy.calls.length, 1)
  t.match(handlerSpy.calls[0].args[1], { namePattern: 'bell p' })
})

await tap.test('conflicting options fails', async function (t) {
  // Arrange
  const idNameConflictArg = '--name-pattern bell p --id 7'.split(/\s+/)
  const idBrandConflictArg = "--brand-pattern granny's --id 7".split(/\s+/)

  // Act && Assert
  t.throws(() => command.parse(idNameConflictArg, { from: 'user' }))
  t.throws(() => command.parse(idBrandConflictArg, { from: 'user' }))
  t.equal(handlerSpy.calls.length, 0)
})

await tap.test('--pattern-name and --brand-pattern is a valid combinations', async function (t) {
  const validBrandNameArg = "--name-pattern bell p --brand-pattern granny's".split(/\s+/)

  // Act
  command.parse(validBrandNameArg, { from: 'user' })

  // Assert
  t.equal(handlerSpy.calls.length, 1)
  t.same(handlerSpy.calls[0].args[1], { namePattern: 'bell p', brandPattern: "granny's" })
})
