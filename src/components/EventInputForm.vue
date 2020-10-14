<template>
  <form class="w-full max-w-5xl mx-auto px-2 pt-3">
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="event_name"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >イベント名<sup class="text-red-500">*</sup></label
        >
      </div>
      <div class="md:w-2/3">
        <input
          id="event_name"
          v-model.trim="eventInput.name"
          type="text"
          name="event_name"
          placeholder="Webナイト宮崎 vol.1"
          class="w-full border-2 border-gray-400 rounded px-2 py-2"
          @input="updateEvent"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="dateOfEvent"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >開催日<sup class="text-red-500">*</sup></label
        >
      </div>
      <div class="md:w-2/3">
        <input
          id="dateOfEvent"
          v-model="eventInput.dateOfEvent"
          type="date"
          name="dateOfEvent"
          placeholder="yyyy-mm-dd"
          :min="today"
          class="w-auto border-2 border-gray-400 rounded px-2 py-2"
          @input="updateEvent"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="externalUrl"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >イベントページのURL</label
        >
      </div>
      <div class="md:w-2/3">
        <input
          id="externalUrl"
          v-model.trim="eventInput.externalUrl"
          type="text"
          name="externalUrl"
          placeholder="connpassイベントURLなど (optional)"
          class="w-full border-2 border-gray-400 rounded px-2 py-2"
          @input="updateEvent"
        />
      </div>
    </div>
    <div
      v-for="(talk, index) in eventInput.talks"
      :key="talk.id"
      class="w-full md:flex md:items-center py-1"
    >
      <div class="md:w-1/6 mb-1 md:mb-0">
        <label for="externalUrl" class="block text-gray-700 font-bold md:text-right pr-4 md:mb-0"
          >発表枠{{ index + 1 }}</label
        >
      </div>
      <div class="md:w-1/4 md:px-1 mb-1 md:mb-0">
        <input
          v-model.trim="talk.speakerName"
          type="text"
          class="w-full border-2 border-gray-400 rounded p-2"
          placeholder="発表者名"
          @input="updateEvent"
        />
      </div>
      <div class="md:flex-grow md:px-1 mb-1 md:mb-0">
        <input
          v-model.trim="talk.title"
          type="text"
          class="w-full border-2 border-gray-400 rounded p-2"
          placeholder="発表タイトル"
          @input="updateEvent"
        />
      </div>
      <div class="pl-1">
        <button type="button" class="text-red-500" @click="removeTalk(talk.id)">消</button
        ><!-- FIXME: FontAwesome -->
      </div>
    </div>
    <div class="md:flex py-1">
      <div class="md:w-1/6" />
      <div class="md:w-5/6 md:px-1">
        <button
          type="button"
          class="w-full border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 py-1 rounded transition duration-100"
          @click="addTalkInput"
        >
          発表枠を追加する
        </button>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, onMounted, reactive } from "vue";
import { Event } from "../models/event";
import { emptyTalk } from "../models/talk";
export default defineComponent({
  name: "EventInput",
  props: {
    initialEvent: {
      type: Event,
      required: true,
    },
  },
  emits: ["update-event"],
  setup(props, { emit }) {
    const today = dayjs().format("YYYY-MM-DD");
    const eventInput = reactive(props.initialEvent);

    const fillMinimalTalks = () => {
      while ((eventInput.talks.length || 0) < 3) {
        eventInput.talks.push(emptyTalk());
      }
    };

    const addTalkInput = () => {
      eventInput.talks.push(emptyTalk());
    };

    const removeTalk = (talkId: string) => {
      eventInput.talks = eventInput.talks.filter((talk) => talk.id != talkId);
      fillMinimalTalks();
    };

    const updateEvent = (): void => {
      emit("update-event", eventInput);
    };

    onMounted(() => {
      fillMinimalTalks();
    });

    return {
      eventInput,
      updateEvent,
      addTalkInput,
      removeTalk,
      today,
    };
  },
});
</script>
