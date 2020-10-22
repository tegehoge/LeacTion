import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faTrashAlt, faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(faTrashAlt, faThumbsUp);

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);

app.use(router);
app.mount("#app");
