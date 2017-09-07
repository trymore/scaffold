import config from '../tasks-config';
import { join, relative, dirname, extname } from 'path';
import TaskLog from './utility/task-log';
import { errorLog } from './utility/error-log';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { readFileSync } from './utility/fs';
import { glob } from './utility/glob';
import imagemin from 'imagemin';
import pngquant from 'imagemin-pngquant';
import jpegtran from 'imagemin-jpegtran';
import gifsicle from 'imagemin-gifsicle';
import svgo from 'imagemin-svgo';

export default class Imagemin {

  constructor() {
    this._taskLog = new TaskLog('imagemin');

    const { png, jpg, gif, svg } = config.images.minifyOpts;
    this._plugins = {
      png: pngquant(png),
      jpg: jpegtran(jpg),
      gif: gifsicle(gif),
      svg: svgo(svg),
    };
  }

  /**
   * @return {Promsie}
   */
  start() {
    return this._minifyMultiple();
  }

  /**
   * @return {Promsie}
   */
  _minifyMultiple() {
    const { minify } = config.images;
    const { _taskLog } = this;

    return (async () => {
      _taskLog.start();
      const _paths = await glob(join(minify, '**/*.+(png|jpg|gif|svg)'));
      await Promise.all(_paths.map((p) => this._minify(p)));
      _taskLog.finish();
    })();
  }

  /**
   * @param {string} path
   * @return {Promsie}
   */
  _minify(path) {
    const { minify, dest } = config.images;
    const { _plugins } = this;

    return (async () => {
      const _dest = join(dest, relative(minify, path));
      const _ext  = extname(path).replace('.', '');
      const _img  = readFileSync(path, 'base64', (err) => errorLog('imagemin', err));
      if(!_img) return;

      const _buf = await imagemin.buffer(new Buffer(_img, 'base64'), { plugins: [_plugins[_ext]] })
        .catch((err) => {
          errorLog('imagemin', err);
        });
      if(!sameFile(_dest, _buf, true)) {
        await mkfile(_dest, _buf.toString('base64'), 'base64');
        fileLog('create', _dest);
      }
    })();
  }

}
