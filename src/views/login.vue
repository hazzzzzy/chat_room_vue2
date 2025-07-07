<template>
  <div class="main">
    <el-card class="loginElement" shadow="hover">
      <h3>欢迎使用浩贤聊天室</h3>
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
            Notify.success(`欢迎用户 ${r.data.username} ，吴浩贤除外`);
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

  /* NEW BACKGROUND STYLES START */
  background: linear-gradient(
    135deg,
    #7f7fd3,
    #86a8e7,
    #91eae4,
    #86e7ad,
    #86e7a6
  ); /* A soothing blue/purple gradient */
  background-size: 400% 400%; /* Make the gradient larger than the viewport for animation */
  animation: gradientAnimation 10s ease infinite; /* Subtle animation */
  /* NEW BACKGROUND STYLES END */

  h3 {
    margin-top: 0;
    margin-bottom: 30px;
  }

  .loginElement {
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

/* Keyframes for the gradient animation */
@keyframes gradientAnimation {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>