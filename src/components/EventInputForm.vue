<template>
  <form class="max-w-5xl mx-auto px-2">
    <div class="md:flex md:items-center mb-0 md:mb-2">
      <div class="md:w-2/3 p">
        <div>
          <label for="eventName" class="text-input-label"
            >イベント名<sup class="text-red-500">*</sup></label
          >
        </div>
        <div class="w-full mb-2 md:mb-0">
          <input
            id="eventName"
            v-model.trim="eventInput.name"
            type="text"
            name="eventName"
            placeholder="Webナイト宮崎 vol.1"
            class="text-input-form w-full"
            @input="updateEvent"
          />
        </div>
      </div>
      <div class="md:w-1/3 md:pl-2 mb-2 md:mb-0">
        <div>
          <label for="dateOfEvent" class="text-input-label"
            >開催日<sup class="text-red-500">*</sup></label
          >
        </div>
        <div class="w-full">
          <input
            id="dateOfEvent"
            v-model="eventInput.dateOfEvent"
            type="date"
            name="dateOfEvent"
            placeholder="yyyy-mm-dd"
            :min="today"
            class="date-input-form w-full"
            @input="updateEvent"
          />
        </div>
      </div>
    </div>

    <div class="w-full mb-10">
      <div>
        <label for="externalUrl" class="text-input-label">イベントページのURL</label>
      </div>
      <div class="w-full">
        <input
          id="externalUrl"
          v-model.trim="eventInput.externalUrl"
          type="text"
          name="externalUrl"
          placeholder="connpassイベントURLなど (optional)"
          class="text-input-form w-full"
          @input="updateEvent"
        />
      </div>
    </div>

    <div>
      <div v-for="(talk, index) in eventInput.talks" :key="talk.id" class="transition py-1 md:py-0">
        <div class="flex items-center">
          <label for="externalUrl" class="block flex-grow text-input-label"
            >発表枠{{ index + 1 }}</label
          >
          <button
            type="button"
            class="border border-green-500 hover:bg-green-500 text-green-500 hover:text-white transition duration-300 rounded px-1 text-xs mr-2"
            @click="addTalkInput(index)"
          >
            ここに発表枠を追加
          </button>
          <button type="button" class="text-red-500 text-sm" @click="removeTalk(talk.id)">
            <font-awesome-icon :icon="['fas', 'trash-alt']" />
          </button>
        </div>
        <div class="md:flex md:items-center md:mb-2">
          <div class="md:w-1/4 mb-1 md:mb-0">
            <input
              v-model.trim="talk.speakerName"
              type="text"
              class="text-input-form w-full"
              placeholder="発表者名"
              @input="updateEvent"
            />
          </div>
          <div class="md:flex-grow md:pl-2 mb-1 md:mb-0">
            <input
              v-model.trim="talk.title"
              type="text"
              class="text-input-form w-full"
              placeholder="発表タイトル"
              @input="updateEvent"
            />
          </div>
        </div>
      </div>
      <div class="py-1">
        <button
          type="button"
          class="w-full border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 py-1 rounded transition duration-300"
          @click="addTalkInput()"
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

    const addTalkInput = (index?: number) => {
      eventInput.insertEmptyTalkAt(index);
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
