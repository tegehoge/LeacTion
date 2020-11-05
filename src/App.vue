<template>
  <div>
    <header>
      <nav class="p-3 bg-blue-700 text-white">
        <div class="">
          <h1 class="text-2xl"><router-link to="/">LeacTion!</router-link></h1>
        </div>
      </nav>
    </header>
    <main class="container mx-auto flex-grow">
      <router-view />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",
  setup() {
    return {};
  },
});
</script>
