<template>
  <div>
    <input
      type="text"
      ref="inputForm"
      id="commentInput"
      v-model="commentInput"
    />
    <button type="submit" @click="sendComment()" :disabled="commentInput == ''">
      send
    </button>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";
import { Comment } from "../models/comment";

export default {
  emits: ["add_comment"],
  setup(props, { emit }) {
    const commentInput = ref("");
    const inputForm = ref<HTMLInputElement>();
    const sendComment = () => {
      const comment = new Comment(
        commentInput.value,
        "sample",
        "sample",
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
    return { commentInput, sendComment, inputForm };
  },
};
</script>
