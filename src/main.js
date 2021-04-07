import { createApp } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowCircleDown,
  faBars,
  faCheck,
  faClipboard,
  faEdit,
  faGripLines,
  faPlusSquare,
  faShareAlt,
  faSpinner,
  faThumbsUp,
  faTrashAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "sweetalert2/dist/sweetalert2.min.css";

import App from "./App.vue";
import router from "./router";
import "./index.css";
import AppHeader from "./components/AppHeader.vue";

library.add(
  faArrowCircleDown,
  faBars,
  faCheck,
  faClipboard,
  faEdit,
  faGripLines,
  faPlusSquare,
  faShareAlt,
  faSpinner,
  faThumbsUp,
  faTrashAlt
);
library.add(faTwitter, faGithub);

const app = createApp(App);

app.component("FontAwesomeIcon", FontAwesomeIcon);
app.component("AppHeader", AppHeader);

app.use(router);
app.mount("#app");
