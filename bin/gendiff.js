#!/usr/bin/env node

import { Command } from 'commander';
import genDiff from '../src/gendiff.js';
import stylish from '../src/formatters.js';

const program = new Command();
program
  .name('gendiff')
  .version('output the version number')
  .option('-f, --format <type>', 'output format')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .action((filepath1, filepath2) => {
    const diff = genDiff(filepath1, filepath2);
    const pretty = stylish(diff);
    console.log(pretty);
  });

program.parse();
