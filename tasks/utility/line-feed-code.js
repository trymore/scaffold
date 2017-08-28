/**
 * @param {Buffer} buf
 * @param {string} encode - ['CR+LF'|'LF'|'CR']
 * @return {string}
 */
export const encodeLineFeedCode = (buf, encode) => {
  const _str = buf.toString();
  return new Buffer(({
    'CR+LF': () => _str.replace(/(\r|\n)/g, '\r\n'),
    'LF'   : () => _str.replace(/(\r\n|\r)/g, '\n'),
    'CR'   : () => _str.replace(/(\r\n|\n)/g, '\r'),
  })[encode]());
};
