import tap from 'tap'
import { Command } from 'commander'
import { buildAddCommand, AddHandlerOptions } from '../../../src/commands/add.js'

await tap.test('Handler for "add" subcommand called with required arguments and options correctly.', function (t) {
  // Arrange
  const spyHandler = t.captureFn(
    async (options: AddHandlerOptions, command: Command) => {}
  )
  const validUnits = ['foo']
  const addCommand = buildAddCommand(spyHandler, validUnits)
  const args = 'Red Bell Peppers --price 1.5 --amount 1 --store-name Trader Joes'.split(/\s+/)

  // Act
  addCommand.parse(args, { from: 'user' })

  // Assert
  t.match(spyHandler.calls[0].args[0], {
    productName: 'Red Bell Peppers',
    price: 1.5,
    amount: 1,
    storeName: 'Trader Joes'
  })
  // t.equal(spyHandler.calls[0].returned, true)
  t.end()
})

/**
 * TODO: Re-introduce a working version of this test.
 */
// await tap.test('A decimal amount without specifying --unit should be invalid', async function (t) {
//   // Arrange
//   const spyHandler = t.captureFn((options: AddHandlerOptions, command: Command) => {})
//   const validUnits = ['foo']
//   const addCommand = buildAddCommand(spyHandler, validUnits)
//   const args = 'Red Bell Peppers --price 1.5 --amount 1.5 --store-name Trader Joes'.split(/\s+/)

//   // Act
//   addCommand.parse(args, { from: 'user' })

//   // Assert
//   t.same(spyHandler.calls.length, 0)
//   t.end()
// })
