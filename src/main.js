import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faTrashAlt,
  faThumbsUp,
  faCheck,
  faSpinner,
  faBars,
  faShareAlt,
  faEdit,
  faPlusSquare,
  faClipboard,
  faArrowCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from "./App.vue";
import router from "./router";
import "./index.css";
import AppHeader from "./components/AppHeader.vue";

library.add(
  faTrashAlt,
  faThumbsUp,
  faCheck,
  faSpinner,
  faBars,
  faShareAlt,
  faEdit,
  faPlusSquare,
  faClipboard,
  faArrowCircleDown
);
library.add(faTwitter, faGithub);

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.component("AppHeader", AppHeader);

app.use(router);
app.mount("#app");
