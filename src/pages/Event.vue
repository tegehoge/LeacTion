<template>
  <CommentInput :event_id="event_id" @add_comment="addComment"></CommentInput>
  <div class="flex flex-wrap">
    <CommentBlock
      v-for="comment in comments"
      :key="comment.id"
      :comment="comment"
    >
    </CommentBlock>
  </div>
</template>
<script lang="ts">
import CommentInput from "../components/CommentInput.vue";
import CommentBlock from "../components/CommentBlock.vue";
import { ref, Ref, defineComponent, inject, onMounted } from "vue";
import { Comment } from "../models/comment";
import { EventId } from "../models/event";
import { CommentRepository, EventRepository } from "../repository/interface";
import {
  LocalStorageCommentRepository,
  LocalStorageEventRepository,
} from "../repository/local_storage";

export default defineComponent({
  name: "Event",
  components: { CommentInput, CommentBlock },
  props: {
    event_id: String,
  },
  setup(props) {
    const event_repository: EventRepository = inject(
      "event_repository",
      new LocalStorageEventRepository()
    );
    const comment_repository: CommentRepository = inject(
      "comment_repository",
      new LocalStorageCommentRepository()
    );
    const comments: Ref<Comment[]> = ref([]);
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
      comment_repository.save(comment);
    };

    onMounted(() => {
      comment_repository
        .findAllByEventId(props.event_id || "")
        .then((existing_comments) => (comments.value = existing_comments));
    });

    return { event_id: props.event_id, comments, addComment };
  },
});
</script>
