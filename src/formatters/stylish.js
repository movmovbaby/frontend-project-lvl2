const indentPlus = (depth) => ' '.repeat(depth).concat('  + ');
const indentMinus = (depth) => ' '.repeat(depth).concat('  - ');

const stylish = (diff) => {
  const spacesCount = 4;
  const iter = (currentValue, depth) => {
    const indentSize = spacesCount * depth;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const lines = currentValue.map((item) => {
      const {
        name, value, type, status, children, previousValue, previousValueType,
      } = item;

      switch (status) {
        case 'unchanged':
          return type === 'primitive'
            ? `${currentIndent}${name}: ${value}`
            : `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'deleted':
          return type === 'primitive'
            ? `${indentMinus(indentSize - spacesCount)}${name}: ${value}`
            : `${indentMinus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;

        case 'updated':
          return `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'added':
          if (previousValue === undefined) {
            return type === 'primitive'
              ? `${indentPlus(indentSize - spacesCount)}${name}: ${value}`
              : `${indentPlus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;
          }
          // not undefined
          if (type === 'json' && previousValueType === 'primitive') {
            return `${indentMinus(indentSize - spacesCount)}${name}: ${previousValue}\n${indentPlus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}`;
          }
          if (type === 'primitive' && previousValueType === 'json') {
            return `${indentMinus(indentSize - spacesCount)}${name}: ${iter(children, depth + 1)}\n${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          }
          if (type === 'primitive' && previousValueType === 'primitive') {
            return `${indentMinus(indentSize - spacesCount)}${name}: ${previousValue}\n${indentPlus(indentSize - spacesCount)}${name}: ${value}`;
          }

          break;

        default:
          return '';
      }
      return '';
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
