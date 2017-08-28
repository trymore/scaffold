import { dirname } from 'path';
import { accessSync, readFileSync, writeFile } from 'fs';
import mkdirp from 'mkdirp';
import { getType } from './type';

/**
 * @param {string} path
 * @return {boolean}
 */
export const hasFile = (path) => {
  try {
    accessSync(path);
    return true;
  }
  catch(err) {
    return false;
  }
};

/**
 * @param {string} path
 * @param {Buffer|string} data
 * @return {boolean}
 */
export const sameFile = (path, data) => {
  try {
    const _buf1 = readFileSync(path);
    const _buf2 = getType(data) === 'String' ? new Buffer(data) : data;
    return Buffer.compare(_buf1, _buf2) === 0;
  }
  catch(err) {
    return false;
  }
};

/**
 * @param {string} path
 * @param {string} data
 * @param {Object|string} [opts]
 * @return {Promise}
 */
export const mkfile = (path, data, opts = {}) => {
  return new Promise((resolve) => {
    mkdirp(dirname(path), () => {
      writeFile(path, data, opts, resolve);
    });
  });
};
