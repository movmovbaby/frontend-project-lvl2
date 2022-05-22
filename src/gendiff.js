import _ from 'lodash';
import isObjectAndNotArray from './utils.js';

const genDiff = (json1, json2) => {
  const keys = _.sortBy(_.union([...Object.keys(json1), ...Object.keys(json2)]));

  const diff = keys.map((key) => {
    const value1 = json1[key];
    const value2 = json2[key];
    const isObjectValue1 = _.isPlainObject(value1);
    const isObjectValue2 = _.isPlainObject(value2);

    // если ключа нет во втором файле, значит его убрали
    if (!_.has(json2, key)) {
      return isObjectValue1 === true
        ? {
          name: key, value: value1, status: 'deleted', children: genDiff(value1, value1),
        }
        : {
          name: key, value: value1, status: 'deleted',
        };
    }
    // если ключа нет в первом файле, значит его добавили
    if (!_.has(json1, key)) {
      return isObjectValue2 === true
        ? {
          name: key, value: value2, status: 'added', children: genDiff(value2, value2),
        }
        : {
          name: key, value: value2, status: 'added',
        };
    }
    // значения по ключу равны
    if (_.isEqual(value1, value2)) {
      return isObjectValue1 === false
        ? {
          name: key, value: value1, status: 'unchanged',
        }
        : {
          name: key, value: value1, status: 'unchanged', children: genDiff(value1, value1),
        };
    }
    // значения разные, но одновременно не вложенные объекты
    if ((!isObjectAndNotArray(value1) || !isObjectAndNotArray(value2))
      && !_.isEqual(value1, value2)) {
      if (isObjectValue1 === false && isObjectValue2 === false) {
        return {
          name: key, value: value2, status: 'added', previousValue: value1, isPreviousValueObject: isObjectValue1,
        };
      }
      if (isObjectValue2 === true && isObjectValue1 === false) {
        return {
          name: key, value: value2, status: 'added', children: genDiff(value2, value2), previousValue: value1, isPreviousValueObject: isObjectValue1,
        };
      }
      if (isObjectValue2 === false && isObjectValue1 === true) {
        return {
          name: key, value: value2, status: 'added', previousValue: value1, isPreviousValueObject: isObjectValue1, children: genDiff(value1, value1),
        };
      }
    }
    // значения разные, вложенные объекты
    if (isObjectAndNotArray(value1) && isObjectAndNotArray(value2)) {
      return (_.has(json1, key) && _.has(json2, key))
        ? {
          name: key, value: 'json', status: 'updated', children: genDiff(value1, value2),
        }
        : {
          name: key, value: 'json', status: 'added', children: genDiff(value1, value2),
        };
    }
    return {};
  });

  return diff;
};

export default genDiff;
