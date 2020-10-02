<template>
  <header>
    <nav>
      <h1>LeacTion!</h1>
    </nav>
  </header>
  <main>
    <Event></Event>
  </main>
</template>

<script lang="ts">
import Event from "./components/Event.vue";
import { UserContext } from "./models/user_context";

export default {
  name: "App",
  components: {
    Event,
  },
  setup() {
    const user_context = localStorage.user_context
      ? UserContext.fromJSON(localStorage.user_context)
      : new UserContext();
    localStorage.setItem("user_context", user_context.toJSON());
  },
};
</script>
