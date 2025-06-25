import axios from "axios";
import Notify from "./notify"; // ✅ 手动引入 Message 组件
import { getCache } from "@/utils/useCache";
import router from "@/route"; // 引入 Vue Router 实例（如果你需要跳转登录页）

// const ignoreList = ["/login"];

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000,
  // headers: { "Content-Type": "application/json" },
});

// 2. 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = getCache(process.env.VUE_APP_TOKEN_KEY); // 或从你的 Vuex/Redux store 获取
    // 如果 Token 存在，就添加到请求头中
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config; // 必须返回 config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    if (response.headers["content-disposition"] != null) {
      return response;
    }

    let data = response.data;
    if (data.code === -2) {
      Notify.error(data.msg);
      router.push("/login");
      return Promise.reject(data.msg);
    } else if (data.code === -1) {
      Notify.error(data.msg);
      return Promise.reject(data.msg);
    } else {
      return response.data;
    }
  },
  (error) => {
    Notify.error(
      error.response?.data?.msg || error.message || "服务器故障，请联系管理员"
    );
    return Promise.reject(error);
  }
);

export default http;
