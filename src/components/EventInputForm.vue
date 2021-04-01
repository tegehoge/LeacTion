<template>
  <form class="max-w-5xl mx-auto px-2">
    <div class="md:flex md:items-center pb-0 md:pb-3">
      <div class="md:w-2/3">
        <div>
          <label for="eventName" class="text-input-label"
            >イベント名<sup class="text-red-500">*</sup></label
          >
        </div>
        <div class="w-full pb-3 md:pb-0">
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
      <div class="md:w-1/3 md:pl-2 pb-3 md:pb-0">
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
      <div v-for="(talk, index) in eventInput.talks" :key="talk.id" class="transition pb-3">
        <div class="flex items-center">
          <label for="externalUrl" class="block flex-grow text-input-label"
            >発表枠{{ index + 1 }}</label
          >
          <button
            v-if="index !== 0"
            type="button"
            class="border border-green-500 hover:bg-green-500 text-green-500 hover:text-white transition duration-300 rounded px-1 text-xs mr-2"
            @click="swapTalkInput(index, index - 1)"
          >
            発表順を上げる
          </button>
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
import Swal from "sweetalert2";

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
    const currentTalkIds = props.initialEvent.talks
      .filter((talk) => !talk.isEmpty())
      .map((talk) => talk.id);

    const fillMinimalTalks = () => {
      while ((eventInput.talks.length || 0) < 3) {
        eventInput.talks.push(emptyTalk());
      }
    };

    const addTalkInput = (index?: number) => {
      eventInput.insertEmptyTalkAt(index);
    };

    const swapTalkInput = (index1: number, index2: number) => {
      [eventInput.talks[index1], eventInput.talks[index2]] = [
        eventInput.talks[index2],
        eventInput.talks[index1],
      ];
    };

    const removeTalk = (talkId: string) => {
      if (currentTalkIds.includes(talkId)) {
        Swal.fire({
          title: "発表枠の削除",
          text:
            "既存の発表を削除するとすでに投稿されたコメントが閲覧できなくなります。削除してよろしいですか？",
          icon: "warning",
          confirmButtonText: "削除する",
          showCancelButton: true,
          cancelButtonText: "キャンセル",
        }).then((result) => {
          if (result.isConfirmed) {
            eventInput.talks = eventInput.talks.filter((talk) => talk.id != talkId);
            fillMinimalTalks();
          }
        });
      }
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
      swapTalkInput,
      removeTalk,
      today,
    };
  },
});
</script>
