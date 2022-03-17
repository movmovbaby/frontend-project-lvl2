import { readFileSync } from 'fs';
import { resolve } from 'path';
import _ from 'lodash';

const getPath = (filePath) => {
  return resolve(process.cwd(), filePath);
}

const prepareData = (file) => {
  const data = JSON.parse(file);

  const sortedData = _.sortBy(Object.keys(data)).reduce(
    (obj, key) => {
      obj[key] = data[key];
      return obj;
    }, {});

  return sortedData;
};

const genFlatJsonDiff = (json1, json2) => {
  const keys1 = Object.keys(json1);
  const keys2 = Object.keys(json2);
  let result = '{\n';

  for (const key of keys1) {
    if (!Object.hasOwn(json2, key)) {
      result += `  - ${key}: ${json1[key]}\n`;
    } else if (Object.hasOwn(json2, key)) {
      if (json1[key] === json2[key]) {
        result += `    ${key}: ${json1[key]}\n`;
        keys2.shift();
      } else {
        result += `  - ${key}: ${json1[key]}\n`.concat(`  + ${key}: ${json2[key]}\n`);
        keys2.shift();
      }
    }
  }
  if (keys2.length !== 0) {
    for (const key of keys2) {
      result += `  + ${key}: ${json2[key]}\n`;
    }
  }
  result += '}';
  return result;
};

export const genDiff = (filePath1, filePath2) => {
  const file1 = readFileSync(getPath(filePath1));
  const file2 = readFileSync(getPath(filePath2));

  const json1 = prepareData(file1);
  const json2 = prepareData(file2);
  const diff = genFlatJsonDiff(json1, json2);

  return diff;
};
