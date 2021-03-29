<template>
  <div class="flex flex-col h-screen">
    <event-header :event-id="eventId" :event-title="event ? event.name : ''"></event-header>
    <div v-if="event" id="comments" class="flex-grow overflow-auto" @scroll="checkRead()">
      <div class="flex flex-wrap max-w-4xl mx-auto">
        <CommentBlock
          v-for="comment in commentsForTalk"
          :key="comment.id"
          :comment="comment"
          :user-id-hashed="userContext.userIdHashed"
          :user-id="userContext.userId"
        >
        </CommentBlock>
        <div v-if="commentsForTalk.length === 0" class="py-10 w-full text-center">
          まだコメントがありません
        </div>
      </div>
      <div id="unread" class="sticky bottom-0 text-center pb-2">
        <button
          class="transition duration-300 rounded-full px-3 py-1 bg-green-100 shadow-md"
          :class="{ 'opacity-0': haveReadAll, hidden: haveReadAll }"
          :disabled="haveReadAll"
          @click="scrollToBottom()"
        >
          <font-awesome-icon :icon="['fas', 'arrow-circle-down']" /> 未読コメント
        </button>
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
      <div v-if="currentTalk" class="max-w-4xl mx-auto">
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
import EventHeader from "../components/EventHeader.vue";
import { Comment, CommentResponse } from "../models/comment";
import { Event, EventResponse } from "../models/event";
import { Talk } from "../models/talk";
import { findAllCommentByEventId, findEventById, saveComment } from "../repository";
import { UserContext } from "../models/user_context";

import { firestore } from "../client/firebase";
import { DocumentSnapshot, FirestoreError, QuerySnapshot } from "@firebase/firestore-types";

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
  components: { CommentInput, CommentBlock, EventHeader },
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const event = ref<Event>();
    const currentTalk = ref<Talk>();
    const comments = ref<Comment[]>([]);

    const commentsForTalk = computed(() => {
      const targetComments = comments.value.filter((c) => c.talkId === currentTalk.value?.id);
      targetComments.sort((a, b) => a.postedAt.diff(b.postedAt));
      return targetComments;
    });
    const addComment = (comment: Comment) => {
      saveComment(comment);
      if (!firestore) {
        fetchComments();
        haveReadAll.value = false;
      }
      setTimeout(scrollToBottom, 0);
    };

    const userContext = createOrGetUserContext();

    const fetchEvent = () => {
      return findEventById(props.eventId || "").then((ev) => {
        event.value = ev;
      });
    };
    const fetchComments = () => {
      return findAllCommentByEventId(event.value?.id || "").then((existingComments: Comment[]) => {
        comments.value = existingComments;
      });
    };

    let unsubscribeEvent: void | (() => void);
    let unsubscribeComments: void | (() => void);

    if (firestore) {
      unsubscribeEvent = firestore
        .collection("events")
        .doc(props.eventId)
        .onSnapshot(
          (updatedEvent: DocumentSnapshot) => {
            const updatedEventData = updatedEvent.data() as EventResponse | undefined;
            if (updatedEventData !== undefined) {
              event.value = Event.fromObj(updatedEventData);
              currentTalk.value = Talk.fromObj(updatedEventData.talks[0]);
            }
          },
          (error: FirestoreError) => {
            console.error(error);
            console.debug("Failed to fetch event.");
            router.push("/");
          }
        );
      unsubscribeComments = firestore
        .collection(`comments-${props.eventId}`)
        .onSnapshot((updatedComments: QuerySnapshot) => {
          updatedComments.docChanges().forEach((change) => {
            const targetComment = Comment.fromObj(change.doc.data() as CommentResponse);
            if (change.type == "added") {
              comments.value.push(targetComment);
              haveReadAll.value = false;
            } else if (change.type == "modified") {
              const i = comments.value.findIndex((c) => c.id === targetComment.id);
              comments.value.splice(i, 1, targetComment);
            } else if (change.type == "removed") {
              comments.value = comments.value.filter((c) => c.id !== targetComment.id);
            }
          });
          checkRead();
        });
    }

    onMounted(async () => {
      if (!firestore) {
        await fetchEvent().then(() => {
          currentTalk.value = event.value?.talks[0];
        });
        await fetchComments();
      }
      const unreadElem = document.getElementById("unread");
      if (unreadElem) {
        unreadElem.style.marginTop = `-${unreadElem.clientHeight}px`;
      }
      checkRead();
    });

    onUnmounted(() => {
      if (unsubscribeEvent) unsubscribeEvent();
      if (unsubscribeComments) unsubscribeComments();
    });

    const haveReadAll = ref(false);

    const isBottom = () => {
      const elem = document.getElementById("comments");
      if (!elem) {
        return true;
      }
      const scrollTop = elem.scrollTop;
      const clientHeight = elem.clientHeight;
      const scrollHeight = elem.scrollHeight;
      console.debug(
        `scrollTop: ${scrollTop}, clientHeight: ${clientHeight}, scrollHeight: ${scrollHeight}, result: ${
          scrollTop + clientHeight === scrollHeight
        }`
      );
      return scrollTop + clientHeight === scrollHeight;
    };

    const checkRead = () => {
      if (!haveReadAll.value && isBottom()) {
        haveReadAll.value = true;
      }
    };

    const scrollToBottom = () => {
      const elem = document.getElementById("comments");
      if (elem) {
        const clientHeight = elem.clientHeight;
        const scrollHeight = elem.scrollHeight;
        elem.scrollTop = scrollHeight - clientHeight;
      }
    };

    return {
      event,
      currentTalk,
      comments,
      commentsForTalk,
      addComment,
      userContext,
      haveReadAll,
      checkRead,
      scrollToBottom,
    };
  },
});
</script>
