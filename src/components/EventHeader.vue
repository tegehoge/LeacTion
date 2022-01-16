<script setup lang="ts">
import { computed, ref } from "vue";
import Swal from "sweetalert2";

interface Props {
  eventId: string;
  eventTitle: string;
  eventHashtag: string;
}
const props = defineProps<Props>();

const showMenu = ref(false);
const showShareModal = ref(false);
const openShareModal = () => {
  showMenu.value = false;
  showShareModal.value = true;
};
const currentUrl = location.href;

const copyUrl = () => {
  navigator.clipboard.writeText(currentUrl).then(() => {
    Swal.fire({
      title: "URLをコピーしました！",
      position: "top-end",
      toast: true,
      showConfirmButton: false,
      timer: 1000,
    });
  });
};

// create QR Code image via API. ref http://goqr.me/api/
const qrcodeUrl = new URL("https://api.qrserver.com/v1/create-qr-code/");
qrcodeUrl.searchParams.append("data", currentUrl);
qrcodeUrl.searchParams.append("size", "300x300");
const tweetUrl = computed(() => {
  const url = new URL("https://twitter.com/intent/tweet");
  url.searchParams.append("text", `LeacTion で「${props.eventTitle}」にリアクションしよう！`);
  url.searchParams.append("url", currentUrl);
  url.searchParams.append(
    "hashtags",
    props.eventHashtag.length > 0 ? `${props.eventHashtag},LeacTion` : "LeacTion"
  );
  return url;
});
</script>

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
          <div v-if="eventHashtag.length > 0" class="hidden md:block">
            <a
              :href="`https://twitter.com/intent/tweet/?hashtags=${eventHashtag}`"
              target="_blank"
              rel="noopener noreferrer"
              ><button class="twitter-share-button bg-white hover:bg-gray-100">
                <FontAwesomeIcon :icon="['fab', 'twitter']" /> tweet #{{ eventHashtag }}
              </button></a
            >
          </div>
          <div>
            <button
              type="button"
              class="text-3xl px-2"
              title="メニュー"
              @click="showMenu = !showMenu"
            >
              <FontAwesomeIcon :icon="['fas', 'bars']" />
            </button>
          </div>
        </div>
      </div>
      <ul
        v-if="showMenu"
        class="md:flex md:items-center md:justify-between container mx-auto px-2 md:px-0 md:py-2"
      >
        <li v-if="eventHashtag.length > 0" class="w-full md:hidden border-t py-2 pl-6">
          <a
            :href="`https://twitter.com/intent/tweet/?hashtags=${eventHashtag}`"
            target="_blank"
            rel="noopener noreferrer"
            ><button class="twitter-share-button bg-white hover:bg-gray-100">
              <FontAwesomeIcon :icon="['fab', 'twitter']" /> tweet #{{ eventHashtag }}
            </button></a
          >
        </li>
        <li class="w-full md:w-1/3 md:text-center border-t md:border-t-0 md:border-r">
          <a class="block w-full my-2 md:my-0 py-2 px-6 cursor-pointer" @click="openShareModal">
            <FontAwesomeIcon :icon="['fas', 'share-alt']" class="mr-2" />イベントをシェアする</a
          >
        </li>
        <li class="w-full md:w-1/3 md:text-center border-t md:border-t-0 md:border-r">
          <router-link :to="`/event/${eventId}/edit`" class="block w-full my-2 md:my-0 py-2 px-6">
            <FontAwesomeIcon :icon="['fas', 'edit']" class="w-10 mr-2" />イベントを編集する
          </router-link>
        </li>
        <li class="w-full md:w-1/3 md:text-center border-t md:border-t-0">
          <router-link to="/" class="block w-full my-2 md:my-0 py-2 px-6">
            <FontAwesomeIcon :icon="['fas', 'plus-square']" class="mr-2" />新規イベントを作成する
          </router-link>
        </li>
      </ul>
    </nav>
    <modal v-show="showShareModal">
      <div class="w-full px-4">
        <h3 class="text-center text-2xl font-bold mb-4">イベントをシェアする</h3>
        <div class="flex justify-center mb-4">
          <div class="p-3 border-2 rounded-lg">
            <img :src="qrcodeUrl.href" />
          </div>
        </div>
        <div class="mb-4">
          <div class="w-full inline-flex">
            <input
              id="share-url"
              ref="share-url"
              class="p-2 border-2 rounded-l flex-grow"
              type="text"
              name="share-url"
              :value="currentUrl"
              readonly
            />
            <button type="button" class="px-4 py-2 rounded-r bg-gray-300 border-2" @click="copyUrl">
              <FontAwesomeIcon :icon="['fas', 'clipboard']" /><span class="hidden md:inline ml-2"
                >URLをコピーする</span
              >
            </button>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div class="items-center">
            <a :href="tweetUrl.href" target="_blank" rel="noopener">
              <button class="bg-blue-400 text-white px-3 py-2 rounded">
                <FontAwesomeIcon :icon="['fab', 'twitter']" /> Tweet
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

<style lang="postcss" scoped>
.twitter-share-button {
  color: #1b95e0;
  border-radius: 3px;
  padding: 0.25em 0.5em;
}
</style>
