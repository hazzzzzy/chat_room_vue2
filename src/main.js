import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./route";
import socketPlugin from "@/utils/websocket";

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(socketPlugin);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
