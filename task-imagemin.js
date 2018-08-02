import Imagemin from './tasks/imagemin';
import minimist from 'minimist';

if(!global.NS) {
  global.NS = {};
  NS.argv = minimist(process.argv.slice(2));
  NS.isFirstBuild = true;
  NS.curtFiles    = {
    imageminSet: new Set()
  };
}

new Imagemin().start();
