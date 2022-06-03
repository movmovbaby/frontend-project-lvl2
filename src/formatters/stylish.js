const setIndent = (depth, delimeter) => ' '.repeat(depth).concat(`  ${delimeter} `);
const spacesCount = 4

const stringify = (currentValue, depth) => {
  if (typeof currentValue !== 'object' || currentValue === null) {
    return `${currentValue}`;
  }

  const indentSize = depth * spacesCount;
  const currentIndent = ' '.repeat(indentSize);
  const bracketIndent = ' '.repeat(indentSize - spacesCount);

  const lines = Object
    .entries(currentValue)
    .map(([key, val]) => `${currentIndent}${key}: ${stringify(val, depth + 1)}`);

  return [
    '{',
    ...lines,
    `${bracketIndent}}`,
  ].join('\n');
};


const stylish = (diff) => {
  const iter = (currentValue, depth) => {
    const indentSize = depth * spacesCount;
    const currentIndent = ' '.repeat(indentSize);
    const lines = currentValue.map((item) => {
      const { status, name, value, previousValue, children } = item;
      switch (status) {
        case 'deleted':
          return `${setIndent(indentSize - spacesCount, '-')}${name}: ${stringify(value, depth + 1)}`;

        case 'added':
          return `${setIndent(indentSize - spacesCount, '+')}${name}: ${stringify(value, depth + 1)}`;

        case 'unchanged':
          return `${currentIndent}${name}: ${stringify(value, depth + 1)}`;

        case 'updated':
          return `${setIndent(indentSize - spacesCount, '-')}${name}: ${stringify(previousValue, depth + 1)}\n${setIndent(indentSize - spacesCount, '+')}${name}: ${stringify(value, depth + 1)}`;

        case 'nested':
          return `${currentIndent}${name}: {\n${iter(children, depth + 1)}\n${currentIndent}}`;

        default:
          return null;
      }
    });
    return lines.join('\n');
  };
  return `{\n${iter(diff, 1)}\n}`;
};

export default stylish;
