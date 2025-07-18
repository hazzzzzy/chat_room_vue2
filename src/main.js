import Vue from "vue";
import App from "./App.vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import router from "./route";
import socketPlugin from "@/utils/websocket";

Vue.config.productionTip = false;

Vue.use(ElementUI);
Vue.use(socketPlugin);

// Vue.prototype.$avatarList = Vue.observable({}); // 提前响应式挂载，后续组件中直接 this.$avatarMap 访问

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
