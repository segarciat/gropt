#! /usr/bin/env node

import { Command } from 'commander'
import { createAddCommand, addCommandHandler } from '../commands/add.js'

const program = new Command('gropt')
  .description('Grocery price tracker')
  .version('1.0.0')

program.addCommand(createAddCommand(addCommandHandler))

try {
  program.parse()
} catch (err) {
  program.error(err)
}
