import { access, readFileSync, constants } from 'fs';
import { toHash } from './hash';

export default class FileCache {

  constructor() {
    this._cacheMap = new Map();
  }

  /**
   * @param {string} path
   */
  set(path) {
    const { _cacheMap } = this;
    const _buf  = readFileSync(path);
    const _hash = toHash(_buf);
    _cacheMap.set(path, _hash);
  }

  /**
   * @param {string} path
   * @return {Promise}
   */
  mightUpdate(path) {
    const { _cacheMap } = this;
    return new Promise((resolve) => {
      const { R_OK } = constants;
      access(path, R_OK, (err) => {
        if(err) {
          _cacheMap.delete(path);
          resolve(true);
        }
        const _buf       = readFileSync(path);
        const _hash      = toHash(_buf);
        const _hashCache = _cacheMap.get(path);
        if(_hashCache === _hash) {
          resolve(false);
        } else {
          _cacheMap.set(path, _hash);
          resolve(true);
        }
      });
    });
  }

}
