<template>
  <div class="w-full md:w-1/2 lg:w-1/3 my-2">
    <div class="rounded shadow-md mx-2 overflow-hidden h-full">
      <div class="flex flex-col px-4 py-3 bg-yellow-200 h-full">
        <div class="flex-grow text-lg text-left">
          {{ comment.text }}
        </div>
        <div class="flex items-end text-sm">
          <div class="flex-grow text-black opacity-25">
            {{ comment.posted_at.format("YYYY-MM-DD HH:mm:ss") }}
          </div>
          <div>
            <button
              class="bg-green-500 text-white px-3 py-1 rounded-full"
              type="button"
              :class="{ 'bg-pink-500': isLiked, 'opacity-50': isMine }"
              :disabled="isMine"
              @click="toggleLike"
            >
              <span class="mr-1">Like!</span>
              <span>{{ likeCount }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, ref } from "vue";
import { Comment } from "../models/comment";
import { saveCommentLike } from "../repository";

export default {
  props: {
    comment: Comment,
  },
  setup(props) {
    // FIXME: likeCount, addLike is stub.
    const comment = props.comment;
    const user_id_hashed = "sample";
    const isLiked = computed(() => comment?.isLikedBy(user_id_hashed) || false);
    const isMine = computed(() => comment?.user_id_hashed == user_id_hashed);
    const toggleLike = () => {
      if (comment) {
        const liked = comment.isLikedBy(user_id_hashed);
        comment.setLike(user_id_hashed, !liked);
        saveCommentLike(comment.id, user_id_hashed, !liked);
      }
    };
    const likeCount = computed(() => comment?.likes.length || 0);
    return { comment, isLiked, isMine, likeCount, toggleLike };
  },
};
</script>

<style>
.fade {
}
</style>
