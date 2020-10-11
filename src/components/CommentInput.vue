<template>
  <div class="flex px-3 py-2 w-full text-center items-center max-w-3xl mx-auto">
    <div class="flex-grow pr-2">
      <input
        id="commentInput"
        ref="inputForm"
        v-model="commentInput"
        type="text"
        class="w-full border-2 rounded p-2"
        placeholder="質問・コメント"
      />
    </div>
    <div>
      <button
        type="submit"
        class="bg-green-500 hover:bg-green-700 text-white rounded p-2"
        :class="{ 'opacity-50': !canSend, 'cursor-not-allowed': !canSend }"
        :disabled="!canSend"
        @click="sendComment()"
      >
        投稿する(Enter)
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from "vue";

import { Comment } from "../models/comment";

export default defineComponent({
  props: {
    eventId: {
      type: String,
      required: true,
    },
    userIdHashed: {
      type: String,
      required: true,
    },
    talkId: {
      type: String,
      required: true,
    },
  },
  emits: ["add-comment"],
  setup(props, { emit }) {
    const commentInput = ref("");
    const inputForm = ref<HTMLInputElement>();
    const canSend = computed(() => commentInput.value != "");
    const sendComment = () => {
      const comment = new Comment(
        commentInput.value,
        props.userIdHashed,
        props.eventId,
        props.talkId
      );
      emit("add-comment", comment);
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
      inputForm.value?.focus();
    });
    return { commentInput, sendComment, inputForm, canSend };
  },
});
</script>
