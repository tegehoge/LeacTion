<template>
  <div class="w-full mb-2">
    <div
      class="rounded-md shadow-sm mx-2 px-3 py-2 bg-white h-full"
      :class="{ 'bg-yellow-200': highlighted }"
      :title="comment.postedAt.format('YYYY-MM-DD HH:mm:ss')"
      @click="$emit('toggleHighlight')"
    >
      <div class="float-right flex">
        <div class="text-sm leading-6">
          <button
            v-if="isMine && !isArchived"
            class="text-red-500 px-1 mr-0.5"
            type="button"
            title="コメントを削除する"
            @click="deleteMyComment"
          >
            <span>
              <font-awesome-icon :icon="['fas', 'trash-alt']" fixed-width />
            </span>
          </button>
        </div>
        <div>
          <button
            class="text-white text-sm leading-4 px-2 py-1 rounded-full flex flex-nowrap items-center"
            title="いいね！"
            type="button"
            :class="{
              'bg-green-500': !isMine,
              'bg-gray-500 opacity-50 cursor-not-allowed': isMine,
            }"
            :disabled="isMine || isArchived"
            @click="toggleLike"
          >
            <font-awesome-icon v-if="!isLiked" :icon="['fas', 'thumbs-up']" fixed-width />
            <font-awesome-icon v-if="isLiked" :icon="['fas', 'check']" fixed-width />
            <span class="font-mono pl-1">{{ likeCount }}</span>
          </button>
        </div>
      </div>
      <div class="flex-grow text-md text-left text-gray-700">
        <p class="break-all leading-6" v-html="comment.asHTML"></p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
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
    isArchived: {
      type: Boolean,
      required: false,
      default: false,
    },
    highlighted: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["toggleHighlight"],
  setup(props, { emit }) {
    const isLiked = computed(() => props.comment.isLikedBy(props.userIdHashed) || false);
    const isMine = computed(() => props.comment.userIdHashed == props.userIdHashed);

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
    return { isLiked, isMine, likeCount, toggleLike, deleteMyComment };
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
