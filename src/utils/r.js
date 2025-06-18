import axios from "axios";
import { Message } from "element-ui"; // ✅ 手动引入 Message 组件
import { getCache } from "@/utils/useCache";
import router from "@/route"; // 引入 Vue Router 实例（如果你需要跳转登录页）

const http = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  timeout: 10000,
  // headers: { "Content-Type": "application/json" },
});

// 请求拦截器
// http.interceptors.request.use(
//   (config) => {
//     const username = getCache("username");
//     if (!username) {
//       router.push("/login");
//       return Promise.reject(new Error("未登录，已跳转登录页"));
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 响应拦截器
http.interceptors.response.use(
  (response) => {
    if (response.headers["content-disposition"] != null) {
      return response;
    }

    let data = response.data;
    if (data.code !== 0) {
      Message.error(data.msg); // ✅ 直接调用 Message.error
      return Promise.reject(data.msg); // 确保错误被捕获
    } else {
      return response.data;
    }
  },
  (error) => {
    Message.error(
      error.response?.data?.msg || error.message || "服务器故障，请联系管理员"
    );
    return Promise.reject(error);
  }
);

export default http;
