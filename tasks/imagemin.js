import Base from './base';
import config from '../tasks-config';
import { join, relative, extname } from 'path';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { readFileSync } from './utility/fs';
import imagemin from 'imagemin';
import pngquant from 'imagemin-pngquant';
import jpegtran from 'imagemin-jpegtran';
import gifsicle from 'imagemin-gifsicle';
import svgo from 'imagemin-svgo';

export default class Imagemin extends Base {

  constructor() {
    super('imagemin');

    const { png, jpg, gif, svg } = config.images.minifyOpts;
    this._plugins = {
      png: pngquant(png),
      jpg: jpegtran(jpg),
      gif: gifsicle(gif),
      svg: svgo(svg),
    };
  }

  _watch() {
    const { minify } = config.images;

    // init
    this._watchInit(join(minify, '**/*.+(png|jpg|gif|svg)'));

    // src
    this._watchSrc(join(minify, '**/*.+(png|jpg|gif|svg)'));
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { minify } = config.images;
    return super._buildAll('imagemin', join(minify, '**/*.+(png|jpg|gif|svg)'), true);
  }

  /**
   * @param {string} path
   * @return {Promsie}
   */
  _build(path) {
    const { minify, dest } = config.images;
    const { _plugins } = this;

    return (async () => {
      const _dest = join(dest, relative(minify, path));
      const _ext  = extname(path).replace('.', '');
      const _img  = readFileSync(path, 'base64', (err) => errorLog('imagemin', err));
      if(!_img) return;

      let _buf = null;
      const { production } = NS.argv;
      if(production) {
        _buf = await imagemin.buffer(new Buffer(_img, 'base64'), { plugins: [_plugins[_ext]] })
          .catch((err) => {
            errorLog('imagemin', err);
          });
      } else {
        _buf = new Buffer(_img, 'base64');
      }

      if(!sameFile(_dest, _buf, true)) {
        await mkfile(_dest, _buf.toString('base64'), 'base64');
        fileLog('create', _dest);
      }
    })();
  }

}
