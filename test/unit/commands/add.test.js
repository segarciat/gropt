import tap from 'tap'
import { createAddSubcommand, addCommandHandler } from '#src/commands/add.js'

tap.test('Handler for "add" subcommand called with required arguments and options correctly.', function (t) {
  // Arrange
  const spyHandler = t.captureFn((productNameArg, options) => true)
  const validUnits = ['foo']
  const addCommand = createAddSubcommand(spyHandler, validUnits)
  const args = 'Red Bell Peppers --price 1.5 --amount 1 --store Trader Joes'.split(/\s+/)

  // Act
  addCommand.parse(args, { from: 'user' })

  // Assert
  t.same(spyHandler.calls[0].args[0], ['Red', 'Bell', 'Peppers'])
  t.match(spyHandler.calls[0].args[1], {
    price: 1.5,
    amount: 1,
    store: ['Trader', 'Joes']
  })
  t.equal(spyHandler.calls[0].returned, true)
  t.end()
})

tap.test('Passing non-positive amount or price to add handler should throw', function (t) {
  // Arrange
  t.rejects(addCommandHandler(['Apple'], { price: 'two', amount: '1' }))
  t.rejects(addCommandHandler(['Apple'], { price: '1', amount: 'two' }))
  t.rejects(addCommandHandler(['Apple'], { price: '0', amount: '1' }))
  t.rejects(addCommandHandler(['Apple'], { price: '1', amount: '0' }))
  t.end()
})

tap.test('A decimal amount without specifying --unit should be invalid', async function (t) {
  t.rejects(addCommandHandler(['Apple'], { price: '1', amount: '1.5', store: 'TJ' }))
})
