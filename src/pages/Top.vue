<template>
  <div class="text-center">
    <h2 class="my-3 text-xl">イベントを作る</h2>
    <div class="my-3">イベントを作成して参加者とコメントや質問をして盛り上げていきましょう！</div>
    <div class="mx-auto">
      <ul class="w-auto text-left inline-block">
        <li>参加者はログイン不要</li>
        <li>質問やコメントを投稿できます</li>
        <li>質問やコメントに「いいね！」を送れます</li>
      </ul>
    </div>
    <div>
      <router-link to="/new">
        <button class="my-6 px-5 py-2 bg-blue-400 text-white rounded-full">
          イベントを作成する(仮)
        </button>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Top",
  setup() {
    return {};
  },
});
</script>

<style></style>
