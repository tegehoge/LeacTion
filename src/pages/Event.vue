<template>
  <div>
    <div>
      <CommentInput
        :event_id="event_id"
        @add_comment="addComment"
      ></CommentInput>
    </div>
    <div class="flex flex-wrap">
      <CommentBlock
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
      >
      </CommentBlock>
    </div>
  </div>
</template>
<script lang="ts">
import CommentInput from "../components/CommentInput.vue";
import CommentBlock from "../components/CommentBlock.vue";
import { ref, defineComponent, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Comment } from "../models/comment";
import { Event, EventId } from "../models/event";
import {
  findAllCommentByEventId,
  findEventById,
  saveComment,
} from "../repository";
import dayjs from "dayjs";

export default defineComponent({
  name: "Event",
  components: { CommentInput, CommentBlock },
  props: {
    event_id: String,
  },
  setup(props) {
    // FIXME: dummy event
    const event = ref<Event>();
    const comments = ref<Comment[]>([]);
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
      saveComment(comment);
    };

    onMounted(() => {
      findEventById(props.event_id || "").then((ev) => (event.value = ev));
      findAllCommentByEventId(props.event_id || "").then(
        (existing_comments) => (comments.value = existing_comments)
      );
    });

    return { event_id: props.event_id, comments, addComment };
  },
});
</script>
