import { readFileSync } from 'fs';
import { resolve, extname } from 'path';
import dataToSortedObject from './parsers.js';
import genDiff from './gendiff.js';
import formatter from './formatters/index.js';

const getPath = (filePath) => resolve(process.cwd(), filePath);

const generateDiff = (filePath1, filePath2, format) => {
  const extension1 = extname(filePath1);
  const extension2 = extname(filePath2);

  const file1 = readFileSync(getPath(filePath1));
  const file2 = readFileSync(getPath(filePath2));

  const data1 = dataToSortedObject(file1, extension1);
  const data2 = dataToSortedObject(file2, extension2);
  const diff = genDiff(data1, data2);
  const formattedDiff = formatter(diff, format);

  return formattedDiff;
};

export default generateDiff;
