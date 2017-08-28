import PugBase from './pug-base';
import config from '../tasks-config';
import { join, relative } from 'path';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { encodeLineFeedCode } from './utility/line-feed-code';
import pug from 'pug';
import iconv from 'iconv-lite';

export default class Pug extends PugBase {

  constructor() {
    super('pug');
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
    const { charset, lineFeedCode, src, dest } = config.pug;
    const { _pugOpts } = this;

    return (async () => {
      const _ext  = this._getExt(relative(src, path));
      const _dest = join(dest, relative(src, path)).replace('.pug', _ext);
      const _opts = Object.assign(_pugOpts, this._getMembers(path));

      const _html = await new Promise((resolve, reject) => {
        pug.renderFile(path, _opts, (err, html) => {
          if(err) return reject(err);
          resolve(html);
        });
      })
        .catch((err) => {
          errorLog('pug', err.message);
        });

      if(!_html) return;

      let _buf = new Buffer(_html);

      if(lineFeedCode !== 'LF') {
        _buf = encodeLineFeedCode(_buf, lineFeedCode);
      }
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
