<template>
  <div class="p-3 w-full text-center">
    <input
      type="text"
      class="w-2/3 border-2 rounded p-2 mr-3"
      ref="inputForm"
      id="commentInput"
      placeholder="質問・コメント"
      v-model="commentInput"
    />
    <button
      type="submit"
      class="bg-black text-white active:bg-gray-600 rounded p-2"
      :class="{ 'opacity-50': !canSend, 'cursor-not-allowed': !canSend }"
      @click="sendComment()"
      :disabled="!canSend"
    >
      投稿する(Enter)
    </button>
  </div>
</template>

<script lang="ts">
import { computed, onMounted, ref } from "vue";
import { Comment } from "../models/comment";

export default {
  props: {
    event_id: String,
  },
  emits: ["add_comment"],
  setup(props, { emit }) {
    const commentInput = ref("");
    const inputForm = ref<HTMLInputElement>();
    const canSend = computed(() => commentInput.value != "");
    const sendComment = () => {
      const comment = new Comment(
        commentInput.value,
        "sample",
        props.event_id || "unknown",
        "sample"
      );
      emit("add_comment", comment);
      commentInput.value = "";
      inputForm.value?.focus();
    };

    onMounted(() => {
      // Enterでコメント送信を可能にする
      inputForm.value?.addEventListener("keydown", (e) => {
        if (e.keyCode == 13 && commentInput.value) {
          sendComment();
        }
      });
    });
    return { commentInput, sendComment, inputForm, canSend };
  },
};
</script>
