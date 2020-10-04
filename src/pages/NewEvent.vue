<template>
  <div>
    <h2 class="my-3 text-2xl font-bold">新規イベントを登録する</h2>
    <EventInput :event="event"></EventInput>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import { ref, defineComponent, reactive } from "vue";
import { Event } from "../models/event";
import EventInput from "../components/EventInput.vue";
export default defineComponent({
  name: "NewEvent",
  components: { EventInput },
  setup(props, context) {
    const event = reactive(new Event("", dayjs().format("YYYY-MM-DD")));
    return { event };
  },
});
</script>
