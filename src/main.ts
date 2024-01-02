import { createApp } from "vue";
import App from "./App.vue";
import installComponent from "./index";

const app = createApp(App);
installComponent(app);
app.mount("#app");
