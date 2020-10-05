<template>
  <div class="md:flex md:items-center mt-6 mb-2">
    <div class="md:w-1/3">
      <label
        for="password"
        class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
        >管理者パスワード</label
      >
    </div>
    <div class="md:w-2/3">
      <input
        type="password"
        name="password"
        id="password"
        v-model="eventPassword"
        placeholder="パスワード"
        class="border-2 border-gray-400 rounded px-2 py-2"
      />
    </div>
  </div>
  <div class="md:flex md:items-center mb-6">
    <div class="md:w-1/3">
      <label
        for="password_confirm"
        class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
        >管理者パスワード（確認用）</label
      >
    </div>
    <div class="md:w-2/3">
      <input
        type="password"
        name="password_confirm"
        id="password_confirm"
        v-model="eventPasswordConfirm"
        placeholder="パスワード（確認用）"
        :class="{ 'border-red-500': invalidPassword }"
        class="border-2 border-gray-400 rounded px-2 py-2"
      />
      <span v-show="invalidPassword" class="text-red-500 ml-2"
        >パスワードが一致していません</span
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
export default defineComponent({
  name: "	",
  props: {},
  emits: ["setPassword"],
  setup(props, context) {
    const eventPassword = ref<string | null>(null);
    const eventPasswordConfirm = ref<string | null>(null);
    const invalidPassword = computed(() => {
      if (eventPasswordConfirm.value == null) {
        return false; // not dirty
      }
      if (
        (eventPassword.value || "").length > 0 &&
        eventPassword.value == eventPasswordConfirm.value
      ) {
        return false;
      }
      return true;
    });

    return { eventPassword, eventPasswordConfirm, invalidPassword };
  },
});
</script>
