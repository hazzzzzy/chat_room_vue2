<template>
  <div class="main" :style="{ backgroundImage: `url('/bg.jpg')` }">
    <!-- <ParticlesBackground /> -->
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
            this.$router.push("/home");
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
  height: 100%; /* 确保父容器填充整个屏幕 */
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  // background-image: url("/GITB0AJa0AA_7dK.jpg"); /* 直接从 public 目录加载 */
  background-size: cover;
  background-position: center;

  h3 {
    margin-top: 0;
    margin-bottom: 30px;
  }

  .loginElement {
    margin-right: 100px;

    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
    text-align: center;
    // padding: 10px;
    max-width: 300px; /* 让登录框有最小宽度，避免太窄 */
    max-height: 300px; /* 让登录框有最小宽度，避免太窄 */
    background: rgba(255, 255, 255, 0.5); /* 透明背景 */
    backdrop-filter: blur(10px); /* 毛玻璃效果 */

    // .demo-form-inline {
    //   display: flex;
    //   flex-direction: column;
    //   justify-content: center;
    //   align-items: center;
    // }
  }
}

.loginElement {
  margin-right: 100px;

  display: flex;
  flex-direction: column;
  // justify-content: center;
  // align-items: center;
  text-align: center;
  // padding: 10px;
  min-width: 300px; /* 让登录框有最小宽度，避免太窄 */
  min-height: 300px; /* 让登录框有最小宽度，避免太窄 */
  background: rgba(255, 255, 255, 0.5); /* 透明背景 */
  backdrop-filter: blur(10px); /* 毛玻璃效果 */

  // .demo-form-inline {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  //   align-items: center;
  // }
}
</style>
