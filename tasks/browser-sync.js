import config from '../tasks-config';
import fs from 'fs';
import { join, dirname, extname } from 'path';
import bs from 'browser-sync';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import { hasFile } from './utility/file';
import { readFile } from './utility/fs';
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
          const _buf = await this._pageConvert(_path);
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
   * @return {Promise<Buffer>}
   */
  _pageConvert(path) {
    return new Promise((resolve) => {
      fs.readFile(path, (err, buf) => {
        if(err) return next();
        const { charset } = config.pug;
        (async () => {
          let _buf = buf;
          if(charset !== 'utf8') {
            _buf = this._decode(_buf, charset);
          }
          _buf = await this._ssi(dirname(path), _buf);
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
    return new Buffer(_str.replace(/(<meta charset=")(.+)(">)/g, '$1utf-8$3'));
  }

  /**
   * @param {string} dir
   * @param {Buffer} buf
   * @return {Promise<Buffer>}
   */
  _ssi(dir, buf) {
    let _str        = buf.toString();
    const _rInc     = /<!--#include file=".+" -->/g;
    const _includes = _str.match(_rInc);

    return (async () => {
      if(_includes) {
        await Promise.all(_includes.map((inc) => {
          const _path = join(dir, inc.match(/file="(.+)"/)[1]);
          return (async () => {
            const _buf = await readFile(_path, (err, path) => {
              errorLog('browser-sync ssi', `No such file, open '${ path }'.`);
            });
            _str = _str.replace(inc, _buf.toString());
          })();
        }));
      }
      return new Buffer(_str);
    })();
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
      switch(_ext) {
        case '.html':
        case '.shtml':
        case '.php':
          pugSet.add(join(pug.src, _path.replace(_ext, '.pug')));
          break;
        case '.css':
          const { stylusSet } = NS.curtFiles;
          const { stylus } = config;
          stylusSet.add(join(stylus.src, _path.replace(_ext, '.styl')));
          break;
        case '.js':
          const { webpackSet } = NS.curtFiles;
          const { webpack } = config;
          webpackSet.add(join(webpack.src, _path));
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
    let _path = path;
    for(const ext of ['.html', '.shtml', '.php']) {
      if(extname(path)) break;
      const __path = join(path, `index${ ext }`);
      if(hasFile(_path)) {
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

    chokidar.watch(join(htdocs, '**/*.(html|shtml|php|css|js|png|jpg|jpeg|gif|svg)'), _opts)
      .on('all', (event, path) => {
        if(![...destSet].includes(path)) return;
        browserSync.reload(path);
      });
  }

}
