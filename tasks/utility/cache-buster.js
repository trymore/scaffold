import config from '../../tasks-config';
import { join, dirname, relative, resolve } from 'path';
import FileCache from './file-cache';
import { readFileSync } from './fs';
import { toHash } from './hash';
import { parse, serialize } from './query-string';
import chokidar from 'chokidar';

export default class CacheBuster {

  /**
   * @param {Array<string>} exts
   */
  constructor(exts) {
    this._fileCache   = new FileCache();
    this._fileHashMap = new Map();
    this._exts        = exts;

    const { htdocs } = config.project;
    const _extsStr = exts.reduce((memo, ext, i) => {
      if(i) memo += '|';
      memo += ext;
      return memo;
    }, '');
    this._target = `${ htdocs }/**/*.+(${ _extsStr })`;

    this._init();
    this._watch();
  }

  _init() {
    const { _fileCache, _target } = this;
    chokidar.watch(_target, { persistent: false })
      .on('add', (path) => {
        _fileCache.set(path);
      });
  }

  _watch() {
    const { htdocs } = config.project;
    const { _fileCache, _fileHashMap, _target } = this;
    chokidar.watch(_target, { ignoreInitial: true })
      .on('all', (evt, path) => {
        (async () => {
          if(!evt.match(/^(add|change)$/)) return;
          const _isUpdate = await _fileCache.mightUpdate(path);
          if(!_isUpdate) return;
          _fileHashMap.delete(relative(htdocs, path));
        })();
      });
  }

  /**
   * @param {Buffer} buf
   * @param {string} dest
   * @return {Buffer}
   */
  start(buf, dest) {
    const { _exts } = this;
    const _str = buf.toString();
    return new Buffer(
      _str.replace(
        /(['"])(([^\s'"]+\.([a-zA-Z]+))(\?.+)?)['"]/g,
        (all, q, path, filePath, ext, query) => {
          if(!_exts.includes(ext)) return all;

          const { htdocs } = config.project;
          const _path           = resolve(dirname(dest), filePath);
          const _fromHtdocsPath = relative(htdocs, _path);

          let _hash = '';

          const { _fileHashMap } = this;
          if(_fileHashMap.has(_fromHtdocsPath)) {
            _hash = _fileHashMap.get(_fromHtdocsPath);
          }
          else {
            const _file = readFileSync(_path);
            if(!_file) return all;
            _hash = toHash(new Buffer(_file));
          }

          _fileHashMap.set(_fromHtdocsPath, _hash);
          const _param = { hash: _hash };
          if(query) {
            Object.assign(_param, parse(query.replace('?', '')));
          }
          return `${ q }${ filePath }?${ serialize(_param) }${ q }`;
        }
      )
    );
  }

}
