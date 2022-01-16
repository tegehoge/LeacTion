<script setup lang="ts">
import Swal from "sweetalert2";
import { computed, onMounted, ref } from "vue";

import { Comment } from "../models/comment";

interface Props {
  eventId: string;
  userIdHashed: string;
  talkId: string;
}
const props = defineProps<Props>();

interface Emits {
  (e: "add-comment", comment: Comment): void;
}
const emit = defineEmits<Emits>();

const commentInput = ref("");
const inputForm = ref<HTMLTextAreaElement>();
const canSend = computed(() => commentInput.value.replace(/\s*/m, "") !== "");
const lineCount = computed(() => commentInput.value.split(/\r\n|\r|\n/).length);

const sendComment = () => {
  if (canSend.value) {
    const comment = new Comment(
      commentInput.value,
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
</script>

<template>
  <div class="flex w-full text-center items-start mx-auto">
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
