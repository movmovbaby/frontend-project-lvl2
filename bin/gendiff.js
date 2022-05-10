#!/usr/bin/env node

import { Command } from 'commander';
import generateDiff from '../src/index.js';

const program = new Command();
program
  .name('gendiff')
  .version('output the version number')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .description('Compares two configuration files and shows a difference.')
  .action((filepath1, filepath2) => {
    const { format } = program.opts();
    const diff = generateDiff(filepath1, filepath2, format);

    console.log(diff);
    //  return pretty;
  });

program.parse();
