<template>
  <div>
    <h2 class="my-3 text-2xl font-bold">新規イベントを登録する</h2>

    <EventInputForm :event="event"></EventInputForm>

    <h3 class="w-full mt-3 pt-3 border-t-2 text-xl font-bold">
      イベントを編集するためのパスワードを設定してください
    </h3>
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
          :class="{ 'border-red-500': invalidPassword }"
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
          :class="{ 'border-red-500': invalidPassword }"
          class="border-2 border-gray-400 rounded px-2 py-2"
        />
        <span v-show="invalidPassword" class="text-red-500 ml-2"
          >パスワードが一致していません</span
        >
      </div>
    </div>

    <div class="text-center py-5">
      <div class="">
        <button
          type="button"
          class="bg-blue-500 opacity-50 text-white px-4 py-2 rounded"
          @click="saveCurrentEvent"
          :class="{ 'opacity-100 hover:bg-blue-700': formValidated }"
          :disabled="!formValidated"
        >
          イベント情報を保存する
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { ref, defineComponent, reactive, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { Event } from "../models/event";
import { saveEvent } from "../repository";
import { emptyTalk } from "../models/talk";
import EventInputForm from "../components/EventInputForm.vue";
export default defineComponent({
  name: "NewEvent",
  components: { EventInputForm },
  setup(props, context) {
    const router = useRouter();

    const event: Event = reactive(new Event("", dayjs().format("YYYY-MM-DD")));

    const saveCurrentEvent = () => {
      if (formValidated.value && eventPassword.value != null) {
        event.talks = event.talks.filter((talk) => !talk.isEmpty());
        // console.log(JSON.stringify(event));
        saveEvent(event, eventPassword.value)
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
      return event.isValidFuture() && invalidPassword.value == false;
    });

    return {
      event,
      saveCurrentEvent,
      eventPassword,
      eventPasswordConfirm,
      invalidPassword,
      formValidated,
    };
  },
});
</script>
