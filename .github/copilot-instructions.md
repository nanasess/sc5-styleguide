## 概要

- 日本語でやりとりをお願いします。
- このプロジェクトは2018年までメンテされていましたが、現在はメンテされていません。
- 最新の node v22 で動作することを目指します。
- node v22 で動作しないパッケージは、別のパッケージに代替するか、最新バージョンにマイグレーションします
- node v22.14.0 で `npm run demo` が成功し、ブラウザでスタイルガイドの表示を確認済みです。
- タスクが完了したら、[.github/prompts](.github/prompts) 以下に `YYYYMMhhmm.md` というファイル名で、プロンプトの履歴を保存してください。

## テストの実施

### ユニットテスト及びインテグレーションテスト

`npm run test` でテストを実行します。

- node v22.14.0 ですべてのテストが成功することを確認済みです。
- パッケージをマイグレーションした後は、 `npm run test` でテストが成功することを確認してください
- `npm run test` に失敗した場合は、テストが成功するようテストケースを修正してください

### E2Eテスト

`npm run demo` でデモ環境を起動したあと、
`npm run test:e2e` で実行します。

- node v22.14.0 ですべてのテストが成功することを確認済みです。
- パッケージをマイグレーションした後は、 `npm run test:e2e` でテストが成功することを確認してください
- `npm run test:e2e` に失敗した場合は、テストが成功するようテストケースを修正してください

## node.js のバージョン切替

`n` コマンドを利用して、バージョン切替が可能です。

``` shell
sudo n <version>
```

現在は以下のバージョンがインストール可能です。

node/6.9.5
node/8.17.0
node/12.22.12
node/14.21.3
node/16.20.2
node/22.14.0

*`n` コマンドがインストールされていない場合は `npm install -g n` でインストールしてください。*

## TODO

- デモ環境(`npm run demo` で起動する環境)の AngularJS から Angular へのマイグレーション
  - [X] JavaScript を TypeScript へマイグレーション
  - [ ] コンポーネントディレクティブの使用
  - [ ] ngUpgrade の導入
  - [ ] ハイブリッドアプリケーションへのマイグレーション
  - [ ] Angular2.0 へのマイグレーション
  - [ ] Angular19 へのマイグレーション

AngularJS から Angular へのマイグレーションベストプラクティスは以下にあります
@https://v17.angular.io/guide/upgrade

nanasess: npm install を実行すると以下の warning が発生します。
対応の優先順位をつけてください

npm warn deprecated try-resolve@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated natives@1.1.6: This module relies on Node.js's internals and will break at some point. Do not use it, and update to graceful-fs@4.x.
npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
npm warn deprecated lodash.template@2.4.1: This package is deprecated. Use https://socket.dev/npm/package/eta instead.
npm warn deprecated lodash.template@2.4.1: This package is deprecated. Use https://socket.dev/npm/package/eta instead.
npm warn deprecated lodash.template@2.4.1: This package is deprecated. Use https://socket.dev/npm/package/eta instead.
npm warn deprecated lodash.template@2.4.1: This package is deprecated. Use https://socket.dev/npm/package/eta instead.
npm warn deprecated babel-plugin-undefined-to-void@1.1.6: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-remove-console@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-react-display-name@1.0.3: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-proto-to-assign@1.0.4: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-react-constant-elements@1.0.3: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-property-literals@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-jscript@1.0.4: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-member-expression-literals@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-eval@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-remove-debugger@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-inline-environment-variables@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-dead-code-elimination@1.0.2: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated babel-plugin-constant-folding@1.0.1: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated source-map-url@0.4.1: See https://github.com/lydell/source-map-url#deprecated
npm warn deprecated flatten@1.0.3: flatten is deprecated in favor of utility frameworks such as lodash.
npm warn deprecated stable@0.1.8: Modern JS already guarantees Array#sort() is a stable sort, so this library is deprecated. See the compatibility table on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort#browser_compatibility
npm warn deprecated lodash.template@3.6.2: This package is deprecated. Use https://socket.dev/npm/package/eta instead.
npm warn deprecated read-package-json@2.1.2: This package is no longer supported. Please use @npmcli/package-json instead.
npm warn deprecated babel-plugin-runtime@1.0.7: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
npm warn deprecated rimraf@2.6.3: Rimraf versions prior to v4 are no longer supported
npm warn deprecated trim@0.0.1: Use String.prototype.trim() instead
npm warn deprecated urix@0.1.0: Please see https://github.com/lydell/urix#deprecated
npm warn deprecated har-validator@5.1.5: this library is no longer supported
npm warn deprecated postcss-partial-import@1.3.0: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated gulp-jscs@3.0.2: JSCS is deprecated. Switch to ESLint.
npm warn deprecated to-iso-string@0.0.2: to-iso-string has been deprecated, use @segment/to-iso-string instead.
npm warn deprecated cryptiles@2.0.5: This version has been deprecated in accordance with the hapi support policy (hapi.im/support). Please upgrade to the latest version to get the best features, bug fixes, and security patches. If you are unable to upgrade at this time, paid support is available for older versions (hapi.im/commercial).
npm warn deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm warn deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm warn deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm warn deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm warn deprecated resolve-url@0.2.1: https://github.com/lydell/resolve-url#deprecated
npm warn deprecated fs-promise@0.3.1: Use mz or fs-extra^3.0 with Promise Support
npm warn deprecated graceful-fs@1.2.3: please upgrade to graceful-fs 4 for compatibility with current and future versions of Node.js
npm warn deprecated browserslist@1.7.7: Browserslist 2 could fail on reading Browserslist >3.0 config used in other tools.
npm warn deprecated json3@3.3.2: Please use the native JSON object instead of JSON 3
npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@6.0.4: Glob versions prior to v9 are no longer supported
npm warn deprecated graceful-fs@2.0.3: please upgrade to graceful-fs 4 for compatibility with current and future versions of Node.js
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@6.0.4: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@4.5.3: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@6.0.4: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated glob@5.0.15: Glob versions prior to v9 are no longer supported
npm warn deprecated graceful-fs@2.0.3: please upgrade to graceful-fs 4 for compatibility with current and future versions of Node.js
npm warn deprecated formatio@1.1.1: This package is unmaintained. Use @sinonjs/formatio instead
npm warn deprecated source-map-resolve@0.5.3: See https://github.com/lydell/source-map-resolve#deprecated
npm warn deprecated samsam@1.1.2: This package has been deprecated in favour of @sinonjs/samsam
npm warn deprecated glob@7.1.1: Glob versions prior to v9 are no longer supported
npm warn deprecated pkg-resolve@0.1.14: Not maintained anymore.
npm warn deprecated q@1.4.1: You or someone you depend on is using Q, the JavaScript Promise library that gave JavaScript developers strong feelings about promises. They can almost certainly migrate to the native JavaScript promise now. Thank you literally everyone for joining me in this bet against the odds. Be excellent to each other.
npm warn deprecated
npm warn deprecated (For a CapTP with native promises, see @endo/eventual-send and @endo/captp)
npm warn deprecated sane@1.7.0: some dependency vulnerabilities fixed, support for node < 10 dropped, and newer ECMAScript syntax/features added
npm warn deprecated gulp-util@3.0.8: gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5
npm warn deprecated gulp-util@3.0.7: gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5
npm warn deprecated jscs-preset-wikimedia@1.0.1: No longer maintained. We recomment migrating to ESLint with eslint-config-wikimedia.
npm warn deprecated boom@2.10.1: This version has been deprecated in accordance with the hapi support policy (hapi.im/support). Please upgrade to the latest version to get the best features, bug fixes, and security patches. If you are unable to upgrade at this time, paid support is available for older versions (hapi.im/commercial).
npm warn deprecated dependency-check@2.5.3: dependency-check has been deprecated in favor of the knip module
npm warn deprecated minimatch@0.2.14: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm warn deprecated minimatch@0.3.0: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
npm warn deprecated sntp@1.0.9: This module moved to @hapi/sntp. Please make sure to switch over as this distribution is no longer supported and may contain bugs and critical security issues.
npm warn deprecated nomnom@1.8.1: Package no longer supported. Contact support@npmjs.com for more info.
npm warn deprecated rcloader@0.2.2: Package no longer supported. Contact Support at https://www.npmjs.com/support for more info.
npm warn deprecated mkdirp@0.3.0: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)
npm warn deprecated uuid@1.4.2: Please upgrade to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm warn deprecated uuid@2.0.3: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm warn deprecated gulp-util@2.2.20: gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5
npm warn deprecated gulp-util@2.2.20: gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5
npm warn deprecated gulp-util@2.2.20: gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5
npm warn deprecated gulp-util@2.2.20: gulp-util is deprecated - replace it, following the guidelines at https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5
npm warn deprecated uuid@3.4.0: Please upgrade  to version 7 or higher.  Older versions may use Math.random() in certain circumstances, which is known to be problematic.  See https://v8.dev/blog/math-random for details.
npm warn deprecated glob@3.1.21: Glob versions prior to v9 are no longer supported
npm warn deprecated har-validator@2.0.6: this library is no longer supported
npm warn deprecated hoek@2.16.3: This version has been deprecated in accordance with the hapi support policy (hapi.im/support). Please upgrade to the latest version to get the best features, bug fixes, and security patches. If you are unable to upgrade at this time, paid support is available for older versions (hapi.im/commercial).
npm warn deprecated mkdirp@0.5.1: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)
npm warn deprecated mkdirp@0.5.1: Legacy versions of mkdirp are no longer supported. Please update to mkdirp 1.x. (Note that the API surface has changed to use Promises in 1.x.)
npm warn deprecated glob@3.2.11: Glob versions prior to v9 are no longer supported
npm warn deprecated request@2.79.0: request has been deprecated, see https://github.com/request/request/issues/3142
npm warn deprecated request@2.88.2: request has been deprecated, see https://github.com/request/request/issues/3142
npm warn deprecated wrench@1.5.9: wrench.js is deprecated! You should check out fs-extra (https://github.com/jprichardson/node-fs-extra) for any operations you were using wrench for. Thanks for all the usage over the years.
npm warn deprecated json3@3.2.6: Please use the native JSON object instead of JSON 3
npm warn deprecated hawk@3.1.3: This module moved to @hapi/hawk. Please make sure to switch over as this distribution is no longer supported and may contain bugs and critical security issues.
npm warn deprecated jade@0.26.3: Jade has been renamed to pug, please install the latest version of pug instead of jade
npm warn deprecated istanbul@0.3.22: This module is no longer maintained, try this instead:
npm warn deprecated   npm i nyc
npm warn deprecated Visit https://istanbul.js.org/integrations for other alternatives.
npm warn deprecated istanbul@0.4.5: This module is no longer maintained, try this instead:
npm warn deprecated   npm i nyc
npm warn deprecated Visit https://istanbul.js.org/integrations for other alternatives.
npm warn deprecated sinon@1.17.7: 16.1.1
npm warn deprecated jscs@2.6.0: JSCS has merged with ESLint! See - https://medium.com/@markelog/jscs-end-of-the-line-bc9bf0b3fdb2
npm warn deprecated core-js@1.2.7: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.
npm warn deprecated core-js@1.2.7: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.
npm warn deprecated core-js@1.2.7: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.
npm warn deprecated core-js@2.6.12: core-js@<3.23.3 is no longer maintained and not recommended for usage due to the number of issues. Because of the V8 engine whims, feature detection in old core-js versions could cause a slowdown up to 100x even if nothing is polyfilled. Some versions have web compatibility issues. Please, upgrade your dependencies to the actual version of core-js.

GitHub Copilot: # npm警告の優先順位づけ

ご提示いただいた多数のnpm警告について、以下の基準で優先順位をつけました：

1. **高優先度**: セキュリティリスク、重大なバグ、パフォーマンス問題を含むもの
2. **中優先度**: 現在も広く使われているが更新が必要なパッケージ
3. **低優先度**: 単純に非推奨となったパッケージで、すぐに問題になるとは限らないもの

## 高優先度（すぐに対応すべき）

1. **minimatch の古いバージョン**: RegExp DoS脆弱性 (`minimatch@0.2.14`, `minimatch@0.3.0`, `minimatch@2.0.10`)
   ```
   npm warn deprecated minimatch@2.0.10: Please update to minimatch 3.0.2 or higher to avoid a RegExp DoS issue
   ```

2. **core-js の古いバージョン**: 著しいパフォーマンス低下を引き起こす可能性 (`core-js@1.2.7`, `core-js@2.6.12`)
   ```
   npm warn deprecated core-js@<3.23.3: could cause a slowdown up to 100x even if nothing is polyfilled
   ```

3. **inflight**: メモリリークの問題あり
   ```
   npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory.
   ```

4. **natives**: Node.jsの内部APIに依存しており、将来的に動作しなくなる
   ```
   npm warn deprecated natives@1.1.6: This module relies on Node.js's internals and will break at some point.
   ```

## 中優先度（計画的に更新すべき）

1. **rimraf の古いバージョン**: 広く使用されているファイル削除ユーティリティ
   ```
   npm warn deprecated rimraf@2.7.1: Rimraf versions prior to v4 are no longer supported
   ```

2. **uuid の古いバージョン**: `Math.random()`を使用していてセキュリティ上の懸念あり
   ```
   npm warn deprecated uuid@1.4.2, uuid@2.0.3, uuid@3.4.0: Please upgrade to version 7 or higher
   ```

3. **glob の古いバージョン**: ファイルマッチングに使用される基本的なツール
   ```
   npm warn deprecated glob@7.2.3, glob@5.0.15, etc.: Glob versions prior to v9 are no longer supported
   ```

4. **request**: 非推奨で今後更新されない
   ```
   npm warn deprecated request@2.79.0, request@2.88.2: request has been deprecated
   ```

5. **graceful-fs の古いバージョン**: ファイルシステム処理の基本パッケージ
   ```
   npm warn deprecated graceful-fs@1.2.3, graceful-fs@2.0.3: please upgrade to graceful-fs 4
   ```

## 低優先度（時間がある時に対応）

1. **gulp-util**: 非推奨だが、一般的に即時の問題は起きない
   ```
   npm warn deprecated gulp-util@3.0.8, gulp-util@3.0.7, gulp-util@2.2.20: gulp-util is deprecated
   ```

2. **jscs, jscs-preset-wikimedia**: ESLintに移行することが推奨されている
   ```
   npm warn deprecated jscs@2.6.0: JSCS has merged with ESLint!
   ```

3. **babel プラグイン関連**: 多数のbabelプラグイン (`babel-plugin-*`) が非推奨
   ```
   npm warn deprecated babel-plugin-undefined-to-void@1.1.6, etc.: Package no longer supported.
   ```

4. **lodash.template**: 代替パッケージへの移行が推奨されている
   ```
   npm warn deprecated lodash.template@2.4.1, lodash.template@3.6.2: Use https://socket.dev/npm/package/eta instead.
   ```

5. **その他の非推奨ユーティリティ**: `mkdirp`, `wrench`, `q`, `flatten` など多数

## 全体の対応方針

1. まず、セキュリティやメモリリークに関する高優先度の問題を解決する
2. 次に、中優先度の基本的なユーティリティパッケージを更新する
3. プロジェクト全体を更新する計画を立て、依存関係を現代的なパッケージに移行する
   - 可能であれば、古いgulpベースのビルドシステムを現代的なものに置き換える
   - babelの設定を最新バージョンに合わせて更新する

プロジェクトが古くなっている兆候が多く見られます。パッケージ全体の更新プランを検討することをお勧めします。

nanasess: 対応方針を .github/copilot-instructions.md に追記してください

GitHub Copilot: すみませんが、添付ファイルが正しく読み込めませんでした。GitHubリポジトリの追加指示をcopilot-instructions.mdに追記するためには、次の情報が必要です：

1. 現在の`copilot-instructions.md`の内容
2. どのような対応方針を追記したいのか
3. 追記すべき具体的な内容

これらの情報をご提供いただければ、適切な形式で対応方針を追記する方法をご案内できます。

nanasess: 対応方針を .github/copilot-instructions.md に追記してください

GitHub Copilot: copilot-instructions.md ファイルに npm 警告への対応方針を追記します。以下のコードでファイルを更新します：

```instructions
## 概要

- 日本語でやりとりをお願いします。
- このプロジェクトは2018年までメンテされていましたが、現在はメンテされていません。
- 最新の node v22 で動作することを目指します。
- node v22 で動作しないパッケージは、別のパッケージに代替するか、最新バージョンにマイグレーションします
- node v22.14.0 で `npm run demo` が成功し、ブラウザでスタイルガイドの表示を確認済みです。
- タスクが完了したら、[.github/prompts](.github/prompts) 以下に `YYYYMMhhmm.md` というファイル名で、プロンプトの履歴を保存してください。

## テストの実施

### ユニットテスト及びインテグレーションテスト

`npm run test` でテストを実行します。

- node v22.14.0 ですべてのテストが成功することを確認済みです。
- パッケージをマイグレーションした後は、 `npm run test` でテストが成功することを確認してください
- `npm run test` に失敗した場合は、テストが成功するようテストケースを修正してください

### E2Eテスト

`npm run demo` でデモ環境を起動したあと、
`npm run test:e2e` で実行します。

- node v22.14.0 ですべてのテストが成功することを確認済みです。
- パッケージをマイグレーションした後は、 `npm run test:e2e` でテストが成功することを確認してください
- `npm run test:e2e` に失敗した場合は、テストが成功するようテストケースを修正してください

## node.js のバージョン切替

`n` コマンドを利用して、バージョン切替が可能です。

``` shell
sudo n <version>
```

現在は以下のバージョンがインストール可能です。

node/6.9.5
node/8.17.0
node/12.22.12
node/14.21.3
node/16.20.2
node/22.14.0

*`n` コマンドがインストールされていない場合は `npm install -g n` でインストールしてください。*

## npm警告対応方針

`npm install` 実行時に多数の警告が発生しています。以下は優先順位別の対応チェックリストです：

### 高優先度（セキュリティリスク/メモリリーク対応）

- [ ] **minimatch の古いバージョンの更新**
  - 対応内容: RegExp DoS脆弱性の修正のため、minimatch 3.0.2以上に更新
  - 影響: システムのセキュリティリスク
  - 関連パッケージ: `minimatch@0.2.14`, `minimatch@0.3.0`, `minimatch@2.0.10`

- [ ] **core-js の更新**
  - 対応内容: 著しいパフォーマンス低下の原因となるため、v3.23.3以上に更新
  - 影響: アプリケーション速度の大幅低下
  - 関連パッケージ: `core-js@1.2.7`, `core-js@2.6.12`

- [ ] **inflight パッケージのメモリリーク修正**
  - 対応内容: lru-cacheへの置き換え
  - 影響: メモリリークによるアプリケーション不安定化
  - 関連パッケージ: `inflight@1.0.6`

- [ ] **natives パッケージのNode.js内部APIへの依存対応**
  - 対応内容: graceful-fs@4.xに更新
  - 影響: Node.jsバージョン更新時に突然動作しなくなるリスク
  - 関連パッケージ: `natives@1.1.6`

### 中優先度（広く使用されるコアパッケージ）

- [ ] **rimraf の更新**
  - 対応内容: 最新バージョン(v4以上)へ更新
  - 影響: ビルドプロセスの安定性
  - 関連パッケージ: `rimraf@2.7.1`, `rimraf@2.6.3`

- [ ] **uuid パッケージの更新**
  - 対応内容: v7以上へ更新（Math.random()関連の脆弱性対策）
  - 影響: ID生成の予測可能性による潜在的なセキュリティリスク
  - 関連パッケージ: `uuid@1.4.2`, `uuid@2.0.3`, `uuid@3.4.0`

- [ ] **glob パッケージの更新**
  - 対応内容: v9以上に更新
  - 影響: ファイルマッチング機能の安定性
  - 関連パッケージ: `glob@7.2.3`, `glob@5.0.15`, `glob@6.0.4` など多数

- [ ] **graceful-fs の更新**
  - 対応内容: v4以上に更新
  - 影響: ファイルシステム操作の安定性
  - 関連パッケージ: `graceful-fs@1.2.3`, `graceful-fs@2.0.3`

- [ ] **request の代替**
  - 対応内容: メンテナンスされていないrequestパッケージの代替
  - 影響: HTTP通信の安定性
  - 関連パッケージ: `request@2.79.0`, `request@2.88.2`
  - 代替案: `node-fetch`, `axios`, `got` など

### 低優先度（機能に直接影響しないもの）

- [ ] **gulp-util から推奨代替パッケージへの移行**
  - 対応内容: Medium記事に従って代替パッケージへ移行
  - 影響: ビルドシステムの最新化
  - 関連パッケージ: 複数の `gulp-util` バージョン
  - 参考: https://medium.com/gulpjs/gulp-util-ca3b1f9f9ac5

- [ ] **babel プラグイン関連の更新**
  - 対応内容: 非推奨babelプラグインの最新代替へ更新
  - 影響: より良いJavaScriptコードの生成
  - 関連パッケージ: 多数の `babel-plugin-*`

- [ ] **コード整形・リント系ツールの更新**
  - 対応内容: JSCSからESLintへの移行
  - 影響: より良いコード品質管理
  - 関連パッケージ: `jscs@2.6.0`, `jscs-preset-wikimedia@1.0.1`

- [ ] **テスト関連パッケージの更新**
  - 対応内容: istanbulからnycへの移行など
  - 影響: テストカバレッジ測定の改善
  - 関連パッケージ: `istanbul@0.3.22`, `istanbul@0.4.5`, `sinon@1.17.7`

- [ ] **その他の非推奨ユーティリティの更新**
  - 対応内容: lodash.template, mkdirp, wrench等の最新代替へ更新
  - 影響: 将来的なメンテナンス性向上
  - 関連パッケージ: `lodash.template`, `mkdirp`, `wrench`, `trim` など多数

## TODO

- デモ環境(`npm run demo` で起動する環境)の AngularJS から Angular へのマイグレーション
  - [X] JavaScript を TypeScript へマイグレーション
  - [ ] コンポーネントディレクティブの使用
  - [ ] ngUpgrade の導入
  - [ ] ハイブリッドアプリケーションへのマイグレーション
  - [ ] Angular2.0 へのマイグレーション
  - [ ] Angular19 へのマイグレーション

AngularJS から Angular へのマイグレーションベストプラクティスは以下にあります
@https://v17.angular.io/guide/upgrade
```