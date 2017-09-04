import config from '../tasks-config';
import { join, relative, dirname } from 'path';
import TaskLog from './utility/task-log';
import { createDebounce } from './utility/debounce';
import { mkfile, sameFile } from './utility/file';
import { fileLog } from './utility/file-log';
import { glob } from './utility/glob';
import chokidar from 'chokidar';
import Spritesmith from 'spritesmith';
import imagemin from 'imagemin';
import pngquant from 'imagemin-pngquant';

export default class Sprite {

  get _spriteOpts() {
    return {
      algorithm    : 'top-down',
      algorithmOpts: { sort: false },
    };
  }

  get _mixin() {
    return `sprite(filepath, scale = 1)
  image-hash = sprite-hash[filepath]
  if !image-hash
    error('Not found image file ' + filepath + '.')
  width: (image-hash.width * scale)px
  height: (image-hash.height * scale)px
  url = image-hash.url
  background: url(url) no-repeat
  background-position: (-1 * image-hash.x * scale)px (-1 * image-hash.y * scale)px
  if scale != 1
    background-size: (image-hash.width * scale)px, (image-hash.height * scale)px
sprite-retina(filepath)
  sprite filepath, 0.5`;
  }

  constructor() {
    this._taskLog   = new TaskLog('sprite');
    this._debounce  = createDebounce();
  }

  /**
   * @return {Promsie}
   */
  start() {
    return (async () => {
      const { argv } = NS;
      if(argv['build']) {
        await this._build();
      }
      if(!argv['production']) {
        new TaskLog('watch sprite').start();
        this._watch();
      }
    })();
  }

  _watch() {
    const { sprite } = config.images;
    chokidar.watch(join(sprite, '**/*.png'), { ignoreInitial: true })
      .on('all', (evt, path) => {
        if(!evt.match(/^(add|unlink|change)$/)) return;
        fileLog(evt, path);
        const { _debounce } = this;
        _debounce(() => {
          this._build();
        });
      });
  }

  /**
   * @return {Promsie}
   */
  _build() {
    const { sprite, stylusDest } = config.images;
    const { _taskLog } = this;
    return (async () => {
      _taskLog.start();

      const _paths   = await glob(join(sprite, '**/*.+(png|jpg|gif|svg)'));
      const _pathMap = this._groupBy(_paths);

      const _spritehashs = await Promise.all((() => {
        const _promises = [];
        _pathMap.forEach((paths, key) => {
          _promises.push(this._spritesmith(key, paths));
        });
        return _promises;
      })());

      const _css = this._getCss(this._flatten(_spritehashs));
      if(_css && !sameFile(stylusDest, new Buffer(_css))) {
        await mkfile(stylusDest, _css);
        fileLog('create', stylusDest);
      }

      _taskLog.finish();
    })();
  }

  /**
   * @param {Array} paths
   * @return {Map}
   */
  _groupBy(paths) {
    const { sprite } = config.images;
    return paths.reduce((memo, path) => {
      const _dir  = dirname(relative(sprite, path));
      if(!memo.has(_dir)) memo.set(_dir, []);
      memo.get(_dir).push(path);
      return memo;
    }, new Map());
  }

  /**
   * @param {string} key
   * @param {Array<string>} paths
   * @return {Promsie}
   */
  _spritesmith(key, paths) {
    const { sprite, dest } = config.images;
    const { _pngquantOpts, _spriteOpts } = this;

    return new Promise((resolve, reject) => {
      Spritesmith.run(Object.assign({ src: paths }, _spriteOpts), (err, result) => {
        if(err) return reject(err);
        const { coordinates, properties, image } = result;
        const _key  = `${ key }.png`;
        const _dest = join(dest, _key);

        (async () => {
          const _buf = await this._getImgBuf(image);
          if(!sameFile(_dest, _buf)) {
            await mkfile(_dest, _buf.toString('base64'), 'base64');
            fileLog('create', _dest);
          }
          resolve(Object.entries(coordinates).reduce((memo, [path, style]) => {
            memo[relative(sprite, path)] = Object.assign(style, { url: `/${ _key }` });
            return memo;
          }, {}));
        })();
      });
    })
      .catch((err) => {
        errorLog('sprite', err);
      });
  }

  /**
   * @param {object} hash
   * @return {string}
   */
  _getCss(hash) {
    if(!Object.keys(hash).length) return '';
    const { _mixin } = this;
    return `sprite-hash = ${ JSON.stringify(hash) }
${ _mixin }`;
  }

  /**
   * @param {Array<Object>} arr
   * @return {Object}
   */
  _flatten(arr) {
    return arr.reduce((memo, obj) => {
      Object.assign(memo, obj);
      return memo;
    }, {});
  }

  /**
   * @param {Buffer} buf
   * @return {Promise}
   */
  _getImgBuf(buf) {
    const { argv } = NS;
    if(!argv['production']) {
      return Promise.resolve(buf);
    }
    const { _pngquantOpts } = this;
    const { png } = config.images.minifyOpts;
    return imagemin.buffer(buf, {
      plugins: [pngquant(png)],
    });
  }

}
