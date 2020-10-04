import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory } from "vue-router";
import Top from "./pages/Top.vue";
import Event from "./pages/Event.vue";
import NewEvent from "./pages/NewEvent.vue";
import "./index.css";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Top },
    { path: "/new", component: NewEvent },
    { path: "/event/:event_id", component: Event, props: true },
  ],
});

const app = createApp(App);
app.use(router);
app.mount("#app");
