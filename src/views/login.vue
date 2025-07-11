<template>
  <div class="main">
    <!-- 新增 ChatWave 标题 -->
    <div class="title">ChatWave</div>
    <el-card class="loginElement" shadow="hover">
      <h3>欢迎使用ChatWave</h3>
      <el-form
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        class="demo-form-inline"
        @keyup.enter.native="login"
      >
        <el-form-item prop="account">
          <el-input
            v-model="loginForm.account"
            placeholder="请输入账号"
            clearable
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入密码"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login" style="width: 100%"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// import ParticlesBackground from "@/components/ParticlesBackground.vue";
import http from "@/utils/r";
import Notify from "@/utils/notify";
import { setCache } from "@/utils/useCache";

export default {
  // components: {
  //   ParticlesBackground,
  // },
  data() {
    return {
      loginForm: {
        account: "",
        password: "",
      },
      rules: {
        account: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    async login() {
      this.$refs.loginForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        await http
          .post("/login", {
            account: this.loginForm.account,
            password: this.loginForm.password,
          })
          .then((r) => {
            setCache(process.env.VUE_APP_USERNAME_KEY, r.data.username);
            setCache(process.env.VUE_APP_USERID_KEY, r.data.userID);
            setCache(process.env.VUE_APP_TOKEN_KEY, r.data.token);
            setCache(process.env.VUE_APP_AVATAR_KEY, r.data.avatar);
            Notify.success(`欢迎，${r.data.username}`);

            this.$router.push("/room");
          })
          .catch((r) => {
            console.error(r);
          });
      });
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%; /* Ensure the parent container fills the entire screen */
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  z-index: 1; // 内容位于上层

  .title {
    position: absolute;
    top: 50%;
    left: 25%; /* 左半边中心 */
    transform: translate(-50%, -50%);
    font-size: 100px;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    font-family: "Segoe UI", sans-serif;
    user-select: none;
    pointer-events: none;
  }

  .loginElement {
    h3 {
      margin-top: 0;
      margin-bottom: 30px;
    }
    margin-right: 100px;
    display: flex;
    flex-direction: column;
    text-align: center;
    min-width: 300px; /* Ensure the login box has a minimum width */
    min-height: 300px; /* Ensure the login box has a minimum height */
    background: rgba(255, 255, 255, 0.5); /* Transparent background */
    backdrop-filter: blur(10px); /* Frosted glass effect */
  }
}
.main::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1; // 背景在下面
  background: linear-gradient(
    135deg,
    #7f7fd3,
    #86a8e7,
    #91eae4,
    #86e7ad,
    #86e7a6
  );
  background-size: 400% 400%;
  animation: gradientAnimation 10s ease infinite, hueRotate 20s linear infinite;
}
/* Keyframes for the gradient animation */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

@keyframes hueRotate {
  0% {
    filter: hue-rotate(0deg);
  }
  100% {
    filter: hue-rotate(360deg);
  }
}
</style>