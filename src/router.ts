import { createRouter, createWebHistory } from "vue-router";
import { trackRouter } from "vue-gtag-next";
import Top from "./pages/Top.vue";
import Event from "./pages/Event.vue";
import NewEvent from "./pages/NewEvent.vue";
import EventEdit from "./pages/EventEdit.vue";
import Terms from "./pages/Terms.vue";
import NotFound from "./pages/NotFound.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", component: Top },
    { path: "/new", component: NewEvent },
    { path: "/event/:eventId", component: Event, props: true },
    { path: "/event/:eventId/edit", component: EventEdit, props: true },
    { path: "/terms", component: Terms },
    { path: "/:any(.*)", component: NotFound },
  ],
});

trackRouter(router);

export default router;
