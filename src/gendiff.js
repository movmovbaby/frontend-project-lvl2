import { readFileSync } from 'fs';
import { resolve, extname } from 'path';
import _ from 'lodash';
import dataToSortedObject from './parsers.js';

const getPath = (filePath) => resolve(process.cwd(), filePath);

const genFlatDiff = (json1, json2) => {
  const keys1 = Object.keys(json1);
  const keys2 = Object.keys(json2);
  let result = '{\n';

  for (let i = 0; i < keys1.length; i += 1) {
    const key = keys1[i];
    if (!Object.hasOwn(json2, key)) {
      result += `  - ${key}: ${json1[key]}\n`;
    } else if (Object.hasOwn(json2, key)) {
      if (json1[key] === json2[key]) {
        result += `    ${key}: ${json1[key]}\n`;
        _.pull(keys2, key);
      } else {
        result += `  - ${key}: ${json1[key]}\n`.concat(`  + ${key}: ${json2[key]}\n`);
        _.pull(keys2, key);
      }
    }
  }

  if (keys2.length !== 0) {
    for (let i = 0; i < keys2.length; i += 1) {
      const key = keys2[i];
      result += `  + ${key}: ${json2[key]}\n`;
    }
  }
  result += '}';

  return result;
};

const genDiff = (filePath1, filePath2) => {
  const extension1 = extname(filePath1);
  const extension2 = extname(filePath2);

  const file1 = readFileSync(getPath(filePath1));
  const file2 = readFileSync(getPath(filePath2));

  const data1 = dataToSortedObject(file1, extension1);
  const data2 = dataToSortedObject(file2, extension2);
  const diff = genFlatDiff(data1, data2);

  return diff;
};

export default genDiff;
