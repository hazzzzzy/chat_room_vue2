// plugins/socket.js
import io from "socket.io-client";
import Notify from "@/utils/notify";
import { getCache } from "@/utils/useCache";
import router from "@/route"; // 引入 Vue Router 实例（如果你需要跳转登录页）

let socket = null;
function createWs() {
  if (!getCache(process.env.VUE_APP_USERNAME_KEY)) {
    Notify.error("未登录");
    router.push("/login");
  }
  // 替换成你的后端 WebSocket 地址
  socket = io("http://10.1.12.187:10086", {
    reconnection: true, // 开启重连
    reconnectionAttempts: 5, // 最多重连 5 次
    reconnectionDelay: 5000, // 每次重连间隔 2000ms
    timeout: 5000, // 连接超时时间
    autoConnect: true, // 自动连接
    transports: ["websocket"],
  });

  //底层
  // 重连尝试
  socket.io.on("reconnect_attempt", (attempt) => {
    Notify.warning(`重连尝试第${attempt}次`);
  });
  // 重连失败
  socket.io.on("reconnect_failed", () => {
    Notify.error("重连失败，请刷新页面、检查网络或联系管理员");
  });

  //自定义
  // 用户上线
  socket.on("join", (data) => {
    Notify.info(`${data.username}(${data.sid})上线了`);
  });
  // 用户下线
  socket.on("leave", (data) => {
    Notify.info(`${data.username}(${data.sid})下线了`);
  });
  // 获取报错信息
  socket.on("error", (data) => {
    if (data.msg != null) {
      Notify.error(data.msg);
    }
  });
}

export default {
  install(Vue) {
    Vue.prototype.$createWs = createWs;
    Vue.prototype.$getSocket = () => socket;
  },
};
