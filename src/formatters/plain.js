import _ from 'lodash';

const addTemplate = (path, value, previousValue) => {
  let ret = '';
  let newValue = value;
  let newPreviousValue = previousValue;

  if (typeof value === 'string' && value !== '[complex value]') {
    newValue = `'${value}'`;
  }
  if (typeof previousValue === 'string' && previousValue !== '[complex value]') {
    newPreviousValue = `'${previousValue}'`;
  }

  if (newPreviousValue === undefined) {
    ret = `Property '${path}' was added with value: ${newValue}`;
  } else {
    ret = `Property '${path}' was updated. From ${newPreviousValue} to ${newValue}`;
  }
  return ret;
};

const removeTemplate = (path) => `Property '${path}' was removed`;

const updatedTemplate = (path, from, to) => `Property '${path}' was updated. From ${from} to ${to}`;

const plain = (diff) => {
  const iter = (currentValue, path) => {
    const lines = currentValue.reduce((acc, item) => {
      let row = '';
      const {
        name, value, status, previousValue, children,
      } = item;

      const from = _.isObject(previousValue) ? '[complex value]' : previousValue;
      const to = _.isObject(value) ? '[complex value]' : value;

      let newPath = '';
      if (path === '') {
        newPath = `${name}`;
      } else {
        newPath = `${path}.${name}`;
      }

      if (children === undefined) {
        switch (status) {
          case 'added':
            row = addTemplate(newPath, value, previousValue);
            acc.push(row);
            break;

          case 'deleted':
            row = removeTemplate(newPath);
            acc.push(row);
            break;

          case 'updated':
            row = updatedTemplate(newPath, previousValue, value);
            acc.push(row);
            break;

          default:
            break;
        }
      } else {
        switch (status) {
          case 'added':
            row = addTemplate(newPath, to, from);
            acc.push(row);
            break;

          case 'deleted':
            row = removeTemplate(newPath);
            acc.push(row);
            break;

          case 'updated':
            acc.push(iter(children, newPath));
            break;

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
