<template>
  <div>
    <input type="text" name="comment" id="comment" v-model="comment" />
    <button type="submit" @click="sendComment()">send</button>
  </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default {
  setup(props) {
    const comment = ref("");
    const sendComment = () => {
      console.log(comment.value);
      comment.value = "";
    };
    return { comment, sendComment };
  },
};
</script>
