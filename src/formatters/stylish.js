const setIndent = (depth, delimeter) => ' '.repeat(depth).concat(`  ${delimeter} `);

const stylish = (diff) => {
  const spacesCount = 4;
  const iter = (currentValue, depth) => {
    const indentSize = spacesCount * depth;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const lines = currentValue.map((item) => {
      const {
        name, value, isObject, status, children, previousValue, previousValueType,
      } = item;

      switch (status) {
        case 'unchanged':
          return isObject === false
            ? `${currentIndent}${name}: ${value}`
            : `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'deleted':
          return isObject === false
            ? `${setIndent(indentSize - spacesCount, '-')}${name}: ${value}`
            : `${setIndent(indentSize - spacesCount, '-')}${name}: ${iter(children, depth + 1)}`;

        case 'updated':
          return `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'added':
          if (previousValue === undefined) {
            return isObject === false
              ? `${setIndent(indentSize - spacesCount, '+')}${name}: ${value}`
              : `${setIndent(indentSize - spacesCount, '+')}${name}: ${iter(children, depth + 1)}`;
          }
          // not undefined
          if (isObject === true && previousValueType === false) {
            return `${setIndent(indentSize - spacesCount, '-')}${name}: ${previousValue}\n${setIndent(indentSize - spacesCount, '+')}${name}: ${iter(children, depth + 1)}`;
          }
          if (isObject === false && previousValueType === true) {
            return `${setIndent(indentSize - spacesCount, '-')}${name}: ${iter(children, depth + 1)}\n${setIndent(indentSize - spacesCount, '+')}${name}: ${value}`;
          }
          if (isObject === false && previousValueType === false) {
            return `${setIndent(indentSize - spacesCount, '-')}${name}: ${previousValue}\n${setIndent(indentSize - spacesCount, '+')}${name}: ${value}`;
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
