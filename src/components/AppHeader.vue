<template>
  <header class="bg-blue-700 text-white">
    <nav class="flex items-center p-1 md:p-3">
      <div class="flex-shrink-0 pr-5" :class="{ 'hidden sm:block': eventId }">
        <h1 class="text-3xl">LeacTion!</h1>
      </div>
      <div v-if="eventId" class="flex-grow flex items-center">
        <div class="flex-grow text-center">
          <h2 v-if="eventTitle" class="text-2xl">{{ eventTitle }}</h2>
        </div>
        <div>
          <router-link :to="`/event/${eventId}/edit`">
            <button type="button" class="text-3xl px-2" title="イベントを編集する">
              <font-awesome-icon :icon="['fas', 'cog']" /></button
          ></router-link>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  props: {
    eventId: {
      type: String,
      default: undefined,
    },
    eventTitle: {
      type: String,
      default: undefined,
    },
  },
  setup(props, context) {
    return {};
  },
});
</script>
