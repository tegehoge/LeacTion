# Contribution Guide

LeacTion では以下の技術要素を使っています。

- [SolidJS 1.x](https://www.solidjs.com/)
- TypeScript 4.x
- [TailwindCSS](https://tailwindcss.com/)
- Firebase

## ライブラリのインストール

```
$ yarn install
```

## Firebase Local Emulators (beta) を使った動作確認

`.env.emulator` を準備します。設定する値についてはFirebaseの設定を確認するか、開発者に問い合わせてください。

```.env.emulator
VITE_API_KEY=
VITE_APP_ID=
VITE_AUTH_DOMAIN=
VITE_DATABASE_URL=
VITE_MESSAGING_SENDER_ID=
VITE_MEASUREMENT_ID=
VITE_PROJECT_ID=
VITE_STORAGE_BUCKET=
NODE_ENV=production
```

次に、 `functions/` のコードをコンパイルします。

```
$ yarn build:functions
```

プロジェクトのルートディレクトリに戻り、 `emulator` モードで Solid アプリケーションのビルドを実行します。

```
$ yarn build:emulators
```

エミュレーターを起動します。

```
$ yarn firebase:emulators:start
```

起動したら、 `http://localhost:5500/` へアクセスして動作確認を行います。

### ソースコードの更新時

Solid アプリケーションの更新時は `yarn build:emulators` を、 `functions` の更新時は `yarn build:functions` を実行すると反映されます。
エミュレーターの再起動は不要です。

積極的に開発するタイミングでは以下のコマンドでファイルの変更を監視しながらビルドを行うのが便利です。

```
$ yarn build:emulators:watch
```

## Firebase へのデプロイ

`main` ブランチにマージされると Github Actions で自動的にビルド＆デプロイが実行されます。
原則として手動では行わない予定です。

## issue の追加

バグや気づいた点、要望などがあれば issue へどうぞ。

## Pull-Request

お待ちしております。
