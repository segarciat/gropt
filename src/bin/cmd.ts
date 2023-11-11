#!/usr/bin/env -S npx ts-node
import 'dotenv/config'
import { Command } from 'commander'
import { buildAddCommand } from '../commands/add.js'
import { pool } from '../db.js'
import { buildListCommand } from '../commands/list.js'

async function createProgram (): Promise<Command> {
  const addSubcommand = await buildAddCommand(pool)
  const listSubCommand = await buildListCommand(pool)

  return new Command('gropt')
    .description('Grocery price tracker')
    .version('1.0.0')
    .addCommand(addSubcommand)
    .addCommand(listSubCommand)
}

const program = await createProgram()
program.parse()
