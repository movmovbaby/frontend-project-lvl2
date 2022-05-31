import yaml from 'js-yaml';

const dataToObject = (file, extension) => {
  switch (extension) {
    case 'json':
      return JSON.parse(file);

    case 'yaml':
    case 'yml':
      return yaml.load(file);

    default:
      return null;
  }
};

export default dataToObject;
