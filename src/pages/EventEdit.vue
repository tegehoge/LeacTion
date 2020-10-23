<template>
  <div>
    <div v-show="!passwordVerified" class="fixed z-10 inset-0 overflow-y-auto">
      <div
        class="flex item-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div class="fixed inset-0 transition-opacity">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-lg sm:w-full"
        >
          <div class="bg-white p-4">
            <div class="text-lg pb-2">パスワードの確認</div>
            <div class="flex items-center">
              <div class="flex-grow pr-3">
                <input
                  id="password"
                  ref="passwordInputForm"
                  v-model="passwordInput"
                  class="w-full border-2 rounded px-2 py-1"
                  type="password"
                  name="password"
                />
              </div>
              <div class="text-center">
                <button
                  class="px-2 py-1 bg-blue-500 text-white rounded"
                  type="button"
                  @click="verifyPassword"
                >
                  確認する
                </button>
              </div>
            </div>
            <div v-if="passwordHasError" class="text-red-500 text-sm">
              パスワードが間違っています
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="initialEvent">
      <h2 class="my-5 text-3xl text-center font-bold">イベントを編集する</h2>
      <EventInputForm :initial-event="initialEvent" @update-event="updateEvent" />
      <div class="text-center py-5">
        <div class="">
          <button
            type="button"
            :disabled="!formValidated"
            class="bg-blue-500 opacity-50 text-white px-4 py-2 rounded"
            :class="{ 'opacity-100 hover:bg-blue-700': formValidated }"
            @click="saveUpdatedEvent"
          >
            イベント情報を保存する
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

import EventInputForm from "../components/EventInputForm.vue";
import { emptyEvent, Event } from "../models/event";
import { findEventById, saveEvent, verifyEventPassword } from "../repository";

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
    const passwordInput = ref<string>("");
    const passwordVerified = ref<boolean>(false);
    const passwordHasError = ref(false);
    const passwordInputForm = ref<HTMLInputElement>();

    const updateEvent = (newEvent: Event) => {
      event.value = newEvent;
    };

    const formValidated = computed(() => {
      return event.value.isValid();
    });

    const verifyPassword = () => {
      verifyEventPassword(props.eventId, passwordInput.value).then((verified) => {
        if (verified) {
          passwordVerified.value = verified;
        } else {
          passwordHasError.value = true;
        }
      });
    };

    const saveUpdatedEvent = () => {
      saveEvent(event.value, passwordInput.value).then((currentEvent) => {
        router.push(`/event/${currentEvent.id}`);
      });
    };

    onMounted(() => {
      findEventById(props.eventId).then((currentEvent) => {
        initialEvent.value = currentEvent;
        event.value = currentEvent;
      });
      passwordInputForm.value?.addEventListener("keydown", (ev) => {
        if (ev.keyCode == 13 && passwordInput.value) {
          verifyPassword();
        }
      });
    });

    return {
      initialEvent,
      event,
      passwordInput,
      passwordVerified,
      passwordHasError,
      passwordInputForm,
      updateEvent,
      formValidated,
      saveUpdatedEvent,
      verifyPassword,
    };
  },
});
</script>
