const charset      = 'utf8';
const lineFeedCode = 'LF';  // 'CR+LF', 'LF', 'CR'
const dest         = 'htdocs';
const pug          = 'pug';
const stylus       = 'stylus';
const webpack      = 'webpack';
const images       = 'images';
const urlList      = '.url-list';

export default {
  path: {
    root: __dirname,
    dest: dest,
  },
  pug: {
    charset     : charset,
    lineFeedCode: lineFeedCode,
    root        : pug,
    src         : `${ pug }/src`,
    tmp         : `${ pug }/(extends|includes)`,
    factory     : `${ pug }/factory`,
    dest        : dest,
    php         : [],  // 'all', ['index.pug', 'sp/index.pug']
  },
  stylus: {
    charset     : charset,
    lineFeedCode: lineFeedCode,
    root        : stylus,
    src         : `${ stylus }/src`,
    imports     : `${ stylus }/imports`,
    dest        : dest,
  },
  webpack: {
    charset     : charset,
    lineFeedCode: lineFeedCode,
    root        : webpack,
    src         : `${ webpack }/src`,
    imports     : `${ webpack }/imports`,
    dest        : dest,
  },
  images: {
    root     : images,
    minify   : `${ images }/minify`,
    sprite   : `${ images }/sprite`,
    dest     : dest,
    styleDest: `${ stylus }/imports/sprite.styl`,
  },
  urlList: {
    root: urlList,
    tmp : `${ urlList }/index.tmp`,
    dest: `${ urlList }/index.html`,
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db', 'htdocs/**/*.map',
  ],
}
