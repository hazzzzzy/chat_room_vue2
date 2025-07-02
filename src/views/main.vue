<template>
  <div class="main-container">
    <el-container>
      <el-header>
        <el-menu
          :collapse="isCollapse"
          mode="horizontal"
          default-active="/index"
          class="el-menu-vertical-demo"
          @select="jump"
        >
          <el-menu-item index="/index">
            <i class="el-icon-s-home"></i>
            <span slot="title">主页</span>
          </el-menu-item>
          <el-menu-item index="/room">
            <i class="el-icon-s-comment"></i>
            <span slot="title">聊天室</span>
          </el-menu-item>
          <el-menu-item index="/test">
            <i class="el-icon-setting"></i>
            <span slot="title">test</span>
          </el-menu-item>
          <!-- <el-menu-item index="3" @click="logout">
            <i class="el-icon-setting"></i>
            <span slot="title">退出账号</span>
          </el-menu-item> -->
        </el-menu>
        <div id="avatar">
          <el-avatar
            shape="square"
            size="medium"
            src="/default_avatar.png"
            class="squareAva"
          ></el-avatar
          ><el-dropdown @command="dropdown_command">
            <span class="el-dropdown-link">
              {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="editAvatar">更改头像</el-dropdown-item>
              <el-dropdown-item command="change">改名</el-dropdown-item>
              <el-dropdown-item command="logout">退出账号</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>

      <!-- <el-aside width="200px"
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
      </el-aside> -->
      <el-main> <router-view></router-view> </el-main>
    </el-container>
    <el-dialog title="改名卡 - ￥50" :visible.sync="vivo50Dialog">
      <el-image src="/78f059519d37dd78422c4db6ae2a2b4.jpg">
        <div slot="placeholder" class="">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </el-dialog>
    <el-dialog title="改头像 - ￥99" :visible.sync="avaDialog">
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
      isCollapse: false,
      vivo50Dialog: false,
      avaDialog: false,
      username: getCache(process.env.VUE_APP_USERNAME_KEY),
    };
  },
  methods: {
    jump(key) {
      if (this.$route.path != key && key.startsWith("/")) {
        this.$router.push(key);
      }
    },
    logout() {
      Notify.success(
        `用户 ${getCache(process.env.VUE_APP_USERNAME_KEY)} 退出成功`
      );
      delCache(process.env.VUE_APP_USERNAME_KEY);
      delCache(process.env.VUE_APP_USERID_KEY);
      delCache(process.env.VUE_APP_TOKEN_KEY);
      this.$router.push("/login");
    },
    vivo50() {
      this.vivo50Dialog = true;
    },
    editAVA() {
      this.avaDialog = true;
    },
    dropdown_command(c) {
      if (c === "logout") {
        this.logout();
      } else if (c === "change") {
        this.vivo50();
      } else if (c === "editAvatar") {
        this.editAVA();
      }
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
  #avatar {
    position: absolute;
    top: 0;
    right: 0;
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-right: 30px;
    .el-dropdown-link {
      cursor: pointer;
      color: #409eff;
    }
    .squareAva {
      margin-right: 20px;
    }
  }
}
</style>