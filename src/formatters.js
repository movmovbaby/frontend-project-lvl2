const getIndent = () => ' '.repeat(4);
const getIndentPlus = () => '  + ';
const getIndentMinus = () => '  - ';

const stylish = (diff) => {
  const spacesCount = 4;
  const iter = (currentValue, depth) => {
    const indentSize = spacesCount * depth;
    const indent = ' '.repeat(indentSize);
    const indentBracket = ' '.repeat(indentSize - spacesCount);



  }
  return iter(diff, 1);
};

export default stylish;
