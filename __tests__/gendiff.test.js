import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect, describe } from '@jest/globals';
import generateDiff from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

const json1 = getFixturePath('file1.json');
const json2 = getFixturePath('file2.json');
const yaml1 = getFixturePath('file1.yaml');
const yaml2 = getFixturePath('file2.yaml');
const stylishResult = readFileSync(getFixturePath('stylishResult')).toString();
const plainResult = readFileSync(getFixturePath('plainResult')).toString();
const jsonResult = readFileSync(getFixturePath('jsonResult')).toString();

const cases = [
  [json1, json2, 'stylish', stylishResult],
  [yaml1, yaml2, 'stylish', stylishResult],
  [json1, json2, 'plain', plainResult],
  [yaml1, yaml2, 'plain', plainResult],
  [json1, json2, 'json', jsonResult],
  [yaml1, yaml2, 'json', jsonResult],
];

describe('genDiff with all formatters', () => {
  test.each(cases)(
    'with %s and %s as args and %s as formatters return %s',
    (filename1, filename2, formatter, expectedResult) => {
      const result = generateDiff(filename1, filename2, formatter);
      expect(result).toEqual(expectedResult);
    },
  );
});
