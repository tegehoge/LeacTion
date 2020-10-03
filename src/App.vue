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
import { defineComponent, onMounted, provide } from "vue";
import { useRoute } from "vue-router";
import { UserContext } from "./models/user_context";
import {
  LocalStorageEventRepository,
  LocalStorageCommentRepository,
} from "./repository/local_storage";
import {
  FirebaseCommentRepository,
  FirebaseEventRepository,
} from "./repository/firebase";

export default defineComponent({
  name: "App",
  setup() {
    provide(
      "event_repository",
      process.env.NODE_ENV == "production"
        ? new FirebaseEventRepository()
        : new LocalStorageEventRepository()
    );

    provide(
      "comment_repository",
      process.env.NODE_ENV == "production"
        ? new FirebaseCommentRepository()
        : new LocalStorageCommentRepository()
    );

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
