<template>
  <header>
    <nav class="p-3 bg-blue-700 text-white">
      <div class=""><h1 class="text-2xl">LeacTion!</h1></div>
    </nav>
  </header>
  <main class="container mx-auto">
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
