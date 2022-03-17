<template>
  <app-header></app-header>
  <div class="container m-auto">
    <h1 class="text-center m-5 text-xl">お探しのページは見つかりませんでした</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import AppHeader from "../components/AppHeader.vue";

export default defineComponent({
  components: { AppHeader },
  name: "Terms",
  setup(props, context) {
    return {};
  },
});
</script>

<style></style>
