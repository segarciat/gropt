import tap from 'tap'
import { Command } from 'commander'
import { addCommandHandler } from '../../../src/handlers/add.js'

await tap.test('Passing non-positive amount or price to add handler should throw', async function (t) {
  // Arrange
  const command = new Command()
  command.exitOverride() // Prevent it from calling process.exit()
  await t.rejects(addCommandHandler({
    productName: 'Apple',
    storeName: 'Store',
    price: 1,
    amount: 0
  }, command))
  await t.rejects(addCommandHandler({
    productName: 'Apple',
    storeName: 'Store',
    price: 0,
    amount: 1
  }, command))
  t.end()
})
