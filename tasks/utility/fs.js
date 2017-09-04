import fs from 'fs';
import { getType } from './type';
import { isFile } from './file';

/**
 * @param {string} path
 * @param {string|function} [...args]
 * @return {Promise<?buffer>}
 */
export const readFile = (path, ...args) => {
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

  return new Promise((resolve, reject) => {
    if(!isFile(path)) {
      return resolve(null);
    }
    fs.readFile(path, _encoding, (err, data) => {
      if(err) return reject(err, path);
      resolve(data);
    });
  })
    .catch((err, path) => {
      if(_errFn) _errFn(err, path);
    });
};
