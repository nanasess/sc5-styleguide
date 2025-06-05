# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

SC5 Styleguideは、KSS記法を使用してCSS/SCSS/LESSスタイルシートからインタラクティブなスタイルガイドを生成するツールです。Node.jsツールとAngular.jsフロントエンドで構成され、リアルタイム変数編集とライブプレビューをサポートしています。

## 開発コマンド

### ビルドとテスト
- `npm run build` - プロダクションビルド（`gulp build`を実行）
- `npm run test` - 全テストの実行（ユニット、インテグレーション、e2e）
- `npm run test:unit` - Mochaによるユニットテスト
- `npm run test:integration` - Mochaによるインテグレーションテスト
- `npm run test:e2e` - Playwrightによるエンドツーエンドテスト（デモサーバーの起動が必要）
- `npm run demo` - ポート3000でファイル監視付きデモサーバーを起動

### 開発ワークフロー
- `gulp dev` - ライブリロード付き開発サーバー
- `gulp watch` - ファイル監視と変更時の自動リビルド
- `gulp build` - 配布用のクリーンビルド

### リンティング
- JavaScript リンティングにはテスト環境でJSHintを使用
- TypeScriptはCommonJSモジュールを使用してES5にコンパイル

## アーキテクチャ

### コアコンポーネント
- **メインAPI**: `lib/styleguide.js` - `generate()`と`applyStyles()`関数を持つ主要ライブラリ
- **CLIツール**: `bin/styleguide` - コマンドラインインターフェース
- **サーバー**: `lib/server.js` - リアルタイム更新用のSocket.ioを含むExpressサーバー
- **フロントエンド**: `lib/app/` - スタイルガイドUI用のAngular.jsアプリケーション

### 主要モジュール
- **パーサー**: `lib/modules/parsers/` - SCSS、LESS、PostCSS変数パーシング
- **KSS処理**: `lib/modules/kss-parser.js` - KSS形式のCSSコメントをパース
- **変数パーサー**: `lib/modules/variable-parser.js` - CSS変数の抽出と処理
- **Angular統合**: `lib/app/js/` - TypeScriptコントローラー、ディレクティブ、サービス

### ビルドシステム
- **Gulp 4.x**: メインビルドオーケストレーション
- **TypeScript**: ES5ターゲット、CommonJSモジュール
- **PostCSS**: 変数処理、ネスト、autoprefixer
- **Babel**: ES2015+トランスパイル

## テスト戦略

### ユニットテスト（`test/unit/`）
- ChaiアサーションでMochaを使用
- 個別モジュールの分離テスト
- パーサー、ユーティリティ、コアロジックに焦点

### インテグレーションテスト（`test/integration/`）
- エンドツーエンドライブラリ機能
- テンプレート処理と出力検証
- 設定ハンドリング

### E2Eテスト（`test/e2e/`）
- ChromiumでPlaywright使用
- スタイルガイドUIのフルブラウザテスト
- テスト中はlocalhost:3000でサーバーが動作

## 主要機能

### KSSドキュメンテーション
- コンポーネントドキュメント用のKSS形式CSSコメントをパース
- Angularディレクティブ埋め込み付きマークアップ例をサポート
- 自動セクション階層とナビゲーション

### 変数編集
- ブラウザインターフェースでのSCSS/LESS変数のライブ編集
- Socket.io経由のリアルタイムプレビュー更新
- 変数検証と型検出

### 複数プリプロセッサー
- PostCSS経由のSCSS/Sassサポート
- LESSパーサー統合
- モダンCSS機能用PostCSS

### Angular統合
- スタイル例にAngularディレクティブを埋め込み
- Shadow DOMコンポーネント分離（設定可能）
- パフォーマンス向上のための遅延読み込みコンポーネント

## 設定

### スタイルガイド設定（`styleguide_config.json`）
- 出力ディレクトリとファイル構造
- CSS/JSインクルードパス
- Angularアプリ設定
- カスタムCSSプロセッサー

### TypeScript設定
- ES5コンパイルターゲット
- CommonJSモジュールシステム
- DOMとES2015ライブラリサポート

## 重要なファイル位置

- `lib/styleguide.js` - `generate()`と`applyStyles()`関数を持つメインライブラリAPI
- `lib/app/js/app.ts` - Angularアプリケーションエントリーポイント
- `lib/server.js` - リアルタイム更新用のSocket.ioを含むExpressサーバー
- `bin/styleguide` - CLIエントリーポイント
- `gulpfile.babel.js` - 主要ビルド設定
- `gulpfile-tests.babel.js` - テストタスク定義
- `demo-gulpfile.js` - デモプロジェクトビルド設定
- `test/projects/` - 異なるプリプロセッサーテスト用サンプルプロジェクト
- `lib/dist/` - ビルド出力ディレクトリ（自動生成、直接編集禁止）
- `demo-output/` - デモサーバー出力（自動生成、直接編集禁止）

## 開発ガイドライン

### ファイル編集制限
以下のファイル/ディレクトリは自動生成されており、直接編集してはいけません：
- `lib/app/js/components/` - 生成されたAngularコンポーネント
- `lib/dist/` - ビルド成果物
- `demo-output/` - デモサーバー出力

### テスト要件
- すべてのテストはNode.js v22.14.0で合格する必要があります
- E2Eテストは`npm run test:e2e`実行前にデモサーバーの起動（`npm run demo`）が必要
- デモサーバーはデフォルトでlocalhost:3000で動作
- PlaywrightはE2Eテスト用にデモサーバーを自動起動するよう設定済み

### タスク完了後にプロンプトの内容を保存

- タスクが完了したら、[.github/prompts](.github/prompts) 以下に `YYYYMMhhmm.md` というファイル名で、プロンプトの履歴を保存してください。

## AngularJSからAngularへのマイグレーションプラン

### 現在の状態分析
- **AngularJSバージョン**: 1.8.3（最新のAngularJS）
- **TypeScript**: メインアプリケーションファイルで既に実装済み
- **ルーター**: UI-Router 1.0.30
- **依存関係**: ngAnimate、colorpicker.module、hljs、LocalStorageModule、oc.lazyLoad、ngProgress、rt.debounce、duScroll
- **アーキテクチャ**: サービス、コントローラー、ディレクティブを使用したコンポーネントベース

### マイグレーション進捗状況（2025年6月5日更新）
- **フェーズ1**: ✅ 完了 - Angular 11の基本設定とハイブリッドアプリケーションの構築
- **フェーズ2.1**: ✅ 完了 - コアサービス（Socket、Styleguide、Variables）のAngular移行
- **フェーズ2.2**: ✅ 完了 - シンプルディレクティブ（hljs-init、rootCssClass、variable）のAngular移行
- **フェーズ2.3**: ✅ 完了 - 複雑コンポーネント（design、section、shadowDom、dynamicCompile）のAngular移行
- **フェーズ2.4**: ✅ 完了 - コントローラー（MainCtrl、SectionsCtrl、VariablesCtrl、AppCtrl）のAngular移行
- **現在のステータス**: 主要フロントエンドコンポーネントの完全Angular移行が完了
- **次のステップ**: UI-RouterからAngular Routerへの移行（オプション）またはAngularJS依存関係の完全削除

### フェーズ1: Angularマイグレーション準備
**目標**: Angular 11.2.14へのマイグレーション（ngUpgrade最適化バージョン、最高の安定性）

#### ステップ1.1: ビルドシステム更新
- [x] Angular CLI 11.2.19をインストールしangular.json設定を作成
- [x] TypeScriptを4.1.6に調整（Angular 11要件）
- [ ] ハイブリッドアプリサポート用webpackを設定
- [x] Angularビルドプロセス用package.jsonスクリプトを更新

#### ステップ1.2: Angularとマイグレーション依存関係のインストール
- [x] `@angular/core@11.2.14`、`@angular/common@11.2.14`、`@angular/platform-browser@11.2.14`をインストール
- [x] ハイブリッドアプリサポート用`@angular/upgrade@11.2.14`をインストール
- [x] UI-Router置き換え用`@angular/router@11.2.14`をインストール
- [x] Angular変更検出用`zone.js@0.11.8`をインストール

#### ステップ1.3: ハイブリッドアプリケーションブートストラップ作成
- [x] Angularブートストラップ用main.tsを作成
- [x] AngularJSとAngularの両方を実行するハイブリッドアプリモジュールを実装
- [x] AngularJS使用向けAngularコンポーネントダウングレード用ngUpgradeを設定
- [x] デモ環境がエラーなしで起動することを確認

### フェーズ2: コンポーネントマイグレーション（一つずつアプローチ）
**目標**: 機能を維持しながら段階的にコンポーネントをマイグレーション

#### ステップ2.1: サービスマイグレーション優先
- [x] `Socket.ts`サービスをAngularサービスにマイグレーション
- [x] `Styleguide.ts`サービスをAngularサービスにマイグレーション
- [x] `Variables.ts`サービスをAngularサービスにマイグレーション
- [x] ハイブリッド環境でのサービス互換性をテスト

#### ステップ2.2: シンプルディレクティブマイグレーション
- [x] `hljs-init.ts`ディレクティブをAngularサービス（APP_INITIALIZER）にマイグレーション
- [x] `rootCssClass.ts`ディレクティブをAngularディレクティブにマイグレーション
- [x] `variable.ts`ディレクティブをAngularコンポーネントにマイグレーション
- [x] デモ環境でディレクティブ機能をテスト

#### ステップ2.3: 複雑コンポーネントマイグレーション
- [x] `design.ts`ディレクティブをAngularコンポーネントにマイグレーション
- [x] `section.ts`ディレクティブをAngularコンポーネントにマイグレーション
- [x] `shadowDom.ts`ディレクティブをAngularコンポーネント（ViewEncapsulation.ShadowDom）にマイグレーション
- [x] `dynamicCompile.ts`ディレクティブをAngularコンポーネント（DomSanitizer使用）にマイグレーション

#### ステップ2.4: コントローラーとルートマイグレーション
- [x] `MainCtrl`をAngularコンポーネント（MainComponent）にマイグレーション
- [x] `SectionsCtrl`をAngularコンポーネント（SectionsComponent）にマイグレーション
- [x] `VariablesCtrl`をAngularコンポーネント（VariablesPageComponent）にマイグレーション
- [x] `AppCtrl`をAngularコンポーネント（AppRootComponent）にマイグレーション
- [ ] UI-RouterをAngular Routerに置き換え（オプション - 現在UI-Routerとの互換性維持）
- [ ] Angular Router用ルート設定を更新（オプション）

### フェーズ3: 完全Angularマイグレーション
**目標**: AngularJS依存関係を完全に削除

#### ステップ3.1: AngularJS依存関係削除
- [ ] package.jsonからすべてのAngularJSパッケージを削除
- [ ] ngUpgradeとハイブリッドアプリ設定を削除
- [ ] 純粋Angularへビルドプロセスを更新
- [ ] 残存AngularJS固有コードを置き換え

#### ステップ3.2: モダンAngular機能実装
- [ ] Angularスタンドアロンコンポーネント（Angular 17+）を実装
- [ ] 状態管理にAngular Signalsを使用
- [ ] Angular Routerで遅延読み込みを実装
- [ ] SSR用Angular Universal追加（オプション）

#### ステップ3.3: 最終テストと最適化
- [ ] フルテストスイートを実行（ユニット、インテグレーション、e2e）
- [ ] パフォーマンステストと最適化
- [ ] Angularバージョン用ドキュメント更新
- [ ] デモ環境機能を検証

### マイグレーション必要依存関係
```json
{
  "@angular/core": "11.2.14",
  "@angular/common": "11.2.14", 
  "@angular/platform-browser": "11.2.14",
  "@angular/router": "11.2.14",
  "@angular/upgrade": "11.2.14",
  "@angular/cli": "11.2.19",
  "zone.js": "0.11.8",
  "typescript": "4.1.6"
}
```

### マイグレーション成果（2025年6月5日時点）

#### 完了したAngularコンポーネント・サービス・ディレクティブ
**サービス（フェーズ2.1）:**
- `SocketService` - Socket.ioラッパー、RxJS Observable使用
- `StyleguideService` - スタイルガイドデータ管理、HttpClient使用
- `VariablesService` - 変数状態管理、BehaviorSubject使用
- `HljsInitService` - highlight.js初期化、APP_INITIALIZER使用

**ディレクティブ・コンポーネント（フェーズ2.2-2.4）:**
- `RootCssClassDirective` - UI-Router状態に基づくCSSクラス管理
- `VariableComponent` - 変数値とカラーピッカー管理
- `DesignComponent` - スタイルガイドデザイン表示と変数管理
- `SectionComponent` - セクション表示とスクロール位置管理
- `ShadowDomComponent` - ViewEncapsulation.ShadowDomによるスタイル分離
- `DynamicCompileComponent` - DomSanitizerによる安全なHTML処理
- `MainComponent` - メインナビゲーションと検索制御
- `SectionsComponent` - セクション表示とページタイトル管理
- `VariablesPageComponent` - 変数関連セクション表示
- `AppRootComponent` - プログレスバー、スタイルリロード、ソケット管理

#### 技術的改善点
- **型安全性**: TypeScriptインターフェースによる完全な型定義
- **リアクティブプログラミング**: RxJS Observable/Subject パターンの全面採用
- **モダンAngular機能**: 
  - ViewEncapsulation.ShadowDom（モダンShadow DOM）
  - DomSanitizer（XSS防止）
  - APP_INITIALIZER（アプリケーション初期化）
  - downgradeComponent/downgradeInjectable（ハイブリッド互換性）
- **パフォーマンス**: Change Detection最適化、debounceTime使用
- **セキュリティ**: 安全なHTML処理、XSS防止

#### ハイブリッドアプリケーションアーキテクチャ
```
AngularJS (レガシー)          Angular 11 (新規)
├─ UI-Router                 ├─ Services
├─ 一部のサービス             │  ├─ SocketService
├─ テンプレート               │  ├─ StyleguideService
└─ 設定                     │  ├─ VariablesService
                            │  └─ HljsInitService
                            ├─ Components
                            │  ├─ MainComponent
                            │  ├─ SectionsComponent
                            │  ├─ DesignComponent
                            │  ├─ SectionComponent
                            │  ├─ VariableComponent
                            │  ├─ VariablesPageComponent
                            │  ├─ ShadowDomComponent
                            │  ├─ DynamicCompileComponent
                            │  └─ AppRootComponent
                            └─ Directives
                               └─ RootCssClassDirective

↑ downgradeComponent/downgradeInjectableによる完全相互運用
```

#### テスト結果
- **E2Eテスト**: 全8テスト合格（100%成功率）
- **デモ環境**: localhost:3000で完全動作
- **機能**: 全ての既存機能が正常動作（検索、ナビゲーション、変数編集等）
- **互換性**: AngularJSとAngularのシームレスな相互運用

### 注意事項
- 各フェーズはデモ環境機能を維持する必要があります
- 各主要ステップ後のテストは必須です
- ロールバック戦略：各マイグレーションフェーズ用gitブランチ
- リスク最小化のため2-3回の段階的マイグレーションを検討