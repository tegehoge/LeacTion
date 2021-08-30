<template>
  <app-header></app-header>
  <div>
    <div v-if="initialEvent">
      <h2 class="my-5 text-3xl text-center font-bold">イベントを編集する</h2>
      <EventInputForm :initial-event="initialEvent" @update-event="updateEvent" />
      <div class="text-center py-5">
        <div class="">
          <button
            type="button"
            :disabled="!formValidated"
            class="bg-blue-500 opacity-50 text-white mx-2 px-4 py-2 rounded"
            :class="{ 'opacity-100 hover:bg-blue-700': formValidated }"
            @click="saveUpdatedEvent"
          >
            イベント情報を保存する
          </button>
          <button
            type="button"
            :disabled="event.isArchived"
            class="bg-red-500 opacity-50 text-white mx-2 px-4 py-2 rounded"
            :class="{ 'opacity-100': !event.isArchived }"
            @click="archiveCurrentEvent"
          >
            イベントをアーカイブする
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";

import EventInputForm from "../components/EventInputForm.vue";
import { emptyEvent, Event } from "../models/event";
import { findEventById, saveEvent, verifyEventPassword, archiveEvent } from "../repository";

export default defineComponent({
  name: "EventEdit",
  components: { EventInputForm },
  props: {
    eventId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const initialEvent = ref<Event>();
    const event = ref<Event>(emptyEvent());
    let passwordInput = "";

    const updateEvent = (newEvent: Event) => {
      event.value = newEvent;
    };

    const formValidated = computed(() => {
      return event.value.isValid() && !event.value.isArchived;
    });

    const saveUpdatedEvent = () => {
      event.value.talks = event.value.talks.filter((talk) => !talk.isEmpty());
      saveEvent(event.value, passwordInput).then((currentEvent) => {
        Swal.fire({
          title: "イベント情報を保存しました",
          icon: "info",
          toast: true,
          timer: 2000,
          position: "top-end",
          showConfirmButton: false,
        });
        router.push(`/event/${currentEvent.id}`);
      });
    };

    const archiveCurrentEvent = async () => {
      const confirmResult = await Swal.fire({
        title: "アーカイブするとコメントできなくなります。<br>本当に削除しますか？",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "アーカイブ",
        cancelButtonText: "キャンセル",
        confirmButtonColor: "red",
      });
      if (confirmResult.isConfirmed) {
        const archiveResult = await archiveEvent(event.value.id, passwordInput);
        if (archiveResult) {
          router.push(`/event/${event.value.id}`);
        } else {
          console.error("Failed to archive event.");
        }
      }
    };

    onMounted(() => {
      findEventById(props.eventId).then((currentEvent) => {
        initialEvent.value = currentEvent;
        event.value = currentEvent;
      });
      Swal.fire({
        title: "認証",
        allowOutsideClick: false,
        input: "password",
        inputPlaceholder: "パスワード",
        inputValidator: (value: string) =>
          verifyEventPassword(props.eventId, value)
            .then((verified) => {
              // console.dir({ verified });
              if (!verified) {
                return "パスワードが間違っています";
              }
              passwordInput = value;
              return null;
            })
            .catch((e) => {
              console.error(e);
              return "エラーのため編集できません";
            }),
        confirmButtonText: "確認する",
        showCancelButton: true,
        cancelButtonText: "戻る",
      }).then((result) => {
        if (result.isDismissed) {
          router.back();
        }
      });
    });

    return {
      initialEvent,
      event,
      updateEvent,
      formValidated,
      saveUpdatedEvent,
      archiveCurrentEvent,
    };
  },
});
</script>
