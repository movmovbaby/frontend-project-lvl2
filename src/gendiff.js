import _ from 'lodash';
import isObjectAndNotArray from './utils.js';

const genDiff = (json1, json2) => {
  const keys = _.sortBy(_.union([...Object.keys(json1), ...Object.keys(json2)]));

  const diff = keys.map((key) => {
    const value1 = json1[key];
    const value2 = json2[key];
    const isValue1Object = _.isPlainObject(value1);
    const isValue2Object = _.isPlainObject(value2);

    // если ключа нет во втором файле, значит его убрали
    if (!_.has(json2, key)) {
      return isValue1Object === true
        ? {
          name: key, value: value1, isObject: isValue1Object, status: 'deleted', children: genDiff(value1, value1),
        }
        : {
          name: key, value: value1, isObject: isValue1Object, status: 'deleted',
        };
    }
    // если ключа нет в первом файле, значит его добавили
    if (!_.has(json1, key)) {
      return isValue2Object === true
        ? {
          name: key, value: value2, isObject: isValue2Object, status: 'added', children: genDiff(value2, value2),
        }
        : {
          name: key, value: value2, isObject: isValue2Object, status: 'added',
        };
    }
    // значения по ключу равны
    if (_.isEqual(value1, value2)) {
      return isValue1Object === false
        ? {
          name: key, value: value1, isObject: isValue1Object, status: 'unchanged',
        }
        : {
          name: key, value: value1, isObject: isValue1Object, status: 'unchanged', children: genDiff(value1, value1),
        };
    }
    // значения разные, но одновременно не вложенные json
    if ((!isObjectAndNotArray(value1) || !isObjectAndNotArray(value2))
      && !_.isEqual(value1, value2)) {
      if (isValue1Object === false && isValue2Object === false) {
        return {
          name: key, value: value2, isObject: isValue2Object, status: 'added', previousValue: value1, previousValueType: isValue1Object,
        };
      }
      if (isValue2Object === true && isValue1Object === false) {
        return {
          name: key, value: value2, isObject: isValue2Object, status: 'added', children: genDiff(value2, value2), previousValue: value1, previousValueType: isValue1Object,
        };
      }
      if (isValue2Object === false && isValue1Object === true) {
        return {
          name: key, value: value2, isObject: isValue2Object, status: 'added', previousValue: value1, previousValueType: isValue1Object, children: genDiff(value1, value1),
        };
      }
    }
    // значения разные, вложенные json
    if (isObjectAndNotArray(value1) && isObjectAndNotArray(value2)) {
      return (_.has(json1, key) && _.has(json2, key))
        ? {
          name: key, value: 'json', isObject: true, status: 'updated', children: genDiff(value1, value2),
        }
        : {
          name: key, value: 'json', isObject: true, status: 'added', children: genDiff(value1, value2),
        };
    }
    return {};
  });

  return diff;
};

export default genDiff;
