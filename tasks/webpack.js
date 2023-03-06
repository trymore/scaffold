import Base from './base'
import config from '../tasks-config'
import MemoryFS from 'memory-fs'
import { join, relative, dirname, basename } from 'path'
import { errorLog } from './utility/error-log'
import { mkfile, sameFile } from './utility/file'
import { fileLog } from './utility/file-log'
import { glob } from './utility/glob'
import { encodeLineFeedCode } from './utility/line-feed-code'
import webpack from 'webpack'
import iconv from 'iconv-lite'

const memoryFs = new MemoryFS()

export default class Webpack extends Base {
  get _webpackOpts() {
    const {
      project: { root },
      webpack: { transcompiler },
    } = config
    const { _ext } = this

    const _rules = {
      babel: {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
              ],
            },
          },
        ],
      },
      typescript: {
        test: /\.ts$/,
        use: [
          {
            loader: 'ts-loader',
          },
        ],
        exclude: /node_modules/
      },
    }[transcompiler]

    return {
      resolve: {
        descriptionFiles: ['package.json'],
        extensions: [_ext],
        modules: [join(root, 'webpack/imports'), 'node_modules'],
        alias: {},
      },
      module: {
        rules: [Object.assign(_rules, { exclude: /node_modules/ })],
      },
      devtool: 'source-map',
      plugins: [],
    }
  }

  constructor() {
    super('webpack')

    const { transcompiler } = config.webpack
    this._ext = {
      babel: '.js',
      typescript: '.ts',
    }[transcompiler]
  }

  /**
   * @return {Promise}
   */
  init() {
    return (async () => {
      const { notMinifyFiles } = config.webpack
      this._notMinifyFiles = await glob(notMinifyFiles)
    })()
  }

  _watch() {
    const { root, src, imports } = config.webpack
    const { _ext } = this

    // init
    this._watchInit(join(root, `**/*${_ext}`))

    // src
    this._watchSrc(join(src, `**/*${_ext}`))

    // extend or include
    this._watchOther(join(imports, `**/*${_ext}`))
  }

  /**
   * @return {Promsie}
   */
  _buildAll() {
    const { src } = config.webpack
    const { _ext } = this
    return super._buildAll('webpack', join(src, `**/*${_ext}`))
  }

  /**
   * @param {string} file
   * @param {Promise}
   */
  _build(file) {
    const {
      project: { root },
      webpack: { charset, lineFeedCode, src, dest, minify },
    } = config
    const { argv } = NS
    const { _webpackOpts, _ext, _notMinifyFiles } = this

    return (async () => {
      const _root = relative(src, file.replace(_ext, '.js'))
      const _dest = join(dest, _root)
      const _destDir = dirname(_dest)
      const _destFile = basename(_dest)

      const _needsMinify = !_notMinifyFiles.includes(file)
      const _opts = Object.assign(
        {
          mode: !!(argv['production'] && minify && _needsMinify) ? 'production' : 'development',
          entry: join(root, file),
          output: {
            path: join(root, _destDir),
            filename: _destFile,
          },
        },
        _webpackOpts
      )

      const _compiler = webpack(_opts)
      _compiler.outputFileSystem = memoryFs
      const { jsBuf, sourcemapBuf } = await new Promise((resolve) => {
        _compiler.run((err, stats) => {
          if (err) {
            errorLog('webpack', err)
            return resolve({ jsBuf: null, sourcemapBuf: null })
          }
          const { errors } = stats.compilation
          if (errors.length) {
            const { root } = config.project
            const {
              message,
              module: { resource },
            } = errors[0]
            errorLog('webpack', `${relative(root, resource)}\n${message}`)
            return resolve({ jsBuf: null, sourcemapBuf: null })
          }
          const _path = join(root, _destDir, _destFile)

          ;(async () => {
            const _jsBuf = await this._readFile(_path)
            const _sourcemapBuf = argv['production'] ? null : await this._readFile(`${_path}.map`)
            resolve({ jsBuf: _jsBuf, sourcemapBuf: _sourcemapBuf })
          })()
        })
      })
      if (!jsBuf) return

      let _jsBuf = jsBuf

      _jsBuf = encodeLineFeedCode(_jsBuf, lineFeedCode)

      if (charset !== 'utf8') {
        _jsBuf = iconv.encode(_jsBuf, charset)
      }

      if (!sameFile(_dest, _jsBuf)) {
        await mkfile(_dest, _jsBuf)
        fileLog('create', _dest)

        if (sourcemapBuf) {
          const _mapPath = `${_dest}.map`
          await mkfile(_mapPath, sourcemapBuf.toString())
          fileLog('create', _mapPath)
        }
      }
    })()
  }

  /**
   * @param {string} path
   * @return {Promise<Buffer>}
   */
  _readFile(path) {
    return new Promise((resolve, reject) => {
      memoryFs.readFile(path, (err, data) => {
        if (err) return reject(err)
        resolve(data)
      })
    }).catch((err) => {
      errorLog('webpack', err)
    })
  }
}
