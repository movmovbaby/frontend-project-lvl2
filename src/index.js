import { readFileSync } from 'fs';
import { resolve, extname } from 'path';
import dataToObject from './parsers.js';
import genDiff from './gendiff.js';
import formatter from './formatters/index.js';

const getPath = (filePath) => resolve(process.cwd(), filePath);

const generateDiff = (filePath1, filePath2, format) => {
  const extension1 = extname(filePath1).slice(1);
  const extension2 = extname(filePath2).slice(1);

  const file1 = readFileSync(getPath(filePath1));
  const file2 = readFileSync(getPath(filePath2));

  const data1 = dataToObject(file1, extension1);
  const data2 = dataToObject(file2, extension2);
  const diff = genDiff(data1, data2);
  // console.log(diff);
  const formattedDiff = formatter(diff, format);
  // console.log(formattedDiff);
  return formattedDiff;
};

export default generateDiff;
