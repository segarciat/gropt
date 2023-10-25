#! /usr/bin/env node

import { Command } from 'commander'
import { createAddCommand, addCommandHandler } from '../commands/add.js'

// Information matches the dev configuration in docker compose file; used for database pool connection.
process.env.PGUSER = 'dev-user'
process.env.PGDATABASE = 'dev-user'
process.env.PGPASSWORD = 'dev-password'
process.env.PGPORT = 6000
process.env.PGHOST = '127.0.0.1'

const program = new Command('gropt')
  .description('Grocery price tracker')
  .version('1.0.0')

program.addCommand(createAddCommand(addCommandHandler))

try {
  program.parse()
} catch (err) {
  program.error(err)
}
