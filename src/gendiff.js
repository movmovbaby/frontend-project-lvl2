import _ from 'lodash';
import isObjectAndNotArray from './utils.js';

const genDiff = (json1, json2) => {
  const diff = [];
  const keys = (_.union([...Object.keys(json1), ...Object.keys(json2)])).sort();

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    const value1 = json1[key];
    const value2 = json2[key];
    const value1Type = _.isPlainObject(value1) ? 'json' : 'primitive';
    const value2Type = _.isPlainObject(value2) ? 'json' : 'primitive';

    // если ключа нет во втором файле, значит его убрали
    if (!Object.hasOwn(json2, key)) {
      if (value1Type === 'json') {
        const children = genDiff(value1, value1);
        diff.push({
          name: key, value: value1, type: value1Type, status: 'deleted', children,
        });
      } else {
        diff.push({
          name: key, value: value1, type: value1Type, status: 'deleted',
        });
      }
      continue;
    }
    // если ключа нет в первом файле, значит его добавили
    if (!Object.hasOwn(json1, key)) {
      if (value2Type === 'json') {
        const children = genDiff(value2, value2);
        diff.push({
          name: key, value: value2, type: value2Type, status: 'added', children,
        });
      } else {
        diff.push({
          name: key, value: value2, type: value2Type, status: 'added',
        });
      }
      continue;
    }
    // значения по ключу равны
    if (_.isEqual(value1, value2)) {
      if (value1Type === 'primitive') {
        diff.push({
          name: key, value: value1, type: value1Type, status: 'unchanged',
        });
      } else {
        const children = genDiff(value1, value1);
        diff.push({
          name: key, value: value1, type: value1Type, status: 'unchanged', children,
        });
      }
      continue;
    }

    // значения разные, но одновременно не вложенные json
    if ((!isObjectAndNotArray(value1) || !isObjectAndNotArray(value2))
      && !_.isEqual(value1, value2)) {
      if (value1Type === 'primitive' && value2Type === 'primitive') {
        diff.push({
          name: key, value: value2, type: value2Type, status: 'added', previousValue: value1, previousValueType: value1Type,
        });
      }
      if (value2Type === 'json' && value1Type === 'primitive') {
        const children = genDiff(value2, value2);
        diff.push({
          name: key, value: value2, type: value2Type, status: 'added', children, previousValue: value1, previousValueType: value1Type,
        });
      }
      if (value2Type === 'primitive' && value1Type === 'json') {
        const children = genDiff(value1, value1);
        diff.push({
          name: key, value: value2, type: value2Type, status: 'added', previousValue: value1, previousValueType: value1Type, children,
        });
      }
    }

    // значения разные, вложенные json
    if (isObjectAndNotArray(value1) && isObjectAndNotArray(value2)) {
      const children = genDiff(value1, value2);
      let status = 'added';
      if (Object.hasOwn(json1, key) && Object.hasOwn(json2, key)) {
        status = 'updated';
      }
      diff.push({
        name: key, value: 'json', type: 'json', status, children,
      });
    }
  }

  return _.sortBy(diff, ['name']);
};

export default genDiff;
