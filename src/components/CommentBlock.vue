<template>
  <div class="comment">
    <span class="comment-text">
      {{ comment.text }}
    </span>
    <span class="comment-posted-at">
      {{ comment.posted_at.format("YYYY-MM-DD HH:mm:ss") }}
    </span>
    <button class="commment-like" type="button">Like!</button>
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
