import { dirname, relative, resolve } from 'path';
import { readFileSync } from './fs';
import { toHash } from './hash';
import { parse, serialize } from './query-string';

/**
 * @param {Buffer} buf
 * @param {string} path
 * @return {string}
 */
export const toRelativePath = (buf, path) => {
  const _str = buf.toString();
  return new Buffer(_str.replace(/(['"])(\/[^\s'"]*)['"]/g, (all, q, p) => {
    return q + relative(path, p) + q;
  }));
};

/**
 * @param {Buffer} buf
 * @param {string} dest
 * @param {Array<string>} exts
 * @return {Buffer}
 */
export const cacheBuster = (buf, dest, exts) => {
  const _str = buf.toString();
  return new Buffer(
    _str.replace(
      /(['"])(([^\s'"]+\.([a-zA-Z]+))(\?.+)?)['"]/g,
      (all, q, path, filePath, ext, query) => {
        if(!exts.includes(ext)) return all;
        const _path = resolve(dirname(dest), filePath);
        const _file = readFileSync(_path);
        if(!_file) return all;
        const _param = { hash: toHash(new Buffer(_file)) };
        if(query) {
          Object.assign(_param, parse(query.replace('?', '')));
        }
        return `${ q }${ filePath }?${ serialize(_param) }${ q }`;
      }
    )
  );
};
