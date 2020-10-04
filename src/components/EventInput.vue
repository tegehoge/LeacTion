<template>
  <form class="w-full max-w-3xl mx-auto px-2 pt-3">
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="event_name"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >イベント名</label
        >
      </div>
      <div class="md:w-2/3">
        <input
          type="text"
          name="event_name"
          id="event_name"
          v-model="event.name"
          placeholder="Webナイト宮崎 vol.1"
          class="w-full border-2 border-gray-400 rounded px-2 py-2"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="date_of_event"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >開催日</label
        >
      </div>
      <div class="md:w-2/3">
        <input
          type="date"
          name="date_of_event"
          id="date_of_event"
          v-model="event.date_of_event"
          placeholder="yyyy-mm-dd"
          class="w-full border-2 border-gray-400 rounded px-2 py-2"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="external_url"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >イベントページのURL</label
        >
      </div>
      <div class="md:w-2/3">
        <input
          type="text"
          name="external_url"
          id="external_url"
          v-model="event.external_url"
          placeholder="connpassイベントURLなど"
          class="w-full border-2 border-gray-400 rounded px-2 py-2"
        />
      </div>
    </div>
    <div
      class="w-full md:flex md:items-center py-1"
      v-for="(talk, index) in event.talks"
      :key="talk.id"
    >
      <div class="md:w-1/6 mb-1 md:mb-0">
        <label
          for="external_url"
          class="block text-gray-700 font-bold md:text-right pr-4 md:mb-0"
          >発表枠{{ index + 1 }}</label
        >
      </div>
      <div class="md:w-1/4 md:px-1 mb-1 md:mb-0">
        <input
          type="text"
          class="w-full border-2 border-gray-400 rounded p-2"
          placeholder="発表者名"
          v-model="talk.speaker_name"
        />
      </div>
      <div class="md:flex-grow md:px-1 mb-1 md:mb-0">
        <input
          type="text"
          class="w-full border-2 border-gray-400 rounded p-2"
          placeholder="発表タイトル"
          v-model="talk.title"
        />
      </div>
      <div class="pl-1">
        <button type="button" class="text-red-500" @click="removeTalk(talk.id)">
          消</button
        ><!-- FIXME: FontAwesome -->
      </div>
    </div>
    <div class="md:flex py-1">
      <div class="md:w-1/6"></div>
      <div class="md:w-5/6 md:px-1">
        <button
          type="button"
          class="w-full border-2 border-green-500 hover:bg-green-500 hover:text-white text-green-500 px-4 py-1 rounded transition duration-100"
          @click="addTalkInput"
        >
          発表枠を追加する
        </button>
      </div>
    </div>
    <div class="md:flex md:items-center mt-6 mb-2">
      <div class="md:w-1/3">
        <label
          for="password"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >管理者パスワード</label
        >
      </div>
      <div class="md:w-2/3">
        <input
          type="password"
          name="password"
          id="password"
          v-model="eventPassword"
          placeholder="パスワード"
          class="border-2 border-gray-400 rounded px-2 py-2"
        />
      </div>
    </div>
    <div class="md:flex md:items-center mb-6">
      <div class="md:w-1/3">
        <label
          for="password_confirm"
          class="block text-gray-700 font-bold md:text-right pr-4 mb-1 md:mb-0"
          >管理者パスワード（確認用）</label
        >
      </div>
      <div class="md:w-2/3">
        <input
          type="password"
          name="password_confirm"
          id="password_confirm"
          v-model="eventPasswordConfirm"
          placeholder="パスワード（確認用）"
          class="border-2 border-gray-400 rounded px-2 py-2"
        />
      </div>
    </div>
    <div class="text-center py-5">
      <div class="">
        <button
          type="button"
          class="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
          @click="saveCurrentEvent"
        >
          イベント情報を保存する
        </button>
      </div>
    </div>
  </form>
</template>
<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, onMounted, reactive, ref } from "vue";
import { Event } from "../models/event";
import { emptyTalk } from "../models/talk";
import { saveEvent } from "../repository";
export default defineComponent({
  name: "EventInput",
  props: {
    event: Event,
  },
  setup(props, context) {
    const event_data =
      props.event || new Event("", dayjs().format("YYYY-MM-DD"));
    const event = reactive(event_data);
    const eventPassword = ref("");
    const eventPasswordConfirm = ref("");

    const fillMinimalTalks = () => {
      while (event.talks.length < 3) {
        event.talks.push(emptyTalk());
      }
    };

    const saveCurrentEvent = () => {
      event_data.talks = event_data.talks.filter((talk) => !talk.isEmpty());
      console.log(JSON.stringify(event_data));
      saveEvent(event_data);
      fillMinimalTalks();
    };

    const addTalkInput = () => {
      event_data.talks.push(emptyTalk());
    };

    const removeTalk = (talk_id: string) => {
      event_data.talks = event_data.talks.filter((talk) => talk.id != talk_id);
    };

    onMounted(() => {
      fillMinimalTalks();
    });

    return {
      event,
      eventPassword,
      eventPasswordConfirm,
      saveCurrentEvent,
      addTalkInput,
      removeTalk,
    };
  },
});
</script>
