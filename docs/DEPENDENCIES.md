# SC5 Styleguide 依存関係ドキュメント

## 概要
このドキュメントは、SC5 Styleguideプロジェクトの依存関係構造と、AngularJS 1.8.3からAngularへの移行に向けた現状を説明します。

## 主要依存関係

### フロントエンド（AngularJS 1.8.3）

#### コアフレームワーク
- `angular@1.8.3` - MVCフレームワーク
- `angular-animate@1.8.3` - アニメーション
- `angular-ui-router@1.0.30` - ルーティング

#### UIコンポーネント
- `angular-bootstrap-colorpicker@3.0.32` - カラーピッカー
- `angular-local-storage@0.7.1` - ローカルストレージ管理
- `ngprogress@1.1.3` - プログレスバー

#### ユーティリティ
- `angular-lazy-load@0.0.2` - 遅延ローディング
- `oc.lazyload@0.5.2` - モジュール遅延ローディング
- `angular-scroll@1.0.2` - スクロール制御
- `angular-debounce@1.1.0` - デバウンス処理

### ビルドツール

#### Gulp関連
- `gulp@4.0.2` - タスクランナー
- `gulp-babel@8.0.0` - ES6+ トランスパイル
- `gulp-concat@2.6.1` - ファイル結合
- `gulp-ng-annotate@2.1.0` - AngularJS DI アノテーション
- `gulp-postcss@10.0.0` - CSS処理
- `gulp-sass@5.1.0` - Sass コンパイル
- `gulp-webserver@0.9.1` - 開発サーバー（Node.js v22で互換性問題あり）

#### TypeScript
- `typescript@5.8.3` - TypeScriptコンパイラ
- `@types/angular@1.8.9` - AngularJS型定義
- `@types/angular-ui-router@1.1.40` - UI Router型定義

### 開発・テストツール

#### テストフレームワーク
- `mocha@10.9.0` - テストフレームワーク
- `chai@5.1.2` - アサーションライブラリ
- `@playwright/test@1.49.1` - E2Eテスト

#### コード品質
- `eslint@9.17.0` - JavaScript/TypeScript リンター
- `depcheck@1.4.7` - 未使用依存関係チェック

### 通信・データ処理
- `socket.io-client@4.8.1` - リアルタイム通信
- `highlight.js@9.18.5` - コードハイライト（アップグレード必要）
- `lodash@4.17.21` - ユーティリティライブラリ
- `marked@5.1.2` - Markdownパーサー

## 依存関係の問題点

### Node.js v22互換性問題
1. **gulp-webserver** - `open`パッケージのESM化により動作しない
   - 解決策: `gulp-connect`への移行または`gulp-webserver`の更新

### セキュリティ脆弱性
1. **highlight.js@9.18.5** - サポート終了
   - 解決策: v11.xへのアップグレード

### 非推奨パッケージ
1. **angular@1.8.3** - 公式サポート終了
   - 解決策: Angularへの段階的移行

## モジュール依存関係図

```
app.ts (sgApp)
├── Controllers
│   ├── appCtrl
│   ├── element
│   ├── main
│   ├── sections
│   └── variablesCtrl
├── Services
│   ├── Socket (socket.io-client依存)
│   ├── Styleguide (Socket依存)
│   └── Variables (Styleguide, Socket依存)
├── Directives
│   ├── design
│   ├── dynamicCompile
│   ├── hljs-init (highlight.js依存)
│   ├── rootCssClass
│   ├── section
│   ├── shadowDom
│   └── variable
└── Filters
    ├── addWrapper
    ├── unsafe
    ├── filterRelated
    ├── setModifierClass
    └── setVariables
```

## 移行に向けた準備状況

### 完了済み
- TypeScript化（大部分完了）
- 型定義の強化（interfaces.d.ts）
- モジュール構造の整理

### 進行中
- 依存関係の文書化
- Node.js v22対応

### 未着手
- Angularパッケージの導入
- ハイブリッドアプリケーション設定
- コンポーネント化

## 推奨される次のステップ

1. **gulp-webserver問題の解決**
   - 代替パッケージへの移行
   - またはNode.js v22対応の修正

2. **型定義の完全化**
   - 残存する`any`型の排除
   - 外部ライブラリの型定義追加

3. **Angular基盤の導入**
   - @angular/coreパッケージの追加
   - @angular/upgradeによるハイブリッド設定

## バージョン管理方針

- **メジャーバージョン**: Angular移行完了時
- **マイナーバージョン**: 機能追加・大規模リファクタリング
- **パッチバージョン**: バグ修正・小規模改善

---

最終更新: 2025年6月13日