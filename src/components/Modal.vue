<template>
  <transition name="modal">
    <div class="absolute inset-0 w-full h-full flex items-center justify-center">
      <div class="absolute inset-0 w-full h-full bg-black opacity-50 z-10"></div>
      <div class="bg-white text-black z-50 p-5 rounded w-256">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Modal",
  props: {},
  emits: [],
  setup() {
    return {};
  },
});
</script>
