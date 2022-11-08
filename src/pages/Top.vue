<script setup lang="ts"></script>

<template>
  <AppHeader />
  <div class="py-3 px-5 pt-8 mx-auto text-center text-gray-700 leading-7 max-w-3xl">
    <div class="p-3 mb-4 text-blue-700 text-lg font-semibold border-blue-700 border-2 rounded">
      「LeacTion!」は、勉強会やセミナーで発表者と参加者をつなぐ、<br />オンラインコメントツールです
    </div>
    <div class="mb-10">
      <router-link to="/new">
        <button
          class="w-full my-6 px-5 py-2 bg-blue-700 text-white text-lg font-semibold tracking-widest rounded"
        >
          イベントを登録する
        </button>
      </router-link>
    </div>
    <div class="py-10 mb-20 px-4 bg-blue-100 about">
      <img src="/images/baloon.png" class="w-24 mb-3 mx-auto" />
      <h2 class="mb-10 text-2xl font-semibold">LeacTion! とは？</h2>
      <div class="max-w-lg mx-auto text-sm">
        勉強会やセミナーで、スマートフォンやパソコンを使い、リアルタイムに質問やコメントを投稿できるサービスです。<br />
        オフラインのセミナーや勉強会はもちろん、オンラインイベントやオンライン・オフライン同時開催イベントでも利用できます。
      </div>
    </div>
    <div>
      <h2 class="mb-10 text-lg font-semibold">
        LeacTion! でイベントが盛り上がる
        <p class="text-3xl">３つの理由</p>
      </h2>
      <div class="pl-2 w-auto text-sm inline-block">
        <h3 class="mb-4 text-lg font-semibold underline">参加者も管理者もログイン不要！</h3>
        <div class="max-w-lg mx-auto mb-16">
          参加者は、イベントページを開くだけですぐにコメントや質問を投稿できます。<br />
          管理者も、面倒な会員登録やログインは不要。イベントにパスワードを設定するだけで、後から編集も可能です。
        </div>
        <h3 class="mb-4 text-lg font-semibold underline">質問やコメントに「いいね！」できる</h3>
        <div class="max-w-lg mx-auto mb-16">
          発表者は「いいね！」ボタンで「自分も気になる！」「自分もそう思う」と意思表明できます。
          発表中や質問タイムに、特に参加者の関心がある質問・コメントを見つけやすくなります。
        </div>
        <h3 class="mb-4 text-lg font-semibold underline">
          発表枠ごとに、質問やコメントを投稿できる
        </h3>
        <div class="max-w-lg mx-auto mb-8">
          あらかじめ登録しておいた発表枠を切り替えるだけで、特定の発表に対するコメントを投稿できます。
          複数の発表・登壇があるイベントでも、誰宛の質問なのかすぐにわかるので、よりスムーズに進行できます。
        </div>
      </div>
    </div>
    <div>
      <router-link to="/new">
        <button
          class="w-full my-6 px-5 py-2 bg-blue-700 text-white text-lg font-semibold tracking-widest rounded"
        >
          イベントを登録する
        </button>
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.about {
  width: 100vw;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
</style>
