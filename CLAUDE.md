# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- 日本語で回答してください
- タスクが完了したら関連する issue を更新してください

## SC5 Styleguide プロジェクト概要

KSSベースのスタイルガイドジェネレーターです。Node.js v22への移行と、AngularJS 1.8.3からAngularへの移行を進めています。

## 開発コマンド

### ビルドとテスト
```bash
# ビルド
npm run build

# 開発サーバー起動（デモ）
npm run demo

# テスト実行
npm run test:unit        # ユニットテスト
npm run test:integration # 統合テスト
npm run test:e2e        # E2Eテスト（Playwright）
npm run test            # 全テスト実行

# デモのクリーンアップ
npm run demo:cleanup

# 依存関係チェック
npm run depcheck
```

## アーキテクチャ

### コア構造
- `lib/styleguide.js` - メインエントリーポイント
- `lib/modules/` - パーサー、プロセッサー、ユーティリティ
- `lib/server.js` - 開発サーバー
- `lib/app/` - フロントエンドAngularJSアプリケーション（TypeScript移行中）

### ビルドシステム
- Gulp 4.xベース（`gulpfile.babel.js`）
- TypeScriptコンパイル（tsconfig.json）
- PostCSSでCSS処理
- vendor.jsとapp.jsの分離バンドル

### 重要な開発ルール

1. **生成ファイルは直接編集しない**
   - `lib/app/js/components/`
   - `lib/dist/`
   - `demo-output/`

2. **パッケージ更新時の注意**
   - overridesの使用は最小限に
   - 可能な限り依存関係を最新に移行
   - パッケージ移行後は必ずテストを実行

3. **セキュリティ優先事項**
   - minimatch、core-js、socket.io、expressの脆弱性対応
   - inflightパッケージのメモリリーク修正
   - 非推奨パッケージ（request、gulp-util）の置き換え

4. **開発プロンプトの保存**
   - 重要なプロンプトは `.github/prompts/` に保存
   - ファイル名形式: `YYYYMMDDHHMMSS.md`

## Node.js v22対応状況

このプロジェクトはNode.js v22への完全対応を目指しています。依存関係の更新と非推奨パッケージの置き換えを進めてください。
