import Imagemin from './tasks/imagemin';

NS.argv = minimist(process.argv.slice(2));

new Imagemin().start();
