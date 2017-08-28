import config from '../tasks-config';
import { join, relative, dirname, extname } from 'path';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { readFile } from './utility/fs';
import { glob } from './utility/glob';
import chokidar from 'chokidar';
import deepAssign from 'deep-assign';

export default class UrlList {

  constructor() {
    this._taskLog = new TaskLog('url-list');
  }

  /**
   * @return {Promsie}
   */
  start() {
    return (async () => {
      await this._build();
      new TaskLog(`watch url-list`).start();
      const { argv } = NS;
      if(!argv['production']) {
        this._watch();
      }
    })();
  }

  _watch() {
    const { htdocs } = config.project;
    chokidar.watch(join(htdocs, '**/*.+(html|php)'), { ignoreInitial: true })
      .on('all', (evt, path) => {
        if(!evt.match(/^(add|unlink)$/)) return;
        fileLog(evt, path);
        this._build();
      });
  }

  /**
   * @return {Promise}
   */
  _build() {
    const { project: { htdocs }, urlList: { tmp, dest } } = config;
    const { _taskLog } = this;

    return (async () => {
      _taskLog.start();

      const _paths = await glob(join(htdocs, '**/*.+(html|shtml|php)'));
      const _urlHash = {};
      for(const path of _paths) {
        const _url = path.replace('htdocs/', '');
        const _obj = this._getUrlHash(_url);
        deepAssign(_urlHash, _obj);
      }

      const _buf = await readFile(tmp, (err) => errorLog('url-list', err));
      if(!_buf) return;

      const _html = _buf.toString().replace('{{data}}', JSON.stringify(_urlHash));
      if(!sameFile(dest, _html)) {
        await mkfile(dest, _html);
        fileLog('create', dest);
      }

      _taskLog.finish();
    })();
  }

  /**
   * @param {string} url
   */
  _getUrlHash(url) {
    const _strs = url.split('/');
    let _obj    = {};
    let _isFile = true;
    const _set = () => {
      const _last = _strs.pop();
      if(_isFile) {
        _obj    = { [_last]: url };
        _isFile = false;
      } else {
        _obj = { [_last]: _obj }
      }
      if(_strs.length) _set();
    };
    _set();
    return _obj;
  }

}
