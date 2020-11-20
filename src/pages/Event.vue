<template>
  <div class="flex flex-col h-screen">
    <app-header :event-id="eventId" :event-title="event ? event.name : ''"></app-header>
    <div v-if="event" class="flex-grow overflow-auto">
      <div class="flex flex-wrap max-w-4xl mx-auto">
        <CommentBlock
          v-for="comment in commentsForTalk"
          :key="comment.id"
          :comment="comment"
          :user-id-hashed="userContext.userIdHashed"
          :user-id="userContext.userId"
          @update:like="updateLike"
          @delete="deleteComment"
        >
        </CommentBlock>
        <div v-if="commentsForTalk.length === 0" class="py-10 w-full text-center">
          まだコメントがありません
        </div>
      </div>
    </div>
    <div v-else class="text-center p-10">
      <div class="animate-spin text-4xl"><font-awesome-icon :icon="['fas', 'spinner']" /></div>
      <div>イベントを読み込んでいます…</div>
    </div>
    <div v-if="event" class="relative bottom-0 border-t-2">
      <div class="flex px-3 py-2 w-full text-center items-center max-w-4xl mx-auto">
        <div class="flex-shrink-0 mb-1 md:mb-0">
          <label for="talk_select" class="block text-gray-700 font-bold md:text-right pr-4 md:mb-0"
            >発表枠</label
          >
        </div>
        <div class="relative w-full">
          <select
            id="talk_select"
            v-model="currentTalk"
            class="w-full block appearance-none bg-gray-200 rounded p-2"
          >
            <option v-for="talk in event.talks" :key="talk.id" :value="talk">
              {{ talk.speakerName }}「{{ talk.title }}」
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mr-1 text-gray-700"
          >
            <svg
              class="fill-current h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="max-w-4xl mx-auto">
        <CommentInput
          :event-id="eventId"
          :user-id-hashed="userContext.userIdHashed"
          :talk-id="currentTalk?.id"
          @add-comment="addComment"
        ></CommentInput>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, defineComponent, onMounted, computed, onUnmounted } from "vue";
import { useRouter } from "vue-router";

import CommentInput from "../components/CommentInput.vue";
import CommentBlock from "../components/CommentBlock.vue";
import { Comment } from "../models/comment";
import { Event, EventId } from "../models/event";
import { Talk } from "../models/talk";
import { findAllCommentByEventId, findEventById, saveComment } from "../repository";
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
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const event = ref<Event>();
    const currentTalk = ref<Talk>();
    const comments = ref<Comment[]>([]);

    const myCommentCache: Comment[] = [];
    const myLikeCache: { commentId: string; liked: boolean }[] = [];

    const commentsForTalk = computed(() => {
      const talks = comments.value.filter((c) => c.talkId === currentTalk.value?.id);
      talks.sort((a, b) => a.postedAt.diff(b.postedAt));
      return talks;
    });
    const addComment = (comment: Comment) => {
      comments.value.push(comment);
      myCommentCache.push(comment);
      saveComment(comment);
    };

    const updateLike = (commentId: string, liked: boolean) => {
      const existCacheIndex = myLikeCache.findIndex((c) => c.commentId !== commentId);
      if (existCacheIndex >= 0) {
        myLikeCache.splice(existCacheIndex, 1, { commentId, liked });
      } else {
        myLikeCache.push({ commentId, liked });
      }
      console.debug(myLikeCache);
    };

    const deleteComment = (commentId: string) => {
      comments.value = comments.value.filter((comment) => comment.id != commentId);
    };

    const userContext = createOrGetUserContext();

    const fetchEvent = () => {
      return findEventById(props.eventId || "").then((ev) => {
        event.value = ev;
      });
    };
    const fetchEventTask = setInterval(fetchEvent, 10 * 1000);

    const mergeLocalCache = () => {
      while (myCommentCache.length > 0) {
        const commentUpdate = myCommentCache.shift();
        if (commentUpdate) {
          const targetComment = comments.value.filter((c) => c.id === commentUpdate.id)[0];
          if (!targetComment) {
            comments.value.push(commentUpdate);
          }
        }
      }
      while (myLikeCache.length > 0) {
        const likeUpdate = myLikeCache.shift();
        if (likeUpdate) {
          const targetComment = comments.value.filter((c) => c.id === likeUpdate.commentId)[0];
          if (targetComment) {
            targetComment.setLike(userContext.userIdHashed, !likeUpdate.liked);
          } else {
            console.error(`Unknown commentId ${likeUpdate.commentId}`);
          }
        }
      }
    };
    const fetchComments = () => {
      return findAllCommentByEventId(props.eventId || "").then((existingComments) => {
        comments.value = existingComments;
        mergeLocalCache();
      });
    };
    const fetchCommentsTask = setInterval(fetchComments, 2 * 1000);

    onMounted(async () => {
      await fetchEvent().then(() => (currentTalk.value = event.value?.talks[0]));
      await fetchComments();
    });

    onUnmounted(() => {
      clearInterval(fetchEventTask);
      clearInterval(fetchCommentsTask);
    });

    return {
      event,
      currentTalk,
      comments,
      commentsForTalk,
      addComment,
      updateLike,
      deleteComment,
      userContext,
    };
  },
});
</script>
