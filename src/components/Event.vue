<template>
  <CommentInput @add_comment="addComment"></CommentInput>
  <CommentBlock
    v-for="comment in comments"
    :key="comment.id"
    :comment="comment"
  >
  </CommentBlock>
</template>
<script lang="ts">
import CommentInput from "./CommentInput.vue";
import CommentBlock from "./CommentBlock.vue";
import { ref, Ref } from "vue";
import { Comment } from "../models/comment";

export default {
  components: { CommentInput, CommentBlock },
  setup(props) {
    const comments: Ref<Comment[]> = ref([]);
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
    };
    return { comments, addComment };
  },
};
</script>
