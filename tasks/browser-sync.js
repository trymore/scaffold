import config from '../tasks-config';
import fs from 'fs';
import { join, dirname, extname, relative, parse } from 'path';
import bs from 'browser-sync';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import { isFile } from './utility/file';
import { readFileSync } from './utility/fs';
import chokidar from 'chokidar';
import iconv from 'iconv-lite';
import deepAssign from 'deep-assign';

const browserSync        = bs.create();
const browserSyncUrlList = bs.create();

export default class BrowserSync {

  get _bsUrlListOpts() {
    const { root } = config.urlList;
    return {
      server: {
        baseDir: root,
      },
      port                : 3002,
      ui                  : false,
      open                : false,
      notify              : false,
      reloadOnRestart     : true,
      scrollProportionally: false,
    };
  }

  get _bsBaseOpts() {
    return {
      open                : false,
      notify              : false,
      reloadOnRestart     : true,
      scrollProportionally: false,
      server: {
        middleware: [
          this._setViewingFile.bind(this),
          this._convert.bind(this),
        ],
      },
    };
  }

  get _bsOpts() {
    const { htdocs } = config.project;
    const { _bsBaseOpts } = this;
    return deepAssign(_bsBaseOpts, {
      server: {
        baseDir: htdocs,
      },
    });
  }

  get _bsPhpOpts() {
    const { _bsBaseOpts } = this;
    return deepAssign(_bsBaseOpts, {
      proxy: '0.0.0.0:3010',
    });
  }

  constructor() {
    this._taskLog = new TaskLog('browser-sync');
  }

  /**
   * @return {Promsie}
   */
  start() {
    const { _taskLog } = this;
    return (async () => {
      _taskLog.start();
      await Promise.all([
        this._browserSyncUrlList(),
        this._browserSync(),
      ]);
      const { argv } = NS;
      if(!argv['production']) {
        this._watch();
      }
    })();
  }

  /**
   * @return {Promise}
   */
  _browserSyncUrlList() {
    return new Promise((resolve) => {
      const { _bsUrlListOpts } = this;
      browserSyncUrlList.init(_bsUrlListOpts, resolve);
    });
  }

  /**
   * @return {Promise}
   */
  _browserSync() {
    return new Promise((resolve) => {
      const { argv } = NS;
      const { _bsOpts, _bsPhpOpts } = this;
      const _opts = !argv['php'] ? _bsOpts : _bsPhpOpts;
      browserSync.init(_opts, resolve);
    })
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   */
  _convert(req, res, next) {
    const { htdocs } = config.project;

    const { url } = req;
    let _path = join(htdocs, url);

    if(!_path) return next();

    if(!extname(_path)) {
      _path = this._getFilePath(_path);
    }

    (async () => {
      switch(extname(_path)) {
        case '.html':
        case '.shtml':
        case '.php':
          const _buf = await this._pageConvert(_path, next);
          res.writeHead(200, { 'Content-Type': 'text/html' });
           res.end(_buf.toString());
          break;
        default:
          next();
      }
    })();
  }

  /**
   * @param {string} path
   * @param {function} next
   * @return {Promise<Buffer>}
   */
  _pageConvert(path, next) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, buf) => {
        if(err) return next();
        const { charset } = config.pug;
        (async () => {
          let _buf = buf;
          if(charset !== 'utf8') {
            _buf = this._decode(_buf, charset);
          }
          _buf = await this._ssi(dirname(path), _buf);
          const { comp } = NS.argv;
          if(comp) {
            const { htdocs } = config.project;
            _buf = await this._comp(path.replace(htdocs, ''), _buf);
          }
          resolve(_buf);
        })();
      });
    });
  }

  /**
   * @param {Buffer} buf
   * @param {string} encoding
   * @return {Buffer}
   */
  _decode(buf, encoding) {
    const _str = iconv.decode(buf, encoding);
    return Buffer.from(_str.replace(/(<meta charset=")(.+)(">)/g, '$1utf-8$3'));
  }

  /**
   * @param {string} dir
   * @param {Buffer} buf
   * @return {Buffer}
   */
  _ssi(dir, buf) {
    let _str        = buf.toString();
    const _rInc     = /<!--#include(\s+)(file|virtual)=".+"(\s*)-->/g;
    const _includes = _str.match(_rInc);

    if(_includes) {
      for(const inc of _includes) {
        const { htdocs } = config.project;
        const _incPath = inc.match(/(file|virtual)="(.+)"/)[2];
        const _path = _incPath.match(/^\/.*$/g)
          ? join(htdocs, _incPath) : join(dir, _incPath);
        const _buf = readFileSync(_path, (err, path) => {
          errorLog('browser-sync ssi', `No such file, open '${ _path }'.`);
        });
        if(!_buf) continue;
        const __buf = this._ssi(dir, _buf);
        _str = _str.replace(inc, __buf.toString());
      }
    }
    return Buffer.from(_str);
  }

  /**
   * @param {string} path
   * @param {Buffer} buf
   * @return {Buffer}
   */
  _comp(path, buf) {
    let _str  = buf.toString();
    const _headEndStr = '</head>';
    const _strs = _str.split(_headEndStr);

    if(_strs) {
      const { script, src, imgExt, types } = config.comp;

      const _scriptBuf = readFileSync(script, (err, path) => {
        errorLog('browser-sync check script', `No such file, open '${ script }'.`);
      });
      if(!_scriptBuf) return buf;

      const { dir, name } = parse(join(src, path));
      const _data = types.reduce((memo, { id, dpi }) => {
        const _path = `${ join(dir, name) }--${ id }.${ imgExt }`;
        const _buf  = readFileSync(_path, 'base64');
        if(_buf) {
          memo[id] = { src: `data:image/png;base64,${ _buf }`, dpi };
        }
        return memo;
      }, {});
      if(!Object.keys(_data).length) return buf;

      const _scriptStr = _scriptBuf.toString().replace('{{data}}', JSON.stringify(_data));

      _str = _strs[0] + _headEndStr + _scriptStr + _strs[1];
    }
    return Buffer.from(_str);
  }

  /**
   * @param {Object} req
   * @param {Object} res
   * @param {function} next
   */
  _setViewingFile(req, res, next) {
    const { destSet, pugSet } = NS.curtFiles;
    const { project: { htdocs }, pug } = config;

    const { url } = req;
    const _path = this._getFilePath(join(htdocs, url));
    const _ext  = extname(_path);

    if(_ext) {
      destSet.add(_path);
      const _taskRoot = relative(htdocs, _path);
      switch(_ext) {
        case '.html':
        case '.shtml':
        case '.php':
          pugSet.add(join(pug.src, _taskRoot.replace(_ext, '.pug')));
          break;
        case '.css':
          const { stylusSet } = NS.curtFiles;
          const { stylus } = config;
          stylusSet.add(join(stylus.src, _taskRoot.replace(_ext, '.styl')));
          break;
        case '.js':
          const { webpackSet } = NS.curtFiles;
          const { transcompiler, webpack } = config;
          webpackSet.add(join(
            webpack.src,
            _taskRoot
          ));
          break;
      }
    }
    next();
  }

  /**
   * @param {string} path
   * @return {string}
   */
  _getFilePath(path) {
    let _path = path.replace(/[?#].+$/, '');
    for(const ext of ['.html', '.shtml', '.php']) {
      if(extname(_path)) break;
      const __path = join(_path, `index${ ext }`);
      if(isFile(__path)) {
        _path = __path;
        break;
      }
    }
    return _path;
  }

  _watch() {
    const { htdocs } = config.project;
    const { destSet } = NS.curtFiles;

    const _opts = { ignoreInitial: true };

    chokidar.watch(join(htdocs, '**/*.+(html|shtml|php|css|js|png|jpg|gif|svg)'), _opts)
      .on('all', (evt, path) => {
        if(![...destSet].includes(path)) return;
        browserSync.reload(path);
      });
  }

}
