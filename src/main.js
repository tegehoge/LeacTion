import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import "./index.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrashAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons'

library.add(
  faTrashAlt,
  faThumbsUp
)

const app = createApp(App);
app.use(router);
app.mount("#app");
