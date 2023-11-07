#!/usr/bin/env -S npx ts-node
import 'dotenv/config'
import { Command } from 'commander'
import { buildAddCommand } from '../commands/add.js'
import { addCommandHandler } from '../handlers/add.js'
import { getValidUnits } from '../db/helpers.js'

async function createProgram (): Promise<Command> {
  const validUnits = await getValidUnits()
  const addSubcommand = buildAddCommand(addCommandHandler, validUnits)

  return new Command('gropt')
    .description('Grocery price tracker')
    .version('1.0.0')
    .addCommand(addSubcommand)
}

const program = await createProgram()
program.parse()
