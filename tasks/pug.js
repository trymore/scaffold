import PugBase from './pug-base';
import config from '../tasks-config';
import { join, relative, dirname } from 'path';
import CacheBuster from './utility/cache-buster';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { encodeLineFeedCode } from './utility/line-feed-code';
import { toRelativePath, cacheBuster } from './utility/path-convert';
import pug from 'pug';
import iconv from 'iconv-lite';

export default class Pug extends PugBase {

  constructor() {
    super('pug');
    const { cacheBusterExts } = config.pug;
    this._cacheBuster = cacheBusterExts.length ? new CacheBuster(cacheBusterExts) : null;
  }

  _watch() {
    const { src, tmp } = config.pug;

    // init
    this._watchInit(join(src, '**/*.pug'));
    this._watchInit(join(tmp, '**/*.pug'));

    // src
    this._watchSrc(join(src, '**/*.pug'));

    // extend or include
    this._watchOther(join(tmp, '**/*.pug'));

    // cache buster
    const { _cacheBuster } = this;
    if(_cacheBuster) {
      const _target = (() => {
        const { htdocs } = config.project;
        const { cacheBusterExts } = config.pug;
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
    const { src } = config.pug;
    return super._buildAll('pug', join(src, '**/*.pug'), true);
  }

  /**
   * @param {string} path
   * @param {Promise}
   */
  _build(path) {
    const {
      project: { htdocs },
      pug    : { charset, lineFeedCode, src, dest, relativePath, spaceFilling },
    } = config;
    const { _pugOpts } = this;

    return (async () => {
      const _ext  = this._getExt(relative(src, path));
      const _dest = join(dest, relative(src, path)).replace('.pug', _ext);
      const _opts = Object.assign(_pugOpts, this._getMembers(path));

      const _html = await new Promise((resolve, reject) => {
        if (spaceFilling) {
          _opts['pretty'] = '\t';
        }
        pug.renderFile(path, _opts, (err, html) => {
          if(err) return reject(err);
          if (spaceFilling) {
            html = html.replace(new RegExp("^[\t| ]+", 'gm'), '');
          }
          resolve(html);
        });
      })
        .catch((err) => {
          errorLog('pug', err.message);
        });

      if(!_html) return;

      let _buf = Buffer.from(_html);

      if(relativePath) {
        const _rootDirname = `/${ dirname(relative(htdocs, _dest)) }`;
        _buf = toRelativePath(_buf, _rootDirname);
      }

      const { _cacheBuster } = this;
      if(_cacheBuster) {
        _buf = _cacheBuster.start(_buf, _dest);
      }

      _buf = encodeLineFeedCode(_buf, lineFeedCode);

      if(charset !== 'utf8') {
        _buf = iconv.encode(_buf, charset);
      }

      if(!sameFile(_dest, _buf)) {
        await mkfile(_dest, _buf);
        fileLog('create', _dest);
      }
    })();
  }

}
