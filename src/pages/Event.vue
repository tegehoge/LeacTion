<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from "vue";

import { useRouter } from "vue-router";
import Swal from "sweetalert2";

import { Comment, CommentResponse } from "../models/comment";
import { Event, EventResponse } from "../models/event";
import { Talk } from "../models/talk";
import { findAllCommentByEventId, findEventById, saveComment } from "../repository";
import { UserContext } from "../models/user_context";

import EventHeader from "../components/EventHeader.vue";
import CommentBlock from "../components/CommentBlock.vue";
import CommentInput from "../components/CommentInput.vue";

import { createFirestore } from "../client/firebase";
import { Firestore, collection, doc, onSnapshot } from "firebase/firestore";

const createOrGetUserContext = () => {
  const savedUserContext = localStorage.getItem("user_context");
  if (savedUserContext) {
    return UserContext.fromJSON(savedUserContext);
  } else {
    const userContext = new UserContext();
    localStorage.setItem("user_context", userContext.toJSON());
    Swal.fire({
      icon: "warning",
      title: "サービス利用に関する注意",
      html:
        '<ul class="list-disc leading-relaxed text-left">' +
        "<li>本サービスへ投稿されたイベント名やコメントは全て一般公開されています。<br>他の利用者を不快にさせるコメントや公開してはならない情報は書き込まないようにしてください。</li>" +
        '<li>個別のサポートは行っておりません。不具合報告・要望などは<a class="text-blue-500" href="https://github.com/tegehoge/LeacTion/issues/new" target="_blank" rel="noopener noreferrer">Github</a>へ投稿してください。</li>' +
        "</ul>",
      confirmButtonText: "確認して利用する",
      allowOutsideClick: false,
      width: "80vw",
    });
    return userContext;
  }
};

const props = defineProps<{
  eventId: string;
}>();
const router = useRouter();
const firestore: Firestore | null = createFirestore();

const event = ref<Event>();
const currentTalk = ref<Talk>();
const comments = ref<Comment[]>([]);
const highlightedCommentId = ref<String>();
const toggleHighlight = (commentId: string) => {
  highlightedCommentId.value = highlightedCommentId.value == commentId ? undefined : commentId;
};

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
  checkRead();
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
  const docRef = doc(firestore, `events/${props.eventId}`);
  unsubscribeEvent = onSnapshot(docRef, (snapshot) => {
    const updatedEventData = snapshot.data() as EventResponse | undefined;
    if (updatedEventData !== undefined) {
      event.value = Event.fromObj(updatedEventData);
      console.dir(event.value);
      currentTalk.value = Talk.fromObj(updatedEventData.talks[0]);
    }
  });
  const collectionRef = collection(firestore, `comments-${props.eventId}`);
  unsubscribeComments = onSnapshot(collectionRef, (snapshot) => {
    const wasBottom = isBottom();
    snapshot.docChanges().forEach((change) => {
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
    if (wasBottom) {
      setTimeout(scrollToBottom, 0);
    }
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
</script>

<template>
  <div class="flex flex-col h-screen">
    <EventHeader
      :event-id="eventId"
      :event-title="event?.name || ''"
      :event-hashtag="event?.hashtag || ''"
    ></EventHeader>
    <div
      v-if="event"
      id="comments"
      class="bg-blue-50 flex-grow overflow-auto"
      @scroll="checkRead()"
    >
      <div class="flex flex-wrap max-w-4xl mx-auto py-3">
        <CommentBlock
          v-for="comment in commentsForTalk"
          :key="comment.id"
          :comment="comment"
          :user-id-hashed="userContext.userIdHashed"
          :user-id="userContext.userId"
          :is-archived="event?.isArchived"
          :highlighted="highlightedCommentId == comment.id"
          @toggle-highlight="toggleHighlight(comment.id)"
        >
        </CommentBlock>
        <div v-if="commentsForTalk.length === 0" class="py-10 w-full text-center">
          まだコメントがありません
        </div>
      </div>
      <transition name="unread-button">
        <div v-show="!haveReadAll" id="unread" class="sticky bottom-0 text-center pb-2">
          <button
            class="rounded-full px-3 py-1 bg-yellow-300 text-white text-sm shadow-md"
            @click="scrollToBottom()"
          >
            <FontAwesomeIcon :icon="['fas', 'arrow-circle-down']" /> 未読コメント
          </button>
        </div>
      </transition>
    </div>
    <div v-else class="text-center p-10">
      <div class="animate-spin text-4xl"><FontAwesomeIcon :icon="['fas', 'spinner']" /></div>
      <div>イベントを読み込んでいます…</div>
    </div>
    <div v-if="event" class="relative bottom-0 pt-3 shadow">
      <div class="flex px-3 mb-2 w-full text-center items-center max-w-4xl mx-auto">
        <div class="flex-shrink-0 mb-1 md:mb-0">
          <label for="talk_select" class="block text-gray-700 font-bold md:text-right pr-2 md:mb-0"
            >発表枠</label
          >
        </div>
        <div class="relative w-full">
          <select
            id="talk_select"
            v-model="currentTalk"
            class="w-full block appearance-none border-2 rounded p-2"
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
      <div v-if="currentTalk && !event?.isArchived" class="max-w-4xl mx-autopx-3 px-3 pb-1 mx-auto">
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

<style lang="postcss" scoped>
.unread-button-enter-from,
.unread-button-leave-to {
  opacity: 0;
}
.unread-button-leave-active {
  transition: all 0.3s linear;
}
</style>
