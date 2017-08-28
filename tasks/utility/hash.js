import { createHash, update, digest } from 'crypto';

/**
 * @param {Buffer} buf
 * @return {string}
 */
export const toHash = (buf) => {
  return createHash('md5').update(buf.toString('utf8')).digest('hex');
};
