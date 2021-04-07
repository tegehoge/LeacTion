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
      <label for="talks" class="text-input-label">イベントの発表順 (順序を変更できます)</label>
    </div>
    <draggable
      v-if="eventInput"
      v-model="eventInput.talks"
      item-key="id"
      handle=".handle"
      class="list-group"
      tag="transition-group"
      v-bind="dragOptions"
      :component-data="{ name: 'fade' }"
      @start="drag = true"
      @end="drag = false"
    >
      <template #item="{ element }">
        <div class="flex items-center py-2">
          <div
            class="handle text-xl px-2"
            :class="{ 'cursor-grabbing': drag, 'cursor-grab': !drag }"
          >
            <font-awesome-icon :icon="['fas', 'grip-lines']" />
          </div>
          <div class="flex-grow md:flex md:items-center">
            <div class="w-full md:w-1/3 mb-1 md:mb-0">
              <input
                v-model.trim="element.speakerName"
                type="text"
                class="text-input-form w-full"
                placeholder="発表者名"
                @input="updateEvent"
              />
            </div>
            <div class="w-full md:w-2/3 md:flex-grow md:pl-2 mb-1 md:mb-0">
              <input
                v-model.trim="element.title"
                type="text"
                class="text-input-form w-full"
                placeholder="発表タイトル"
                @input="updateEvent"
              />
            </div>
          </div>
          <div class="ml-2">
            <button class="px-2 py-1 text-red-300 text-lg" @click="removeTalk(element.id)">
              <font-awesome-icon :icon="['fas', 'trash-alt']" />
            </button>
          </div>
        </div>
      </template>
    </draggable>
    <div class="my-2">
      <button
        type="button"
        class="w-full border-2 border-green-500 text-green-500 hover:bg-green-500 hover:border-white hover:text-white text-lg p-2 rounded"
        @click="addTalkInput()"
      >
        <font-awesome-icon :icon="['fas', 'plus-square']" class="mr-2" />発表枠の追加
      </button>
    </div>
  </form>
</template>
<script lang="ts">
import dayjs from "dayjs";
import { defineComponent, onMounted, ref, reactive } from "vue";
import Swal from "sweetalert2";
import draggable from "vuedraggable";

import { Event } from "../models/event";
import { emptyTalk } from "../models/talk";

export default defineComponent({
  name: "EventInput",
  components: { draggable },
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

    const drag = ref(false);
    const dragOptions = {
      animation: 200,
      group: "description",
      disabled: false,
      ghostClass: "ghost",
    };

    const fillMinimalTalks = () => {
      while ((eventInput.talks.length || 0) < 1) {
        eventInput.talks.push(emptyTalk());
      }
    };

    const addTalkInput = (index?: number) => {
      eventInput.insertEmptyTalkAt(index);
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
      if (eventInput.talks.length === 0) {
        eventInput.talks = [emptyTalk(), emptyTalk(), emptyTalk()];
      }
    });

    return {
      eventInput,
      updateEvent,
      addTalkInput,
      removeTalk,
      today,
      drag,
      dragOptions,
    };
  },
});
</script>

<style scoped>
.ghost {
  opacity: 0.5;
}
</style>
