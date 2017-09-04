/**
 * @param {string} str
 * @param {Object} [opts]
 * @param {string} [opts.sep]
 * @param {string} [opts.eq]
 * @param {boolean} [opts.typeChange]
 * @return {Object}
 */
export const parse = (str, opts = {}) => {
  const { sep, eq, typeChange } = Object.assign({ sep: '&', eq: '=', typeChange: true });
  if(!str || typeof str !== 'string') {
    return {};
  }
  return String(str).split(sep).reduce((memo, param) => {
    const [key, val] = param.split(eq);
    const _val = (() => {
      if(!typeChange) return val;
      if(val.match(/^[+,-]?([1-9]\d*|0)(\.\d+)?$/)) {
        return Number(val);
      }
      switch(val) {
        case 'true' : return true;
        case 'false': return false;
        default     : return val;
      }
    })();
    memo[key] = _val;
    return memo;
  }, {});
};

/**
 * @param {Object} data
 * @param {Object} [opts]
 * @param {string} [opts.sep]
 * @param {string} [opts.eq]
 * @return {string}
 */
export const serialize = (data, opts = {}) => {
  const { sep, eq } = Object.assign({ sep: '&', eq: '=' });
  const _encode = encodeURIComponent;
  let _query = '';

  Object.entries(data).forEach(([key, val]) => {
    const _type  = (typeof(val) === 'object') && (val instanceof Array)
      ? 'array'
      : typeof(val);

    switch (_type) {
      case 'undefined':
        _query += key;
        break;
      case 'array':
        val.forEach((_i) => {
          _query += `${ key }[]${ eq + _encode(val[_i]) + sep }`;
        });
        _query = _query.substr(0, _query.length - 1);
        break;
      case 'object':
        Object.entries(val).forEach(([key_, val_]) => {
          _query += `${ key }[${ key_ }]${ eq + _encode(val_) + sep }`;
        });
        _query = _query.substr(0, _query.length - 1);
        break;
      default:
        _query += key + eq + _encode(val);
        break;
    }
    _query += sep;
  });
  return _query.substr(0, _query.length - 1);
};
