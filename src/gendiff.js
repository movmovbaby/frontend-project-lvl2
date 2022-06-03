import _ from 'lodash';

const genDiff = (json1, json2) => {
  const keys = _.sortBy(_.union([...Object.keys(json1), ...Object.keys(json2)]));

  const diff = keys.map((key) => {
    const value1 = json1[key];
    const value2 = json2[key];

    // если ключа нет во втором файле, значит его убрали
    if (!_.has(json2, key)) {
      return { name: key, value: value1, status: 'deleted', };
    }
    // если ключа нет в первом файле, значит его добавили
    if (!_.has(json1, key)) {
      return { name: key, value: value2, status: 'added', };
    }
    // значения по ключу равны
    if (value1 === value2) {
      return { name: key, value: value1, status: 'unchanged', };
    }
    // значения разные, вложенные объекты
    if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
      return { name: key, value: 'object', status: 'nested', children: genDiff(value1, value2), };
    }
    // значения разные, но одновременно не вложенные объекты
    if (!_.isEqual(value1, value2)) {
      return { name: key, value: value2, status: 'updated', previousValue: value1, };
    }

  });

  return diff;
};

export default genDiff;
