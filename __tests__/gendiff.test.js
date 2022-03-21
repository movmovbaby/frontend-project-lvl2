import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { test, expect } from '@jest/globals';
import genDiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const getFixturePath = (filename) => join(__dirname, '..', '__fixtures__', filename);

test('test', () => {
  const filename1 = getFixturePath('file1.json');
  const filename2 = getFixturePath('file2.json');
  const filename3 = getFixturePath('file3.json');
  const filename4 = getFixturePath('file4.json');

  const answer1 = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;
  const answer2 = `{
    follow: false
  - host: hexlet.io
  + host: room.io
    proxy: 123.234.53.22
  - timeout: 50
  + timeout: 500
  + lang: en
  + title: string
}`;
  const answer3 = `{
  - follow: false
  - host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + font: Tahoma Serif
  + lang: en
  + menu: hidden
  + meta: off
  + outline: false
  + title: string
}`;

  expect(genDiff(filename1, filename2)).toEqual(answer1);
  expect(genDiff(filename1, filename3)).toEqual(answer2);
  expect(genDiff(filename1, filename4)).toEqual(answer3);
});
