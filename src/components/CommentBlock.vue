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
              @click="addLike"
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
import { ref } from "vue";
import { Comment } from "../models/comment";

export default {
  props: {
    comment: Comment,
  },
  setup(prop) {
    // FIXME: likeCount, addLike is stub.
    const likeCount = ref(0);
    const addLike = () => {
      likeCount.value = likeCount.value + 1;
    };
    return { comment: prop.comment, likeCount, addLike };
  },
};
</script>

<style>
.fade {
}
</style>
