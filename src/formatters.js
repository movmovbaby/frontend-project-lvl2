import isObjectAndNotArray from './utils.js';

const indentPlus = (depth) => ' '.repeat(depth).concat('  + ');
const indentMinus = (depth) => ' '.repeat(depth).concat('  - ');

const stylish = (diff) => {
  const spacesCount = 4;
  const iter = (currentValue, depth) => {
    const indentSize = spacesCount * depth;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const lines = currentValue.map((item) => {
      let rows = '';
      const { name, value, status } = item;
      if (status === '=') {
        rows += `${currentIndent}${name}: ${value}`;
      } else if (status === '-') {
        rows += `${indentMinus(indentSize - spacesCount)}${name}: ${value}`;
      } else if (status === '+') {
        if (value !== 'json') {
          const { previousValue } = item;
          const isObject = isObjectAndNotArray(value);

          if (previousValue === undefined) {
            rows += `${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          } else {
            rows += `${indentMinus(indentSize - spacesCount)}${name}: ${previousValue}\n${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          }
        } else {
          const { children } = item;
          rows += `${indentPlus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;
        }
      }
      return rows;
    });


    return [
      '{',
      ...lines,
      `${bracketIndent}}`,
    ].join('\n');
  };
  return iter(diff, 1);
};

export default stylish;
