# Contribution Guide

以下の技術要素を使っています。

- [Vue 3.x](https://github.com/vuejs/vue-next)
- TypeScript 4.x
- [TailwindCSS](https://tailwindcss.com/)
- Firebase

## ライブラリのインストール

```
$ yarn install
```

## Vite でローカル起動して動作確認する

[Vite](https://github.com/vitejs/vite) でビルドしています。

```
$ yarn dev
```

## Firebase Local Emulators (beta) を使った動作確認

[Local Emulator Suite のインストール、構成、統合](https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=ja) に記載された内容とほぼ同様ですが、
一部 TypeScript のコンパイルが必要なため手順を書いておきます。

まず、 `firebase-tools` をインストールします。

```
$ npm install -g firebase-tools
```

次に、 `functions/` ディレクトリに移動し、 TypeScript のコードをコンパイルします。

```
$ cd functions/
$ npm install
$ npm run build
```

プロジェクトのルートディレクトリに戻り、 Vue アプリケーションのビルドを実行します。

```
$ cd ../
$ yarn build
```

エミュレーターを起動します。

```
$ firebase emulators:start
```

起動したら、 `http://localhost:5000` へアクセスして動作確認を行います。

### ソースコードの更新時

Vue アプリケーションの更新時は `yarn build` を、 `functions` の更新時は `npm run build` を実行すると反映されます。
エミュレーターの再起動は不要です。（再起動するとエミュレーター内の firestore のデータが消えます。）

## Firebase へのデプロイ

TBD. Github Actions で行う予定。

## issue の追加

バグや気づいた点、要望などがあれば issue へどうぞ。

## Pull-Request

お待ちしております。
