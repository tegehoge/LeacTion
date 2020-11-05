<template>
  <div class="w-full md:w-1/2 lg:w-1/3 my-2">
    <div class="rounded shadow-md mx-2 overflow-hidden h-full">
      <div class="flex flex-col px-4 py-3 bg-yellow-200 h-full">
        <div class="flex-grow text-lg text-left">
          {{ comment.text }}
        </div>
        <div class="flex items-end text-sm">
          <div class="flex-grow text-black opacity-25">
            {{ comment.postedAt.format("YYYY-MM-DD HH:mm:ss") }}
          </div>
          <div>
            <button
              class="bg-green-500 text-white px-3 py-1 rounded-full"
              type="button"
              :class="{ 'bg-pink-500': isLiked, 'opacity-50': isMine }"
              :disabled="!isMine"
              @click="delComment"
            >
              <span class="mr-1">
                <font-awesome-icon :icon="['fas', 'trash-alt']" />
              </span>
              <span>{{ likeCount }}</span>
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
import { computed, defineComponent } from "vue";
import { Comment } from "../models/comment";
import { saveCommentLike, deleteComment } from "../repository";

export default defineComponent({
  props: {
    comment: {
      type: Comment,
      required: true,
    },
    userIdHashed: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const isLiked = computed(() => props.comment.isLikedBy(props.userIdHashed) || false);
    const isMine = computed(() => props.comment.userIdHashed == props.userIdHashed);
    const delComment = () => {
      // todo: confirm
      deleteComment(props.comment.eventId, props.comment.id, props.userIdHashed);
    };
    const toggleLike = () => {
      const remove = props.comment.isLikedBy(props.userIdHashed);
      props.comment.setLike(props.userIdHashed, remove);
      saveCommentLike(props.comment.eventId, props.comment.id, props.userIdHashed, remove);
    };
    const likeCount = computed(() => props.comment.likes.length || 0);
    return { isLiked, isMine, likeCount, toggleLike, delComment };
  },
});
</script>

<style></style>
