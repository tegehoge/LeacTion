<template>
  <div class="flex px-3 py-2 w-full text-center items-start mx-auto">
    <div class="flex-grow pr-2">
      <textarea
        id="commentInput"
        ref="inputForm"
        v-model.trim="commentInput"
        class="w-full border-2 rounded p-2"
        placeholder="質問・コメント"
        :rows="lineCount"
        @keydown.enter.prevent
        @keydown.enter.exact="addNewline()"
        @keydown.shift.enter.exact="sendComment()"
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
        投稿する<span class="hidden md:inline">(Shift+Enter)</span>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import Swal from "sweetalert2";
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
    const inputForm = ref<HTMLTextAreaElement>();
    const canSend = computed(() => commentInput.value.replace(/\s*/m, "") !== "");
    const lineCount = computed(() => commentInput.value.split(/\r\n|\r|\n/).length);

    const sanitizeText = (text: string) => text.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    const sendComment = () => {
      if (canSend.value) {
        const comment = new Comment(
          sanitizeText(commentInput.value),
          props.userIdHashed,
          props.eventId,
          props.talkId
        );
        emit("add-comment", comment);
        Swal.fire({
          title: "コメントを投稿しました！",
          position: "top-end",
          toast: true,
          showConfirmButton: false,
          timer: 1000,
        });
        commentInput.value = "";
        inputForm.value?.focus();
      }
    };

    const addNewline = () => {
      commentInput.value = `${commentInput.value}\n`;
    };

    onMounted(() => {
      inputForm.value?.focus();
    });
    return { commentInput, lineCount, sendComment, addNewline, inputForm, canSend };
  },
});
</script>
