import stylish from './stylish.js';
import plain from './plain.js';

const formatter = (diff, format) => {
  let ret;
  switch (format) {
    case 'stylish':
      ret = stylish(diff);
      break;

    case 'plain':
      ret = plain(diff);
      break;

    default:
      ret = stylish(diff);
      break;
  }
  return ret;
};

export default formatter;
