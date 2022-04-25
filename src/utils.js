import _ from 'lodash';

const isObjectAndNotArray = (item) => {
  return _.isObject(item) && !_.isArray(item);
};

export default isObjectAndNotArray;
