import _ from 'lodash';
import isObjectAndNotArray from './utils.js';

const genDiff = (json1, json2) => {
  const keys = (_.union([...Object.keys(json1), ...Object.keys(json2)])).sort();

  const diff = keys.map((key) => {
    const value1 = json1[key];
    const value2 = json2[key];
    const value1Type = _.isPlainObject(value1) ? 'json' : 'primitive';
    const value2Type = _.isPlainObject(value2) ? 'json' : 'primitive';

    // если ключа нет во втором файле, значит его убрали
    if (!_.has(json2, key)) {
      return value1Type === 'json'
        ? {
          name: key, value: value1, type: value1Type, status: 'deleted', children: genDiff(value1, value1),
        }
        : {
          name: key, value: value1, type: value1Type, status: 'deleted',
        };
    }
    // если ключа нет в первом файле, значит его добавили
    if (!_.has(json1, key)) {
      return value2Type === 'json'
        ? {
          name: key, value: value2, type: value2Type, status: 'added', children: genDiff(value2, value2),
        }
        : {
          name: key, value: value2, type: value2Type, status: 'added',
        };
    }
    // значения по ключу равны
    if (_.isEqual(value1, value2)) {
      return value1Type === 'primitive'
        ? {
          name: key, value: value1, type: value1Type, status: 'unchanged',
        }
        : {
          name: key, value: value1, type: value1Type, status: 'unchanged', children: genDiff(value1, value1),
        };
    }
    // значения разные, но одновременно не вложенные json
    if ((!isObjectAndNotArray(value1) || !isObjectAndNotArray(value2))
      && !_.isEqual(value1, value2)) {
      if (value1Type === 'primitive' && value2Type === 'primitive') {
        return {
          name: key, value: value2, type: value2Type, status: 'added', previousValue: value1, previousValueType: value1Type,
        };
      }
      if (value2Type === 'json' && value1Type === 'primitive') {
        return {
          name: key, value: value2, type: value2Type, status: 'added', children: genDiff(value2, value2), previousValue: value1, previousValueType: value1Type,
        };
      }
      if (value2Type === 'primitive' && value1Type === 'json') {
        return {
          name: key, value: value2, type: value2Type, status: 'added', previousValue: value1, previousValueType: value1Type, children: genDiff(value1, value1),
        };
      }
    }
    // значения разные, вложенные json
    if (isObjectAndNotArray(value1) && isObjectAndNotArray(value2)) {
      let status = 'added';
      if (_.has(json1, key) && _.has(json2, key)) {
        status = 'updated';
      }
      return {
        name: key, value: 'json', type: 'json', status, children: genDiff(value1, value2),
      };
    }
    return {};
  });

  return diff;
};

export default genDiff;
