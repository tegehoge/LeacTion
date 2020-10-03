<template>
  <div>
    <h2>TopPage!</h2>
    <div>
      <router-link to="/event/tegehoge">
        <span>Twitterログインしてイベントを作成(仮)</span>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Top",
  setup(props) {
    return {};
  },
});
</script>

<style></style>
