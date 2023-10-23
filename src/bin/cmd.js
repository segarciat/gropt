#! /usr/bin/env node

import { Command } from 'commander'

const program = new Command('gropt')
  .description('Grocery price tracker')
  .version('1.0.0')

program.parse()
