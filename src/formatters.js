const getIndent = () => ' '.repeat(4);
const getIndentPlus = () => '  + ';
const getIndentMinus = () => '  - ';

const stylish = (diff) => {
  const spacesCount = 4;
  const iter = (currentValue, depth) => {
    const indentSize = spacesCount * depth;
    const currentIndent = ' '.repeat(indentSize);
    const bracketIndent = ' '.repeat(indentSize - spacesCount);
    // console.log('CURRENT=', currentValue);
    // console.log('DEPTH=', depth);

    const lines = Object.entries(currentValue).map((item) => {
      let rows = '';
      const [name, value, status] = item;
      console.log('STATUS=', status)
      if (status === '=') {
        rows += `${currentIndent}${name}: ${value}`;
      } else if (status === '-') {
        rows += `${getIndentMinus}${name}: ${value}`;
      } else if (status === '+') {
        if (value !== 'json') {
          const [previousValue] = item;
          rows += `${getIndentMinus}${name}: ${previousValue}\n${getIndentPlus}${name}: ${value}`;
        }
        const [children] = item;
        rows += `${getIndentPlus}${name}: ${iter(children, depth + 1)}`;
      }
      // console.log('LINES=', rows);
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
