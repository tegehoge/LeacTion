<template>
  <header>
    <nav>
      <h1>LeacTion!</h1>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import { useRoute } from "vue-router";
import { UserContext } from "./models/user_context";

export default defineComponent({
  name: "App",
  setup() {
    const createOrGetUserContext = () => {
      if (localStorage.user_context) {
        return UserContext.fromJSON(localStorage.user_context);
      } else {
        const userContext = new UserContext();
        localStorage.setItem("user_context", userContext.toJSON());
        return userContext;
      }
    };
    const userContext = createOrGetUserContext();
    return { userContext };
  },
});
</script>
