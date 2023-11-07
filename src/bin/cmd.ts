#!/usr/bin/env -S npx ts-node
import 'dotenv/config'
import { Command } from 'commander'
import { buildAddCommand } from '../commands/add.js'
import { addCommandHandler } from '../handlers/add.js'
import { pool } from '../db.js'

async function createProgram (): Promise<Command> {
  const addSubcommand = await buildAddCommand(addCommandHandler, pool)

  return new Command('gropt')
    .description('Grocery price tracker')
    .version('1.0.0')
    .addCommand(addSubcommand)
}

const program = await createProgram()
program.parse()
