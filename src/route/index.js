import Vue from "vue";
import VueRouter from "vue-router";
import Notify from "@/utils/notify";

import home from "@/views/home.vue";
import room from "@/views/room.vue";
import main from "@/views/main.vue";
import notfound from "@/views/404.vue";
import login from "@/views/login.vue";
// import { Message } from "element-ui"; // ✅ 手动引入 Message 组件
import { getCache } from "@/utils/useCache";

Vue.use(VueRouter);

const routes = [
  { path: "/login", component: login },
  {
    path: "/",
    component: main,
    children: [
      { path: "/home", component: home },
      { path: "/room", component: room },
    ],
  },
  { path: "*", component: notfound },
];

const router = new VueRouter({
  mode: "history", // history 模式不会带 # 号
  routes,
});

router.beforeEach((to, from, next) => {
  let isAuthenticated = getCache(process.env.VUE_APP_USERNAME_KEY);
  if (to.path !== "/login" && !isAuthenticated) {
    Notify.error("检测到用户未登录，请登录后使用");
    next({ path: "/login" });
    // } else if (to.path === "/login" && isAuthenticated) {
    //   next({ path: "/login" });
  } else next();
});

export default router;
