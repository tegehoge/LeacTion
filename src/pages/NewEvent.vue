<template>
  <div>
    <h2 class="my-3 text-2xl font-bold">新規イベントを登録する</h2>
    <EventInputForm :event="event"></EventInputForm>
    <NewPasswordForm></NewPasswordForm>

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
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { ref, defineComponent, reactive } from "vue";
import { Event } from "../models/event";
import { saveEvent } from "../repository";
import { emptyTalk } from "../models/talk";
import EventInputForm from "../components/EventInputForm.vue";
import NewPasswordForm from "../components/NewPasswordForm.vue";
export default defineComponent({
  name: "NewEvent",
  components: { EventInputForm, NewPasswordForm },
  setup(props, context) {
    const event = reactive(new Event("", dayjs().format("YYYY-MM-DD")));

    const saveCurrentEvent = () => {
      event.talks = event.talks.filter((talk) => !talk.isEmpty());
      console.log(JSON.stringify(event));
      saveEvent(event);
    };
    return { event, saveCurrentEvent };
  },
});
</script>
