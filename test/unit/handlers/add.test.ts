import tap from 'tap'
import { Command, CommanderError } from 'commander'
import { addCommandHandler } from '../../../src/handlers/add.js'
import { AddCommandOptions } from '../../../src/commands/add.js'
import { DBConnection } from '../../../src/types.js'

await tap.test('Passing non-positive amount or price to add handler should throw', async function (t) {
  // Arrange
  const mockPool = {
    query: async (...args) => {}
  } as any as DBConnection

  const options = {
    price: 0,
    amount: 1
  } as any as AddCommandOptions

  const command = new Command()

   // Prevent it from calling process.exit()
  command.exitOverride((err: CommanderError) => {throw err})

  // Act
  t.rejects(addCommandHandler(mockPool, options, command))
  t.end()
})
