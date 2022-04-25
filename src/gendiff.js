import { readFileSync } from 'fs';
import { resolve, extname } from 'path';
import _ from 'lodash';
import dataToSortedObject from './parsers.js';
import isObjectAndNotArray from './utils.js';

const getPath = (filePath) => resolve(process.cwd(), filePath);

/*
  формат диффа
  {name, value, status, previousValue, children}
*/

const genDiffImpl = (json1, json2) => {
  const diff = [];
  const keys1 = Object.keys(json1);
  const keys2 = Object.keys(json2);

  for (const key of keys1) {
    if (!Object.hasOwn(json2, key)) {
      // если ключа нет во втором файле, значит его убрали
      diff.push({ name: key, value: json1[key], status: '-' });
      _.pull(keys2, key);
    } else {
      if (Object.hasOwn(json2, key)) {
        // если ключ есть во втором файле
        if (json1[key] === json2[key]) {
          // значения по ключу равны
          diff.push({ name: key, value: json1[key], status: '=' });
          _.pull(keys2, key);
        } else {
          // значения разные, но одновременно не вложенные json
          if (!isObjectAndNotArray(json1[key]) || !isObjectAndNotArray(json2[key])) {
            diff.push({ name: key, value: json2[key], status: '+', previousValue: json1[key] });
            _.pull(keys2, key);
          } else {
            // значения разные, вложенные json
            if (isObjectAndNotArray(json1[key]) || isObjectAndNotArray(json2[key])) {
              const children = genDiffImpl(json1[key], json2[key]);
              diff.push({ name: key, value: 'json', status: '+', children: children });
              _.pull(keys2, key);
            }
          }
        }
      }
    }
  }
  // здесь остались ключи, появившиеся во втором файле
  if (keys2.length !== 0) {
    for (const key of keys2) {
      diff.push({ name: key, value: json2[key], status: '+' })
    }
  }
  return _.sortBy(diff, ['name']);
};

const genDiff = (filePath1, filePath2) => {
  const extension1 = extname(filePath1);
  const extension2 = extname(filePath2);

  const file1 = readFileSync(getPath(filePath1));
  const file2 = readFileSync(getPath(filePath2));

  const data1 = dataToSortedObject(file1, extension1);
  const data2 = dataToSortedObject(file2, extension2);
  const diff = genDiffImpl(data1, data2);

  return diff;
};

export default genDiff;
