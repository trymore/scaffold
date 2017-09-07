import fs from 'fs';
import { getType } from './type';
import { isFile } from './file';

/**
 * @param {string} path
 * @param {string|function} [...args]
 * @return {<?(buffer|string)>}
 */
export const readFileSync = (path, ...args) => {
  let _encoding = 'utf8';
  let _errFn    = null;

  for(const arg of args) {
    switch(getType(arg)) {
      case 'String':
        _encoding = arg;
        break;
      case 'Function':
        _errFn = arg;
        break;
    }
  }

  if(!isFile(path)) {
    if(_errFn) _errFn(path);
    return null;
  }
  try {
    return fs.readFileSync(path, _encoding);
  }
  catch(err) {
    throw new Error(err);
  }
};
