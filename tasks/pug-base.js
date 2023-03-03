import Base from './base';
import config from '../tasks-config';
import { join, relative, dirname, parse } from 'path';
import { getType } from './utility/type';
import imageSize from 'image-size';

export default class PugBase extends Base {

  get _pugOpts() {
    const { minify, pretty } = config.pug;
    const { argv } = NS;
    return {
      pretty : !(argv['production'] && minify) ? pretty : false,
      filters: this._getFilters(),
    };
  }

  _getFilters() {
    return {
      'do-nothing': (block) => {
        const _indentData = block.match(/^\{\{indent=([0-9])\}\}\n/);
        const _block = (() => {
          if(!_indentData) return block;
          const _notVarBlock = block.replace(_indentData[0], '');
          let _indent = '';
          for(let _i = 0; _indentData[1] > _i; _i++) _indent += ' ';
          return _indent + _notVarBlock.replace(/\n/g, `\n${ _indent }`);
        })();
        return `\n${ _block }`;
      },
    };
  }

  /**
   * @param {string} filePath
   */
  _getMembers(filePath) {
    const { root, src, dest } = config.pug
    const { production } = NS.argv
    const _dirname = dirname(filePath)
    return {
      isProduction: production,
      basedir: root,
      dirname: _dirname,
      dest: dest,
      join: (...paths) => join(...paths),
      relative: (path) => relative(relative(src, _dirname), path),
      parsePath: (path) => parse(path),
      imageSize: (path) => imageSize(path)
    }
  }

  /**
   * @param {string} path
   */
  _getExt(path) {
    const { php } = config.pug;
    if(!/^(Array|String)$/.test(getType(php))) {
      throw new TypeError('"php" is not string or array type.');
    }
    if(php === 'all') return '.php';
    return php.includes(path) ? '.php' : '.html';
  }

}
