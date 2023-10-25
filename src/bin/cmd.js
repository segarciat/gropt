#! /usr/bin/env node

import { Command } from 'commander'
import { createAddSubcommand, addCommandHandler } from '../commands/add.js'
import { getValidUnits } from '#src/db/helpers.js'

// Information matches the dev configuration in docker compose file; used for database pool connection.
process.env.PGUSER = 'dev-user'
process.env.PGDATABASE = 'dev-user'
process.env.PGPASSWORD = 'dev-password'
process.env.PGPORT = 6000
process.env.PGHOST = '127.0.0.1'

const program = new Command('gropt')
  .description('Grocery price tracker')
  .version('1.0.0')

const validUnits = await getValidUnits()

const addSubCommand = createAddSubcommand(addCommandHandler, validUnits)

program.addCommand(addSubCommand)

try {
  program.parse()
} catch (err) {
  program.error(err)
}
