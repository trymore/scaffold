import glob_ from 'glob';

/**
 * @param {string} pattern
 * @param {function} callback
 * @return {Promise}
 */
const _globSingle = (pattern, callback) => {
  return new Promise((resolve) => {
    glob_(pattern, (err, files) => {
      if(err) console.log(err);
      if(callback) callback();
      resolve(files);
    });
  });
};

/**
 * @param {string} pattern
 * @param {function} callback
 * @return {Promise}
 */
const _globMultiple = (patterns, callback) => {
  const _patterns = [];
  return (async () => {
    await Promise.all(patterns.map((pattern) => {
      return new Promise((resolve) => {
        glob_(pattern, (err, files) => {
          if(err) console.log(err);
          _patterns.push(...files);
          resolve();
        });
      });
    }));
    if(callback) callback();
    return _patterns;
  })();
};

/**
 * @param {string|Array<string>} pattern
 * @param {function} [callback]
 * @return {Promise}
 */
export const glob = (pattern, callback = null) => {
  if(typeof pattern === 'string') {
    return _globSingle(pattern, callback);
  }
  else if(Array.isArray(pattern)) {
    return _globMultiple(pattern, callback);
  }
  else {
    throw new TypeError();
  }
};
