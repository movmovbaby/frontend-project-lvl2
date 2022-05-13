import _ from 'lodash';

const valueToString = (value) => {
  if (typeof value === 'string' && value !== '[complex value]') return `'${value}'`;
  return value;
};

const addTemplate = (path, value, previousValue) => {
  return previousValue === undefined
    ? `Property '${path}' was added with value: ${valueToString(value)}`
    : `Property '${path}' was updated. From ${valueToString(previousValue)} to ${valueToString(value)}`;
};

const removeTemplate = (path) => `Property '${path}' was removed`;

const updatedTemplate = (path, from, to) => `Property '${path}' was updated. From ${from} to ${to}`;

const plain = (diff) => {
  const iter = (currentValue, path) => {
    const lines = currentValue.reduce((acc, item) => {
      const {
        name, value, status, previousValue, children,
      } = item;

      const from = _.isObject(previousValue) ? '[complex value]' : previousValue;
      const to = _.isObject(value) ? '[complex value]' : value;
      const newPath = path === '' ? `${name}` : `${path}.${name}`;

      if (children === undefined) {
        switch (status) {
          case 'added':
            return [...acc, addTemplate(newPath, value, previousValue)];

          case 'deleted':
            return [...acc, removeTemplate(newPath)];

          case 'updated':
            return [...acc, updatedTemplate(newPath, previousValue, value)];

          default:
            break;
        }
      } else {
        switch (status) {
          case 'added':
            return [...acc, addTemplate(newPath, to, from)];

          case 'deleted':
            return [...acc, removeTemplate(newPath)];

          case 'updated':
            return [...acc, iter(children, newPath)];

          default:
            break;
        }
      }
      return acc;
    }, []);

    return _.flattenDeep(lines).join('\n');
  };

  return iter(diff, '');
};

export default plain;
