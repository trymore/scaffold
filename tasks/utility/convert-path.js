import { relative } from 'path';
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
 * @param {Array<string>} exts
 * @return {string}
 */
export const cacheBuster = (buf, exts) => {
  const _str = buf.toString();
  return new Buffer(
    _str.replace(
      /(['"])(([^\s'"]+\.([^.?#]+))(\?.+)?)['"]/g,
      (all, q, path, filePath, ext, query) => {
        if(!exts.includes(ext)) return all;
        const _param = { timestamp: new Date().getTime() };
        if(query) {
          Object.assign(_param, parse(query.replace('?', '')));
        }
        return `${ q }${ filePath }?${ serialize(_param) }${ q }`;
      }
    )
  );
};
