import yaml from 'js-yaml';

const dataToSortedObject = (file, extension) => {
  switch (extension) {
    case '.json':
      return JSON.parse(file);

    case '.yaml':
    case '.yml':
      return yaml.load(file);

    default:
      return undefined;
  }
};

export default dataToSortedObject;
