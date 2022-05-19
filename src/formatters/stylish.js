const getIndent = (depth, delimeter) => ' '.repeat(depth).concat(`  ${delimeter} `);

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
            ? `${getIndent(indentSize - spacesCount, '-')}${name}: ${value}`
            : `${getIndent(indentSize - spacesCount, '-')}${name}: ${iter(children, depth + 1)}`;

        case 'updated':
          return `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'added':
          if (previousValue === undefined) {
            return type === 'primitive'
              ? `${getIndent(indentSize - spacesCount, '+')}${name}: ${value}`
              : `${getIndent(indentSize - spacesCount, '+')}${name}: ${iter(children, depth + 1)}`;
          }
          // not undefined
          if (type === 'json' && previousValueType === 'primitive') {
            return `${getIndent(indentSize - spacesCount, '-')}${name}: ${previousValue}\n${getIndent(indentSize - spacesCount, '+')}${name}: ${iter(children, depth + 1)}`;
          }
          if (type === 'primitive' && previousValueType === 'json') {
            return `${getIndent(indentSize - spacesCount, '-')}${name}: ${iter(children, depth + 1)}\n${getIndent(indentSize - spacesCount, '+')}${name}: ${value}`;
          }
          if (type === 'primitive' && previousValueType === 'primitive') {
            return `${getIndent(indentSize - spacesCount, '-')}${name}: ${previousValue}\n${getIndent(indentSize - spacesCount, '+')}${name}: ${value}`;
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
