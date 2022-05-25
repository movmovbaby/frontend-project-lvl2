const setIndent = (depth, delimeter) => ' '.repeat(depth).concat(`  ${delimeter} `);

const stylish = (diff) => {
  const spacesCount = 4;
  const iter = (currentValue, depth) => {
    const indentSize = spacesCount * depth;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);

    const lines = currentValue.map((item) => {
      const {
        name, value, status, children, previousValue, isPreviousValueObject,
      } = item;

      switch (status) {
        case 'unchanged':
          return children === undefined
            ? `${currentIndent}${name}: ${value}`
            : `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'deleted':
          return children === undefined
            ? `${setIndent(indentSize - spacesCount, '-')}${name}: ${value}`
            : `${setIndent(indentSize - spacesCount, '-')}${name}: ${iter(children, depth + 1)}`;

        case 'updated':
          return `${currentIndent}${name}: ${iter(children, depth + 1)}`;

        case 'added':
          if (previousValue === undefined) {
            return children === undefined
              ? `${setIndent(indentSize - spacesCount, '+')}${name}: ${value}`
              : `${setIndent(indentSize - spacesCount, '+')}${name}: ${iter(children, depth + 1)}`;
          }
          // not undefined
          if (children !== undefined && isPreviousValueObject === false) {
            return `${setIndent(indentSize - spacesCount, '-')}${name}: ${previousValue}\n${setIndent(indentSize - spacesCount, '+')}${name}: ${iter(children, depth + 1)}`;
          }
          if (children !== undefined && isPreviousValueObject === true) {
            return `${setIndent(indentSize - spacesCount, '-')}${name}: ${iter(children, depth + 1)}\n${setIndent(indentSize - spacesCount, '+')}${name}: ${value}`;
          }
          if (children === undefined && isPreviousValueObject === false) {
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
