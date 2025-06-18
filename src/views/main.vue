<template>
  <div class="main-container">
    <el-container>
      <el-aside width="200px"
        ><el-menu
          default-active="2"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
          @select="jump"
        >
          <el-menu-item index="/room">
            <i class="el-icon-setting"></i>
            <span slot="title">聊天室</span>
          </el-menu-item>
          <el-menu-item index="2" @click="vivo50">
            <i class="el-icon-setting"></i>
            <span slot="title">改名</span>
          </el-menu-item>
          <el-menu-item index="3" @click="logout">
            <i class="el-icon-setting"></i>
            <span slot="title">退出账号</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main> <router-view></router-view> </el-main>
    </el-container>
    <el-dialog title="改名卡 - ￥50" :visible.sync="vivo50Dialog">
      <el-image src="/78f059519d37dd78422c4db6ae2a2b4.jpg">
        <div slot="placeholder" class="">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import { getCache, delCache } from "@/utils/useCache";
import Notify from "@/utils/notify";
export default {
  data() {
    return {
      vivo50Dialog: false,
    };
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    jump(key) {
      if (this.$route.path != `/${key}` && key.startsWith("/")) {
        this.$router.push(key);
      }
    },
    logout() {
      Notify.success(
        `用户 ${getCache(process.env.VUE_APP_USERNAME_KEY)} 退出成功`
      );
      delCache(process.env.VUE_APP_USERNAME_KEY);
      delCache(process.env.VUE_APP_USERID_KEY);
      this.$router.push("/login");
    },
    vivo50() {
      this.vivo50Dialog = true;
      console.log(this.vivo50Dialog);
    },
  },
};
</script>

<style lang="less" scoped>
.main-container {
  width: 100%;
  height: 100%;
  .el-container {
    width: 100%;
    height: 100%;
    .el-menu {
      height: 100%;
    }
  }
  .el-main {
    background-color: #e9eef3;
    display: flex;
    flex-direction: column;
  }
}
</style>