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
  const pug        = new Pug();
  const pugFactory = new PugFactory();
  const sprite     = new Sprite();
  const stylus     = new Stylus();
  tasks[0] = [
    pug.start.bind(pug),
    pugFactory.start.bind(pugFactory),
    sprite.start.bind(sprite),
  ];
  tasks[1] = [stylus.start.bind(stylus)];
}
if(needsAllTask || argv['scripting']) {
  const webpack = new Webpack();
  tasks[0].push(webpack.start.bind(webpack));
}
if(argv['production']) {
  const imagemin = new Imagemin();
  tasks[0].push(imagemin.start.bind(imagemin));
}

(async () => {
  for(const task of tasks) {
    await Promise.all(task.map((p) => p()));
  }
  if(argv['production']) {
    const clean = new Clean();
    await clean.start();
  }
  const urlList = new UrlList();
  await urlList.start()
  NS.isFirstBuild = false;
  const browserSync = new BrowserSync();
  await browserSync.start();
})();
