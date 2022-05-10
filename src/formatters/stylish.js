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
      const {
        name, value, type, status,
      } = item;

      if (status === 'unchanged') {
        if (type === 'primitive') {
          rows += `${currentIndent}${name}: ${value}`;
        } else {
          const { children } = item;
          rows += `${currentIndent}${name}: ${iter(children, depth + 1)}`;
        }
      }

      if (status === 'deleted') {
        if (type === 'primitive') {
          rows += `${indentMinus(indentSize - spacesCount)}${name}: ${value}`;
        } else {
          const { children } = item;
          rows += `${indentMinus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;
        }
      }

      if (status === 'updated') {
        const { children } = item;
        rows += `${currentIndent}${name}: ${iter(children, depth + 1)}`;
      }

      if (status === 'added') {
        const { previousValue } = item;
        if (previousValue === undefined) {
          if (type === 'primitive') {
            rows += `${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          } else {
            const { children } = item;
            rows += `${indentPlus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;
          }
        } else { // not undefined
          const { previousValueType } = item;
          if (type === 'json' && previousValueType === 'primitive') {
            const { children } = item;
            rows += `${indentMinus(indentSize - spacesCount)}${name}: ${previousValue}\n${indentPlus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;
          }
          if (type === 'primitive' && previousValueType === 'json') {
            const { children } = item;
            rows += `${indentMinus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}\n${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          }
          if (type === 'primitive' && previousValueType === 'primitive') {
            rows += `${indentMinus(indentSize - spacesCount)}${name}: ${previousValue}\n${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          }
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
