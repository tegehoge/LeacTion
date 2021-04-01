<template>
  <header class="bg-blue-700 text-white">
    <nav class="flex items-center justify-between p-1 md:p-3">
      <div class="pr-5">
        <h1 class="text-3xl">LeacTion!</h1>
      </div>
      <div>
        <a
          href="https://github.com/tegehoge/LeacTion"
          class="text-white"
          target="_blank"
          rel="noopener noreferrer"
          ><font-awesome-icon :icon="['fab', 'github']" class="text-3xl"
        /></a>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AppHeader",
  setup() {
    return {};
  },
});
</script>
