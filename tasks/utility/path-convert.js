import { relative } from 'path';

/**
 * @param {Buffer} buf
 * @param {string} path
 * @return {string}
 */
export const toRelativePath = (buf, path) => {
  const _str = buf.toString();
  return Buffer.from(_str.replace(/(['"])(\/[^\s'"]*)['"]/g, (all, q, p) => {
    return q + relative(path, p) + q;
  }));
};
