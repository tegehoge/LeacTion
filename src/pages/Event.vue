<template>
  <div v-if="event">
    <h2 class="text-4xl text-center pt-4">
      {{ event.name }}
    </h2>
    <div class="text-center pb-4">
      {{ event.date_of_event }}
    </div>
    <div>
      <CommentInput :event-id="eventId" @add-comment="addComment" />
    </div>
    <div class="flex flex-wrap">
      <CommentBlock v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
  </div>
  <div v-else>ローディング中…</div>
  <!-- FIXME: loading -->
</template>
<script lang="ts">
import { ref, defineComponent, onMounted } from "vue";

import CommentInput from "../components/CommentInput.vue";
import CommentBlock from "../components/CommentBlock.vue";
import { Comment } from "../models/comment";
import { Event } from "../models/event";
import { findAllCommentByEventId, findEventById, saveComment } from "../repository";

export default defineComponent({
  name: "Event",
  components: { CommentInput, CommentBlock },
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const event = ref<Event>();
    const comments = ref<Comment[]>([]);
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
      saveComment(comment);
    };

    onMounted(() => {
      findEventById(props.eventId).then((ev) => (event.value = ev));
      findAllCommentByEventId(props.eventId).then(
        (existing_comments) => (comments.value = existing_comments)
      );
    });

    return { event, comments, addComment };
  },
});
</script>
