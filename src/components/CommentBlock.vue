<template>
  <div class="w-full lg:w-1/2">
    <div class="rounded overflow-hidden shadow-md m-2">
      <div class="px-4 py-3 bg-yellow-200 h-auto">
        <div class="text-lg float-left">
          {{ comment.text }}
        </div>
        
        <div class="text-sm float-right">
          <span class="mx-5 text-gray-500">
            {{ comment.posted_at.format("YYYY-MM-DD HH:mm:ss") }}
          </span>
          <button
            class="bg-green-500 text-white px-3 py-1 rounded-full"
            type="button"
          >
            <span class="mr-1">Like!</span>
            <span>0</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Comment } from "../models/comment";

export default {
  props: {
    comment: Comment,
  },
  setup(prop) {
    return { comment: prop.comment };
  },
};
</script>

<style></style>
