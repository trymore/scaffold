# 開発環境の構築

このプロジェクトは [node.js](https://nodejs.org/en/) で構築されている

## 事前準備

### [node.js](https://nodejs.org/en/)（v6~）をグローバルインストール
インストール済みの場合はスキップ  
node.js は直接インストールやバージョン管理ツールを使う方法など複数あるのでインストール方法は省略

### [npm](https://www.npmjs.com/) を v5~ にアップデート
アップデート済みの場合はスキップ  
v5 以降では `package-lock.json` が使えるので依存関係を共通化できる為
```
$ npm update -g npm
```

## 環境構築
```bash
$ npm install
```

### オフラインモード
```bash
$ npm install --prefer-offline
```
直接速度に影響するものではないが、あればローカルキャッシュを使う為、ネットワーク利用率が下り高速化される可能性もある。  
通信が状況が悪い時などに使用するとよいかと。



# 設定
`task-config.js` に記述

| プロパティ名          | 説明                                     |
|:----------------------|:-----------------------------------------|
| project.root          |プロジェクトのルート                      |
| project.htdocs        |プロジェクトのドキュメントルート          |
| pug.charset           |pug の出力ファイル文字コード              |
| pug.lineFeedCode      |pug の出力ファイル改行コード              |
| pug.root              |pug のルート                              |
| pug.src               |pug の元ファイルディレクトリ              |
| pug.tmp               |pug のテンプレート等ファイルディレクトリ  |
| pug.factory           |pug の fuctory 関連ディレクトリ           |
| pug.dest              |pug の出力ディレクトリ                    |
| pug.php               |pug を PHP で出力するファイル             |
| stylus.charset        |stylus の出力ファイル文字コード           |
| stylus.lineFeedCode   |stylus の出力ファイル改行コード           |
| stylus.root           |stylus のルート                           |
| stylus.src            |stylus 元ファイルディレクトリ             |
| stylus.imports        |stylus インポートファイルディレクトリ     |
| stylus.dest           |stylus 出力ディレクトリ                   |
| webpack.transcompiler |webpack のトランスパイラ                  |
| webpack.charset       |webpack の出力ファイル文字コード          |
| webpack.lineFeedCode  |webpack の出力ファイル改行コード          |
| webpack.root          |webpack のルート                          |
| webpack.src           |webpack の元ファイルディレクトリ          |
| webpack.imports       |webpack のインポートファイルディレクトリ  |
| webpack.dest          |webpack の出力ディレクトリ                |
| images.root           |画像圧縮・スプライト関連のルート          |
| images.minify         |圧縮画像の元ファイルディレクトリ          |
| images.sprite         |スプライト画像の元ファイルディレクトリ    |
| images.dest           |圧縮画像・スプライト画像の出力ディレクトリ|
| images.stylusDest     |スプライトの stylus ファイル出力先        |
| images.minifyOpts.png |png の圧縮オプション（ [imagemin-pngquant](https://github.com/imagemin/imagemin-pngquant#options) ）|
| images.minifyOpts.jpg |jpg の圧縮オプション（ [imagemin-jpegtran](https://github.com/imagemin/imagemin-jpegtran#options) ）|
| images.minifyOpts.gif |gif の圧縮オプション（ [imagemin-gifsicle](https://github.com/imagemin/imagemin-gifsicle#options) ）|
| images.minifyOpts.svg |svg の圧縮オプション（ [imagemin-svgo](https://github.com/imagemin/imagemin-svgo#options) ）|
| urlList.root          |URL一覧関連のルート                       |
| urlList.tmp           |URL一覧のテンプレートファイル             |
| urlList.dest          |URL一覧の出力先                           |
| deletes               |clear タスク時の削除ファイル              |



# npm scripts コマンド

## タスク

| コマンド                 | 説明                                   |
|:-------------------------|:---------------------------------------|
| npm run watch            |`pug` `stylus` `webpack` `sprite` を監視|
| npm run build            |`pug` `stylus` `webpack` をトランスパイル <br> `sprite` を生成 <br> `pug` `stylus` `webpack` `sprite` を監視|
| npm run build:production |`pug` `stylus` `webpack` をトランスパイル（圧縮） <br> `stylus` `webpack` の sourcemap 無し <br> `sprite` を生成 <br> `images/minify/` フォルダ内画像を圧縮・出力 <br> 不要ファイルを削除 |
| npm run imagemin         |`images/minify/` フォルダ内画像を圧縮・出力|
| npm run php-server       |PHP のビルトインサーバを起動|

## オプション

| コマンド                     | 説明                                             |
|:-----------------------------|:-------------------------------------------------|
| --coding                     |`webpack` を実行しない                            |
| --scripting                  |`pug` `stylus` `sprite` を実行しない              |
| --viewing-update             |表示中のファイルのみトランスパイル                |
| --viewing-update-pug         |`pug` は表示中ファイルのみトランスパイル          |
| --viewing-update-pug-factory |`pug-factory` は表示中のファイルのみトランスパイル|
| --viewing-update-stylus      |`stylus` は表示中のファイルのみトランスパイル     |
| --viewing-update-webpack     |`webpack` は表示中のファイルのみトランスパイル    |
| --php                        |サーバに PHP のビルトインサーバを使用 <br> ※ `php-server` で PHP のビルトインサーバ起動が必要|

タスクコマンドの後に追加して使用
```bash
# 例
$ npm run build -- --coding
```



# Local Server
ローカルサーバは [BrowserSync](https://www.browsersync.io/) を使用  
※PHP 使用時は PHP ビルトインサーバと連携

### ポート
- 3000 -> `htdocs/` をルートとしてサイトを表示
- 3001 -> BrowserSync のコントロールパネルを表示
- 3002 -> `.url-list/` をルートとして URL 一覧を表示



# HTML
[pug](https://pugjs.org/) を使用
`pug/src/` 以下の pug ファイルをトランスパイルし `htdocs/` に出力

## Members

| メンバ・メソッド | 説明              |
|:-----------------|:------------------|
| isProduction     | production フラグ |
| basedir          | ルート            |
| dirname          | ディレクトリ      |
| join([...paths]) | パス結合          |
| relative(path)   | 相対パス          |

## [Filters](https://pugjs.org/language/filters.html)

| filters名  | 説明                                                 |
|:-----------|:-----------------------------------------------------|
| do-nothing | そのまま出力（先頭は改行、インデントオプションあり） |

### do-nothing のインデントオプション
`{{indent=[数値]}}` を追加することで数値の数だけスペースを追加される

```pug
//- 例
:do-nothing
  {{indent=2}}
  <div>
    <p>sample</p>
  </div>
```

## Factory
テンプレート（pug）とデータ（json）からファイルを生成し `htdocs/` に出力

### テンプレートファイル
`pug/factory/` 以下の pug ファイル  
※ファイル内の `{{vars}}` が json のデータに置き換えられる

### データファイル
`pug/factory/` 以下の json ファイル

```javascript
// 例
{ "factory/index": {  // 使用するテンプレートを指定

  "fac/index": {  // 出力先のパスを指定
    "factoryTitle": "タイトル1",  // key が変数名、value が 値として出力
    "factoryContents": "コンテンツ1"
  },
  "fac/hoge/index": {
    "factoryTitle": "タイトル2",
    "factoryContents": "コンテンツ2<br>コンテンツ2"
  }

}}
```



# CSS
[Stylus](http://stylus-lang.com/) でトランスパイル  
`stylus/src/` 以下の stylus ファイルをトランスパイルし `htdocs/` に出力



# Image

## Sprite
`images/sprite/` 以下の画像をスプライト化して `htdocs/` に出力  
最終ディレクトリ名がファイル名になる

> 例  
`images/sprite/images/sample/a.png`  
`images/sprite/images/sample/b.png`  
↓  
`htdocs/images/sample.png`

Stylus で使用する為に `stylus/imports/sprite.styl` を出力  
[mixins](http://stylus-lang.com/docs/mixins.html) を import して使用

```stylus
// 例
@import "stylus/imports/sprite"
#a
  sprite("images/sample/a.png")  // スプライト化する前のフィアルパスを指定
#b
  sprite("images/sample/b.png")
```

## Image Minify
`images/minify/` 以下の画像を圧縮して `htdocs/` に出力  



# JavaScript
[Babel](https://babeljs.io/)（[es2015](https://babeljs.io/docs/plugins/preset-es2015/), [stage-0](https://babeljs.io/docs/plugins/preset-stage-0/)）または [CoffeeScript](http://coffeescript.org/) でトランスパイルし [webpack](https://webpack.js.org/) でバンドル  
`webpack/src/` 以下の js ファイルをトランスパイルし `htdocs/` に出力

デフォルトは Babel  
変更する場合は `task-config.js` の以下を更新
```js
    transcompiler: 'babel',  // ['babel', 'coffee']
```

## webpack
パッケージマネージャーに [npm](https://www.npmjs.com/) を使用



# URL List
3002 ポートにURL一覧を表示

`.url-list/index.tmp` にファイル一覧データを追加して `.url-list/index.html` を出力

テストサーバー等へリンクさせる場合は `.url-list/index.tmp` の以下を更新
```js
const root = 'http://domain.com/';
```



# Clean
不要ファイル削除  
変更する場合は `task-config.js` の以下を更新
```js
  deletes: [
    'htdocs/**/.DS_Store', 'htdocs/**/Thumb.db', 'htdocs/**/*.map',
  ],
```
