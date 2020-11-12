import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashAlt,
  faThumbsUp,
  faSpinner,
  faBars,
  faShareAlt,
  faEdit,
  faPlusSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import AppHeader from "./components/AppHeader.vue";

library.add(faTrashAlt, faThumbsUp, faSpinner, faBars, faShareAlt, faEdit, faPlusSquare);

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.component("AppHeader", AppHeader);

app.use(router);
app.mount("#app");
