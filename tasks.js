import { join, relative } from 'path';
import minimist from 'minimist';
import BrowserSync from './tasks/browser-sync';
import Pug from './tasks/pug';
import PugFactory from './tasks/pug-factory';
import Stylus from './tasks/stylus';
import Webpack from './tasks/webpack';
import Imagemin from './tasks/imagemin';
import Sprite from './tasks/sprite';
import Clean from './tasks/clean';
import UrlList from './tasks/url-list';

global.NS = {};
NS.argv         = minimist(process.argv.slice(2));
NS.isFirstBuild = true;
NS.curtFiles    = {
  destSet: new Set(), pugSet: new Set(), stylusSet: new Set(), webpackSet: new Set(),
};

const { argv } = NS;
const needsAllTask = !argv['coding'] && !argv['scripting'];

const tasks = [[]];
if(needsAllTask || argv['coding']) {
  tasks[0].concat([new Pug().start(), new PugFactory().start(), new Sprite().start()]);
  tasks[1] = [new Stylus().start()];
}
if(needsAllTask || argv['scripting']) {
  tasks[0].push(new Webpack().start());
}
if(argv['production']) {
  tasks[0].push(new Imagemin().start());
}

(async () => {
  for(const t of tasks) {
    await Promise.all(t);
  }
  if(argv['production']) {
    await new Clean().start();
  }
  await new UrlList().start()
  NS.isFirstBuild = false;
  await new BrowserSync().start();
})();
