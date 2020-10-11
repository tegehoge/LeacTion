<template>
  <div>
    <header>
      <nav class="p-3 bg-blue-700 text-white">
        <div class=""><h1 class="text-2xl">LeacTion!</h1></div>
      </nav>
    </header>
    <main class="container mx-auto flex-grow">
      <router-view></router-view>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "App",
  setup() {
    return {};
  },
});
</script>
