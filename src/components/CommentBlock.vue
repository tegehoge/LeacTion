<template>
  <div class="w-full my-1">
    <div
      class="rounded-lg shadow-md mx-2 px-2 py-2 bg-yellow-200 h-full"
      :title="comment.postedAt.format('YYYY-MM-DD HH:mm:ss')"
    >
      <div class="float-right flex">
        <div>
          <button
            v-if="isMine"
            class="text-red-500 px-2 mr-1"
            type="button"
            title="コメントを削除する"
            @click="deleteMyComment"
          >
            <span>
              <font-awesome-icon :icon="['fas', 'trash-alt']" />
            </span>
          </button>
        </div>
        <div>
          <button
            class="text-white px-2 rounded-full"
            title="いいね！"
            type="button"
            :class="{
              'bg-green-500': !isMine,
              'bg-gray-500 opacity-50 cursor-not-allowed': isMine,
            }"
            :disabled="isMine"
            @click="toggleLike"
          >
            <font-awesome-icon v-if="!isLiked" :icon="['fas', 'thumbs-up']" />
            <font-awesome-icon v-if="isLiked" :icon="['fas', 'check']" />
            <span class="font-mono pl-1">{{ likeCount }}</span>
          </button>
        </div>
      </div>
      <div class="flex-grow text-lg text-left">
        <span class="break-all" v-html="message"></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import xssFilters from "xss-filters";

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
      const target = props.comment.text.replace(/ /g, "&nbsp;");
      const matches = target.matchAll(/https?:\/\/([\w-]+\.)+[\w:-]+(\/[\w ./?%&=~-]*)?/g);
      let cursor = 0;
      let result = "";
      for (const match of matches) {
        const urlForAttr = xssFilters.uriInDoubleQuotedAttr(match[0]);
        const urlForHtml = xssFilters.uriInHTMLData(match[0]);
        result += target.slice(cursor, match.index || cursor);
        result += `<a href="${urlForAttr}" class="underline text-blue-700" target="_blank" rel="noopener noreferrer">${urlForHtml}</a>`;
        cursor = (match.index || cursor) + match[0].length;
      }
      result += target.slice(cursor);
      return result.replace(/\r\n|\r|\n/g, "<br />");
    });
    const deleteMyComment = () => {
      if (confirm("削除してよろしいですか？")) {
        deleteComment(props.comment.eventId, props.comment.id, props.userId);
      }
    };
    const toggleLike = () => {
      const remove = props.comment.isLikedBy(props.userIdHashed);
      props.comment.setLike(props.userIdHashed, remove);
      saveCommentLike(props.comment.eventId, props.comment.id, props.userIdHashed, remove);
    };
    const likeCount = computed(() => props.comment.likes.length || 0);
    return { isLiked, isMine, message, likeCount, toggleLike, deleteMyComment };
  },
});
</script>

<style scoped>
.like-button-enter-active,
.like-button-leave-active {
  transition: opacity 0.5s;
}
.like-button-enter-to,
.like-button-leave-from {
  opacity: 1;
}
.like-button-enter-from,
.like-button-leave-to {
  opacity: 0;
}
</style>
