import Vue from "vue";
import VueRouter from "vue-router";
import Notify from "@/utils/notify";

import home from "@/views/home.vue";
import room from "@/views/room.vue";
import main from "@/views/main.vue";
import notfound from "@/views/404.vue";
import index from "@/views/index.vue";
import login from "@/views/login.vue";
import chat from "@/views/chat.vue";
import user from "@/views/user.vue";
import test from "@/views/test.vue";

import { getCache } from "@/utils/useCache";
import { socket } from "@/utils/websocket";
Vue.use(VueRouter);

const routes = [
  { path: "/", component: home },
  { path: "/login", component: login },
  {
    path: "/",
    component: main,
    children: [
      { path: "/index", component: index },
      { path: "/room", component: room },
      { path: "/chat", component: chat },
      { path: "/user", component: user },
      { path: "/test", component: test },
    ],
  },
  { path: "*", component: notfound },
];

const router = new VueRouter({
  mode: "history", // history 模式不会带 # 号
  routes,
});

router.beforeEach((to, from, next) => {
  let isAuthenticated = getCache(process.env.VUE_APP_TOKEN_KEY);
  if (to.path !== "/login" && !isAuthenticated && to.path != "/") {
    Notify.error("检测到用户未登录，请登录后使用");
    next({ path: "/login" });
    // } else if (to.path === "/login" && isAuthenticated) {
    //   next({ path: "/login" });
  } else if (socket && socket.connected && from.path == "/room") {
    socket.disconnect();
    next();
  } else {
    next();
  }
});

export default router;
