<template>
  <div class="w-full sm:w-1/2 md:w-1/3 my-2">
    <div class="rounded shadow-md mx-2 overflow-hidden h-full">
      <div class="flex flex-col px-4 py-3 bg-yellow-200 h-full">
        <div class="flex-grow text-lg text-left">
          <span v-html="message"></span>
        </div>
        <div class="flex items-end text-sm">
          <div class="flex-grow text-black opacity-25">
            {{ comment.postedAt.format("YYYY-MM-DD HH:mm:ss") }}
          </div>
          <div>
            <button
              v-if="isMine"
              class="bg-red-500 text-white px-3 py-1 mr-1 rounded-full"
              type="button"
              @click="deleteMyComment"
            >
              <span>
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
              </span>
            </button>
            <button
              class="bg-green-500 text-white px-3 py-1 rounded-full"
              type="button"
              :class="{ 'bg-pink-500': isLiked, 'opacity-50': isMine }"
              :disabled="isMine"
              @click="toggleLike"
            >
              <span class="mr-1">
                <font-awesome-icon :icon="['fas', 'thumbs-up']" />
              </span>
              <span>{{ likeCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import xssFilters from "xss-filters";
import Swal from "sweetalert2";

import { computed, defineComponent } from "vue";
import { Comment } from "../models/comment";
import { saveCommentLike, deleteComment } from "../repository";

export default defineComponent({
  props: {
    comment: {
      type: Comment,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    userIdHashed: {
      type: String,
      required: true,
    },
  },
  emits: [],
  setup(props, { emit }) {
    const isLiked = computed(() => props.comment.isLikedBy(props.userIdHashed) || false);
    const isMine = computed(() => props.comment.userIdHashed == props.userIdHashed);
    const message = computed(() => {
      const matches = props.comment.text.matchAll(
        /https?:\/\/([\w-]+\.)+[\w:-]+(\/[\w ./?%&=~-]*)?/g
      );
      let cursor = 0;
      let result = "";
      for (const match of matches) {
        result += props.comment.text.slice(cursor, match.index || cursor);
        result += `<a href="${xssFilters.uriInDoubleQuotedAttr(
          match[0]
        )}" class="underline text-blue-700" target="_blank" rel="noopener noreferrer">${xssFilters.uriInHTMLData(
          match[0]
        )}</a>`;
        cursor = (match.index || cursor) + match[0].length;
      }
      result += props.comment.text.slice(cursor);
      return result;
    });

    const confirmDelete = () =>
      Swal.fire({
        title: "本当に削除しますか？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "削除する",
        cancelButtonText: "キャンセル",
        confirmButtonColor: "red",
      });

    const deleteMyComment = () => {
      confirmDelete().then((result) => {
        if (result.isConfirmed) {
          deleteComment(props.comment.eventId, props.comment.id, props.userId);
        }
      });
    };
    const toggleLike = () => {
      const remove = props.comment.isLikedBy(props.userIdHashed);
      if (remove) {
        Swal.fire({
          title: "いいね！を取り消しました",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        Swal.fire({
          title: "いいね！しました",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 1500,
        });
      }
      props.comment.setLike(props.userIdHashed, remove);
      saveCommentLike(props.comment.eventId, props.comment.id, props.userIdHashed, remove);
    };
    const likeCount = computed(() => props.comment.likes.length || 0);
    return { isLiked, isMine, message, likeCount, toggleLike, deleteMyComment };
  },
});
</script>

<style></style>
