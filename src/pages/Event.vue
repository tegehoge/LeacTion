<template>
  <div v-if="event">
    <h2 class="text-4xl text-center pt-4">{{ event.name }}</h2>
    <div class="text-center pb-4">{{ event.date_of_event }}</div>
    <div>
      <CommentInput
        :event_id="event_id"
        :user_id_hashed="userContext.user_id_hashed"
        @add_comment="addComment"
      ></CommentInput>
    </div>
    <div class="flex flex-wrap">
      <CommentBlock
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :user_id_hashed="userContext.user_id_hashed"
      >
      </CommentBlock>
    </div>
  </div>
  <div v-else>ローディング中…</div>
  <!-- FIXME: loading -->
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
import { UserContext } from "../models/user_context";

const createOrGetUserContext = () => {
  const savedUserContext = localStorage.getItem("user_context");
  if (savedUserContext) {
    return UserContext.fromJSON(savedUserContext);
  } else {
    const userContext = new UserContext();
    localStorage.setItem("user_context", userContext.toJSON());
    return userContext;
  }
};

export default defineComponent({
  name: "Event",
  components: { CommentInput, CommentBlock },
  props: {
    event_id: String,
  },
  setup(props) {
    const event = ref<Event>();
    const event_id = props.event_id;
    const comments = ref<Comment[]>([]);
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
      saveComment(comment);
    };

    const userContext = createOrGetUserContext();

    onMounted(() => {
      findEventById(props.event_id || "").then((ev) => (event.value = ev));
      findAllCommentByEventId(props.event_id || "").then(
        (existing_comments) => (comments.value = existing_comments)
      );
    });

    return { event, event_id, comments, addComment, userContext };
  },
});
</script>
