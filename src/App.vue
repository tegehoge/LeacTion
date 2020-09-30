<template>
  <header>
    <nav>
      <h1>LeacTion!</h1>
    </nav>
  </header>
  <main>
    <CommentInput></CommentInput>
  </main>
</template>

<script lang="ts">
import CommentInput from "./components/CommentInput.vue";

export default {
  name: "App",
  components: {
    CommentInput,
  },
};
</script>
