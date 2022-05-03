import _ from 'lodash';

const isObjectAndNotArray = (item) => _.isObject(item) && !_.isArray(item);

export default isObjectAndNotArray;
