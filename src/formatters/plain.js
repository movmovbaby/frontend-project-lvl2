import _ from 'lodash';

const valueToString = (value) => {
  if (typeof value === 'string' && value !== '[complex value]') return `'${value}'`;
  return value;
};

const addTemplate = (path, value, previousValue) => {
  if (previousValue === undefined) {
    return `Property '${path}' was added with value: ${valueToString(value)}`;
  }
  return `Property '${path}' was updated. From ${valueToString(previousValue)} to ${valueToString(value)}`;
};

const removeTemplate = (path) => `Property '${path}' was removed`;

const updatedTemplate = (path, from, to) => `Property '${path}' was updated. From ${valueToString(from)} to ${valueToString(to)}`;

const plain = (diff) => {
  const iter = (currentValue, path) => {
    const lines = currentValue.reduce((acc, item) => {
      const {
        name, value, status, previousValue, children,
      } = item;

      const from = _.isObject(previousValue) ? '[complex value]' : previousValue;
      const to = _.isObject(value) ? '[complex value]' : value;
      const newPath = path === '' ? `${name}` : `${path}.${name}`;

      switch (status) {
        case 'added':
          return [...acc, addTemplate(newPath, to, from)];

        case 'deleted':
          return [...acc, removeTemplate(newPath)];

        case 'updated':
          return [...acc, updatedTemplate(newPath, from, to)];

        case 'nested':
          return children === undefined
            ? [...acc, updatedTemplate(newPath, previousValue, value)]
            : [...acc, iter(children, newPath)];

        default:
          break;
      }
      return acc;
    }, []);

    return _.flattenDeep(lines).join('\n');
  };

  return iter(diff, '');
};

export default plain;
