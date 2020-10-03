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
import CommentInput from "../components/CommentInput.vue";
import CommentBlock from "../components/CommentBlock.vue";
import { ref, Ref, defineComponent } from "vue";
import { Comment } from "../models/comment";
import { EventId } from "../models/event";

export default defineComponent({
  name: "Event",
  components: { CommentInput, CommentBlock },
  props: {
    event_id: String,
  },
  setup(props) {
    console.log(props);
    const comments: Ref<Comment[]> = ref([]);
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
    };
    return { comments, addComment };
  },
});
</script>
