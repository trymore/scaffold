import Base from './base';
import config from '../tasks-config';
import { join, relative, basename } from 'path';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { readFile } from './utility/fs';
import { encodeLineFeedCode } from './utility/line-feed-code';
import stylus from 'stylus';
import nib from 'nib';
import iconv from 'iconv-lite';

export default class Stylus extends Base {

  constructor() {
    super('stylus');
  }

  _watch() {
    const { root, src, imports } = config.stylus;

    // init
    this._watchInit(join(root, '**/*.styl'));

    // src
    this._watchSrc(join(src, '**/*.styl'));

    // extend or include
    this._watchOther(join(imports, '**/*.styl'));
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
    const { project: { root }, stylus: { charset, lineFeedCode, src, dest } } = config;
    const { argv } = NS;

    return (async () => {
      const _path = join(root, path);
      const _buf  = await readFile(_path, (err) => errorLog('stylus', err));
      if(!_buf) return;

      const _stylus = stylus(_buf.toString())
        .use(nib())
        .import('nib')
        .set('filename', basename(path))
        .set('include css', true)
        .set('resolve url', true)
        .define('url', stylus.resolver())
        .set('compress', argv['production'])
        .set('sourcemap', !argv['production']);

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

      let _cssBuf = new Buffer(_css);

      if(lineFeedCode !== 'LF') {
        _cssBuf = encodeLineFeedCode(_cssBuf, lineFeedCode);
      }
      if(charset !== 'utf8') {
        _cssBuf = iconv.encode(_cssBuf, charset);
      }

      const _dest = join(dest, relative(src, path)).replace('.styl', '.css');
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