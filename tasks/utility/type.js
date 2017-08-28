/**
 * type
 */

const toString = Object.prototype.toString;

/**
 * @param {*} target
 * @return {string}
 */
export const getType = (target) => {
  const _strs = toString.call(target).match(/^\[object (.+)\]$/);
  if(!_strs) return;
  return _strs[1];
};
