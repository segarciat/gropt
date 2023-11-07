import tap from 'tap'
import { Command } from 'commander'
import { buildAddCommand, AddHandler, AddCommandOptions } from '../../../src/commands/add.js'
import { DBConnection } from '../../../src/types.js'

await tap.test('All command args parsed correctly and passed to handler.', async function (t) {
  // Arrange
  const handlerSpy = t.captureFn(
    async (db: DBConnection, options: AddCommandOptions, command: Command) => {}
  )
  const mockPool = {
    query: async (...args) => ({rows: ['meters']})
  }
  const addCommand = await buildAddCommand(handlerSpy as AddHandler, mockPool as DBConnection)
  const args = 'Red Bell Peppers --price 1.5 --amount 1 --store-name Trader Joes --brand The   Best'.split(/\s+/)

  // Act
  addCommand.parse(args, { from: 'user' })

  // Assert
  t.ok(handlerSpy.calls.length > 0)
  t.match(handlerSpy.calls[0].args[1], {
    productName: ['Red', 'Bell', 'Peppers'],
    price: 1.5,
    amount: 1,
    storeName: ['Trader', 'Joes'],
    brand: ['The', 'Best']
  })
  t.end()
})
