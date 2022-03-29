import _ from 'lodash';
import yaml from 'js-yaml';


const dataToSortedObject = (file, extension) => {
  let data;

  if (extension === '.json') {
    data = JSON.parse(file);
  }
  if (extension === '.yaml' || extension === '.yml') {
    data = yaml.load(file);
  }

  const sortedData = _.sortBy(Object.keys(data)).reduce((obj, key) => {
    const temp = obj;
    temp[key] = data[key];
    return temp;
  }, {});

  return sortedData;
};


export default dataToSortedObject;
