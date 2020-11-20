<template>
  <header class="bg-blue-700 text-white">
    <nav>
      <div class="flex items-center p-1 md:p-3">
        <div class="flex-shrink-0 pr-5 hidden sm:block">
          <h1 class="text-3xl">LeacTion!</h1>
        </div>
        <div class="flex-grow flex items-center">
          <div class="flex-grow text-center">
            <h2 class="text-2xl">{{ eventTitle }}</h2>
          </div>
          <div>
            <button
              type="button"
              class="text-3xl px-2"
              title="メニュー"
              @click="showMenu = !showMenu"
            >
              <font-awesome-icon :icon="['fas', 'bars']" />
            </button>
          </div>
        </div>
      </div>
      <ul
        v-if="showMenu"
        class="md:flex md:items-center md:justify-between container mx-auto px-2 md:px-0 md:py-2"
      >
        <li class="w-full md:w-1/3 md:text-center border-t md:border-t-0 md:border-r">
          <a class="block w-full my-2 md:my-0 py-2 px-6 cursor-pointer" @click="openShareModal">
            <font-awesome-icon :icon="['fas', 'share-alt']" class="mr-2" />イベントをシェアする</a
          >
        </li>
        <li class="w-full md:w-1/3 md:text-center border-t md:border-t-0 md:border-r">
          <router-link :to="`/event/${eventId}/edit`" class="block w-full my-2 md:my-0 py-2 px-6">
            <font-awesome-icon :icon="['fas', 'edit']" class="w-10 mr-2" />イベントを編集する
          </router-link>
        </li>
        <li class="w-full md:w-1/3 md:text-center border-t md:border-t-0">
          <router-link to="/" class="block w-full my-2 md:my-0 py-2 px-6">
            <font-awesome-icon :icon="['fas', 'plus-square']" class="mr-2" />新規イベントを作成する
          </router-link>
        </li>
      </ul>
    </nav>
    <modal v-show="showShareModal">
      <div class="px-4">
        <h3 class="text-center text-2xl font-bold mb-4">イベントをシェアする</h3>
        <div class="flex justify-center mb-4">
          <div class="p-3 border-2 rounded-lg">
            <img :src="qrcodeUrl.href" />
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="items-center">
            <a :href="tweetUrl.href" target="_blank" rel="noopener">
              <button class="bg-blue-400 text-white px-3 py-2 rounded">
                <font-awesome-icon :icon="['fab', 'twitter']" /> Tweet
              </button>
            </a>
          </div>
          <div>
            <button
              type="button"
              class="bg-green-500 text-white p-2 rounded"
              @click="showShareModal = false"
            >
              閉じる
            </button>
          </div>
        </div>
      </div>
    </modal>
  </header>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

import Modal from "./Modal.vue";

export default defineComponent({
  name: "EventHeader",
  props: {
    eventId: {
      type: String,
      required: true,
    },
    eventTitle: {
      type: String,
      required: true,
    },
  },
  components: { Modal },
  setup(props, context) {
    const showMenu = ref(false);
    const showShareModal = ref(false);
    const openShareModal = () => {
      showMenu.value = false;
      showShareModal.value = true;
    };

    // create QR Code image via API. ref http://goqr.me/api/
    const qrcodeUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
    qrcodeUrl.searchParams.append("data", location.href);
    qrcodeUrl.searchParams.append("size", "300x300");
    const tweetText = `LeacTion で「${props.eventTitle}」にリアクションしよう！`;
    const tweetUrl = new URL("https://twitter.com/intent/tweet");
    tweetUrl.searchParams.append("text", tweetText);
    tweetUrl.searchParams.append("url", location.href);

    return { showMenu, showShareModal, openShareModal, qrcodeUrl, tweetUrl };
  },
});
</script>
