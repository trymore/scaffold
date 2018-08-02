import { dirname } from 'path';
import { existsSync, statSync, readFileSync, writeFile, rename } from 'fs';
import mkdirp from 'mkdirp';
import { getType } from './type';

/**
 * @param {string} path
 * @return {boolean}
 */
export const isFile = (path) => {
  return existsSync(path) && statSync(path).isFile();
};

/**
 * @param {string} path
 * @param {Buffer} buf
 * @return {boolean}
 */
export const sameFile = (path, buf, isBinary = false) => {
  if(!isFile(path)) return false;
  const _buf = isBinary ?
    new Buffer(readFileSync(path, 'base64'), 'base64') : readFileSync(path);
  return Buffer.compare(buf, _buf) === 0;
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

export const mvfile = (oldPath, newPath) => {
  return new Promise((resolve) => {
    mkdirp(dirname(newPath), () => {
      rename(oldPath, newPath, resolve);
    });
  });
};
