<template>
  <app-header></app-header>
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
      <p>
        <a href="/terms" target="_blank" rel="noopener noreferrer" class="text-blue-500 underline"
          >利用規約</a
        >に同意して
      </p>
      <div class="">
        <button
          type="button"
          :disabled="!formValidated"
          class="bg-blue-500 opacity-50 pointer-events-none text-white px-4 py-2 rounded"
          :class="{ 'opacity-100 hover:bg-blue-700 pointer-events-auto': formValidated }"
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
import { ref, defineComponent, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

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
            Swal.fire({
              title: "完了！",
              html: `イベントを作成しました！<br />URLを共有してイベントを盛り上げましょう！`,
              icon: "success",
            });
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

    onMounted(() => {
      Swal.fire({
        icon: "warning",
        title: "サービス利用に関する注意",
        html:
          '<ul class="list-disc leading-relaxed text-left">' +
          "<li>本サービスへ投稿されたイベント名やコメントは全て一般公開されています。<br>他の利用者を不快にさせるコメントや公開してはならない情報は書き込まないようにイベント参加者へ注意喚起をお願いします。</li>" +
          '<li>個別のサポートは行っておりません。不具合報告・要望などは<a class="text-blue-500" href="https://github.com/tegehoge/LeacTion/issues/new" target="_blank" rel="noopener noreferrer">Github</a>へ投稿してください。</li>' +
          "<li>予告なくサービスの変更や停止を行う場合があります。予めご了承ください。</li>" +
          "</ul>",
        confirmButtonText: "確認しました",
        allowOutsideClick: false,
        width: "80vw",
      });
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
