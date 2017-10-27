import Base from './base';
import config from '../tasks-config';
import { join, relative, dirname, basename } from 'path';
import CacheBuster from './utility/cache-buster';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { readFileSync } from './utility/fs';
import { encodeLineFeedCode } from './utility/line-feed-code';
import { toRelativePath, cacheBuster } from './utility/path-convert';
import stylus from 'stylus';
import nib from 'nib';
import iconv from 'iconv-lite';

export default class Stylus extends Base {

  constructor() {
    super('stylus');
    const { cacheBusterExts } = config.stylus;
    this._cacheBuster = cacheBusterExts.length ? new CacheBuster(cacheBusterExts) : null;
  }

  _watch() {
    const { root, src, imports } = config.stylus;

    // init
    this._watchInit(join(root, '**/*.styl'));

    // src
    this._watchSrc(join(src, '**/*.styl'));

    // extend or include
    this._watchOther(join(imports, '**/*.styl'));

    // cache buster
    const { _cacheBuster } = this;
    if(_cacheBuster) {
      const _target = (() => {
        const { htdocs } = config.project;
        const { cacheBusterExts } = config.stylus;
        const _extsStr = cacheBusterExts.reduce((memo, ext, i) => {
          if(i) memo += '|';
          memo += ext;
          return memo;
        }, '');
        return `${ htdocs }/**/*.+(${ _extsStr })`;
      })();
      this._watchInit(_target);
      this._watchOther(_target);
    }
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.stylus;
    return super._buildAll('stylus', join(src, '**/*.styl'));
  }

  /**
   * @param {string} path
   * @param {Promise}
   */
  _build(path) {
    const {
      project: { root, htdocs },
      stylus : { charset, lineFeedCode, src, dest, minify, relativePath },
    } = config;
    const { argv } = NS;

    const _path = join(root, path);
    const _buf  = readFileSync(_path, (err) => errorLog('stylus', err));
    if(!_buf) return;

    const _stylus = stylus(_buf.toString())
      .use(nib())
      .import('nib')
      .set('filename', basename(path))
      .set('include css', true)
      .set('resolve url', true)
      .define('url', stylus.resolver())
      .set('compress', argv['production'] && minify)
      .set('sourcemap', !argv['production']);

    return (async () => {
      const _css = await new Promise((resolve, reject) => {
        _stylus.render((err, css) => {
          if(err) return reject(err);
          resolve(css);
        });
      })
        .catch((err) => {
          errorLog('stylus', err.message);
        });
      if(!_css) return;

      const _dest = join(dest, relative(src, path)).replace('.styl', '.css');
      let _cssBuf = new Buffer(_css);

      if(relativePath) {
        const _rootDirname = `/${ dirname(relative(htdocs, _dest)) }`;
        _cssBuf = toRelativePath(_cssBuf, _rootDirname);
      }

      const { _cacheBuster } = this;
      if(_cacheBuster) {
        _cssBuf = _cacheBuster.start(_cssBuf, _dest);
      }

      _cssBuf = encodeLineFeedCode(_cssBuf, lineFeedCode);

      if(charset !== 'utf8') {
        _cssBuf = iconv.encode(_cssBuf, charset);
      }

      if(!sameFile(_dest, _cssBuf)) {
        await mkfile(_dest, _cssBuf);
        fileLog('create', _dest);

        const { sourcemap } = _stylus;
        if(sourcemap) {
          const _mapDest = `${ _dest }.map`;
          await mkfile(_mapDest, JSON.stringify(sourcemap));
          fileLog('create', _mapDest);
        }
      }
    })();
  }

}
