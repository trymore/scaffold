export default {
  project: {
    root  : __dirname,
    htdocs: 'htdocs',
  },
  pug: {
    charset        : 'utf8',
    lineFeedCode   : 'LF',  // 'CR+LF', 'LF', 'CR'
    root           : 'pug',
    src            : 'pug/src',
    tmp            : 'pug/(extends|includes)',
    factory        : 'pug/factory',
    dest           : 'htdocs',
    php            : [],  // 'all', ['index.pug', 'sp/index.pug']
    minify         : true,
    pretty         : true,  // '\t', '\b'
    relativePath   : false,
    spaceFilling   : false,
    cacheBusterExts: [],
  },
  stylus: {
    charset        : 'utf8',
    lineFeedCode   : 'LF',  // 'CR+LF', 'LF', 'CR'
    root           : 'stylus',
    src            : 'stylus/src',
    imports        : 'stylus/imports',
    dest           : 'htdocs',
    minify         : true,
    relativePath   : true,
    cacheBusterExts: ['jpg', 'png', 'gif', 'svg'],
  },
  webpack: {
    transcompiler : 'babel',  // ['babel', 'coffee']
    charset       : 'utf8',
    lineFeedCode  : 'LF',  // 'CR+LF', 'LF', 'CR'
    root          : 'webpack',
    src           : 'webpack/src',
    imports       : 'webpack/imports',
    dest          : 'htdocs',
    minify        : true,
    notMinifyFiles: ['webpack/**/vendor.js'],
  },
  images: {
    root      : 'images',
    minify    : 'images/minify',
    sprite    : 'images/sprite',
    original  : 'images/original',
    dest      : 'htdocs',
    stylusDest: 'stylus/imports/sprite.styl',
    minifyOpts: {
      png: { quality: 100, speed: 1 },
      jpg: { progressive: true },
      gif: {},
      svg: {},
    },
  },
  urlList: {
    root: '.url-list',
    tmp : '.url-list/index.tmp',
    dest: '.url-list/index.html',
  },
  comp: {
    root  : 'comp',
    script: 'comp/script.html',
    src   : 'comp/src',
    imgExt: 'jpg',
    types : [
      { id: 'pc' , dppx: 1.0 },
      { id: 'tab', dppx: 1.0 },
      { id: 'sp' , dppx: 2.0 },
    ],
  },
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db', 'htdocs/**/*.map',
  ],
}
