import config from '../tasks-config';
import { relative } from 'path';
import FileCache from './utility/file-cache';
import TaskLog from './utility/task-log';
import { glob } from './utility/glob';
import { fileLog } from './utility/file-log';
import chokidar from 'chokidar';

export default class Base {

  /**
   * @param {string} type
   */
  constructor(type) {
    this._type      = type;
    this._taskLog   = new TaskLog(type);
    this._fileCache = new FileCache();
  }

  /**
   * @return {Promise}
   */
  start() {
    return (async () => {
      const { argv } = NS;
      if(argv['build']) {
        const { _taskLog } = this;
        _taskLog.start();
        await this._buildAll();
        _taskLog.finish();
      }
      const { _type } = this;
      if(!argv['production']) {
        new TaskLog(`watch ${ _type }`).start();
        this._watch();
      }
    })();
  }

  /**
   * @param {string} target
   */
  _watchInit(target) {
    const { _fileCache } = this;
    chokidar.watch(target, { persistent: false })
      .on('add', (path) => {
        _fileCache.set(path);
      });
  }

  /**
   * @param {string} target
   * @param {function} fn
   */
  _watchObserve(target, fn) {
    const { _fileCache } = this;
    chokidar.watch(target, { ignoreInitial: true })
      .on('all', (evt, path) => {
        (async () => {
          if(!evt.match(/^(add|change)$/)) return;
          const _isUpdate = await _fileCache.mightUpdate(path);
          if(!_isUpdate) return;
          fileLog(evt, path);
          const { root } = config.project;
          const { _taskLog } = this;
          _taskLog.start();
          await fn(relative(root, path));
          _taskLog.finish();
        })();
      });
  }

  /**
   * @param {string} target
   */
  _watchSrc(target) {
    this._watchObserve(target, (path) => this._build(path));
  }

  /**
   * @param {string} target
   */
  _watchOther(target) {
    this._watchObserve(target, () => this._buildAll());
  }

  /**
   * @param {string} name
   * @param {string} path
   * @return {Promsie}
   */
  _buildAll(name, path) {
    return (async () => {
      const { argv, isFirstBuild } = NS;
      const _curtPathSet = NS.curtFiles[`${ name }Set`];
      const _paths       = await glob(path);
      const _curtPaths   = [];
      const _otherPaths  = [];
      for(const p of _paths) {
        if(_curtPathSet) {
          _curtPathSet.has(p) ? _curtPaths.push(p) : _otherPaths.push(p);
        } else {
          _otherPaths.push(p);
        }
      }
      if(_curtPaths.length) await this._buildMultiple(_curtPaths);
      if(!isFirstBuild && (argv['viewing-update'] || argv[`viewing-update-${ name }`])) {
        return;
      }
      if(_otherPaths.length) await this._buildMultiple(_otherPaths);
    })();
  }

  /**
   * @param {Array<string>} paths
   * @return {Promise}
   */
  _buildMultiple(paths) {
    return (async () => {
      await Promise.all(paths.map((p) => this._build(p)));
    })();
  }

  /**
   * @param {string}
   * @return {Promise}
   */
  _build(file) {}

}
