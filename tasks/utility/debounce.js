/**
 * debounce
 */

/**
 * @param {number} [interval] - [integer]
 * @return {Function(fn:function)}
 */
export const createDebounce = (interval = 500) => {
  let _timer = 0;

  return (fn) => {
    clearTimeout(_timer);
    _timer = setTimeout(() => {
      fn();
      _timer = null;
    }, interval);
  };
};
