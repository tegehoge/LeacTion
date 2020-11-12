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
              @click="menuOpened = !menuOpened"
            >
              <font-awesome-icon :icon="['fas', 'bars']" />
            </button>
          </div>
        </div>
      </div>
      <ul
        v-if="menuOpened"
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
  </header>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

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
  setup(props, context) {
    const menuOpened = ref(false);
    const openShareModal = () => {
      menuOpened.value = false;
      console.log("openShareModal");
    };
    return { menuOpened, openShareModal };
  },
});
</script>
