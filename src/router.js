import { createRouter, createWebHistory } from "vue-router";
import Top from "./pages/Top.vue";
import Event from "./pages/Event.vue";
import NewEvent from "./pages/NewEvent.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Top },
    { path: "/new", component: NewEvent },
    { path: "/event/:eventId", component: Event, props: true },
  ],
});
