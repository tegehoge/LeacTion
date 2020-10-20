<template>
  <div>
    <h2 class="my-5 text-3xl text-center font-bold">新規イベントを登録する</h2>

    <EventInputForm :initial-event="initialEvent" @update-event="updateEvent" />

    <h3 class="w-full mt-3 p-5 border-t-2 text-xl text-center font-bold">編集用パスワードの設定</h3>
    <div class="max-w-4xl mx-auto md:flex md:items-start px-2">
      <div class="w-full md:w-1/2 md:px-10">
        <div>
          <label for="password" class="text-input-label">管理者パスワード</label>
        </div>
        <div>
          <input
            id="password"
            v-model="eventPassword"
            type="password"
            name="password"
            placeholder="パスワード"
            :class="{ 'border-red-500': invalidPassword }"
            class="text-input-form w-full"
          />
        </div>
      </div>
      <div class="w-full md:w-1/2 md:px-10">
        <div>
          <label for="password_confirm" class="text-input-label">管理者パスワード（確認用）</label>
        </div>
        <div>
          <input
            id="password_confirm"
            v-model="eventPasswordConfirm"
            type="password"
            name="password_confirm"
            placeholder="パスワード（確認用）"
            :class="{ 'border-red-500': invalidPassword }"
            class="text-input-form w-full"
          />
        </div>
        <span v-show="invalidPassword" class="text-red-500 ml-2 text-sm"
          >パスワードが一致していません</span
        >
      </div>
    </div>

    <div class="text-center py-8">
      <div class="">
        <button
          type="button"
          :disabled="!formValidated"
          class="bg-blue-500 opacity-50 cursor-not-allowed text-white px-4 py-2 rounded"
          :class="{ 'opacity-100 hover:bg-blue-700 cursor-default': formValidated }"
          @click="saveCurrentEvent"
        >
          イベントを作成する
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { ref, defineComponent, computed } from "vue";
import { useRouter } from "vue-router";

import { Event } from "../models/event";
import { saveEvent } from "../repository";
import EventInputForm from "../components/EventInputForm.vue";

export default defineComponent({
  name: "NewEvent",
  components: { EventInputForm },
  setup() {
    const router = useRouter();

    const initialEvent = new Event("", dayjs().format("YYYY-MM-DD"));
    const event = ref<Event>(initialEvent);

    const updateEvent = (e: Event): void => {
      event.value = e;
    };

    const saveCurrentEvent = () => {
      if (formValidated.value && eventPassword.value != null) {
        event.value.talks = event.value.talks.filter((talk) => !talk.isEmpty());
        // console.log(JSON.stringify(event));
        saveEvent(event.value, eventPassword.value)
          .then((savedEvent) => {
            router.push(`/event/${savedEvent.id}`);
          })
          .catch((e) => {
            console.error(e);
          });
      }
    };

    const eventPassword = ref<string | null>(null);
    const eventPasswordConfirm = ref<string | null>(null);
    const invalidPassword = computed(() => {
      if (eventPasswordConfirm.value == null) {
        return null; // 未入力
      }
      if (
        (eventPassword.value || "").length > 0 &&
        eventPassword.value == eventPasswordConfirm.value
      ) {
        return false;
      }
      return true;
    });

    const formValidated = computed(() => {
      return event.value.isValidFuture() && invalidPassword.value == false;
    });

    return {
      initialEvent,
      event,
      updateEvent,
      saveCurrentEvent,
      eventPassword,
      eventPasswordConfirm,
      invalidPassword,
      formValidated,
    };
  },
});
</script>
