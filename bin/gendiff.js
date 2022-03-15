#!/usr/bin/env node

import { Command } from 'commander';

const program = new Command();
program
  .name('gendiff')
  .version('output the version number')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.');


program.parse();
