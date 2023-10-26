#! /usr/bin/env node
import 'dotenv/config'
import { Command } from 'commander'
import { createAddSubcommand, addCommandHandler } from '../commands/add.js'
import DbHelpers from '#src/db/helpers.js'

const program = new Command('gropt')
  .description('Grocery price tracker')
  .version('1.0.0')

const validUnits = await DbHelpers.getValidUnits()

const addSubCommand = createAddSubcommand(addCommandHandler, validUnits)

program.addCommand(addSubCommand)

program.parse()
