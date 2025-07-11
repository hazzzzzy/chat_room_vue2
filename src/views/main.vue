<template>
  <div class="main-container">
    <el-container>
      <el-header>
        <el-menu
          :collapse="isCollapse"
          mode="horizontal"
          default-active="/room"
          class="el-menu-vertical-demo"
          @select="jump"
        >
          <!-- <el-menu-item index="/index">
            <i class="el-icon-s-home"></i>
            <span slot="title">主页</span>
          </el-menu-item> -->
          <el-menu-item index="/room">
            <i class="el-icon-s-comment"></i>
            <span slot="title">聊天室</span>
          </el-menu-item>
          <!-- <el-menu-item index="/test">
            <i class="el-icon-setting"></i>
            <span slot="title">test</span>
          </el-menu-item> -->
          <!-- <el-menu-item index="3" @click="logout">
            <i class="el-icon-setting"></i>
            <span slot="title">退出账号</span>
          </el-menu-item> -->
        </el-menu>
        <div id="avatar">
          <el-avatar
            shape="square"
            size="medium"
            :src="getAvatar()"
            class="squareAva"
          ></el-avatar
          ><el-dropdown @command="dropdown_command">
            <span class="el-dropdown-link">
              {{ username }}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command=""
                ><el-upload
                  :action="upload.action"
                  :headers="upload.headers"
                  :limit="1"
                  :on-success="uploadSuc"
                  :on-error="uploadFail"
                  :file-list="upload.fileList"
                  :show-file-list="false"
                  >修改头像
                </el-upload>
              </el-dropdown-item>
              <el-dropdown-item command="change"> 修改昵称</el-dropdown-item>
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
    <!-- <el-dialog title="改头像 - ￥99" :visible.sync="avaDialog">
      <el-image src="/78f059519d37dd78422c4db6ae2a2b4.jpg">
        <div slot="placeholder" class="">
          加载中<span class="dot">...</span>
        </div>
      </el-image>
    </el-dialog> -->
  </div>
</template>

<script>
import { getCache, getMyself, clearAllCache, setCache } from "@/utils/useCache";
import Notify from "@/utils/notify";
export default {
  data() {
    return {
      isCollapse: false,
      vivo50Dialog: false,
      avaDialog: false,
      username: getMyself().username,
      userID: getMyself().userID,
      upload: {
        headers: {
          Authorization: getMyself().token,
        },
        fileList: [],
        action: process.env.VUE_APP_BASE_URL + "/api/upload",
      },
    };
  },

  methods: {
    getAvatar() {
      return getMyself().avatar ? getMyself().avatar : "/default_avatar.png";
    },
    jump(key) {
      if (this.$route.path != key && key.startsWith("/")) {
        this.$router.push(key);
      }
    },
    logout() {
      Notify.success(
        `用户 ${getCache(process.env.VUE_APP_USERNAME_KEY)} 退出成功`
      );
      clearAllCache();
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
    uploadSuc(r, file, fileList) {
      this.fileList = [];
      if (r.code === -2) {
        Notify.error(r.msg);
        clearAllCache();
        this.$router.push("/login");
      } else if (r.code === -1) {
        Notify.error(r.msg);
      } else {
        let avatarList = null;
        avatarList = getCache(process.env.VUE_APP_AVATAR_KEY);
        avatarList[this.userID] = r.data;
        setCache(process.env.VUE_APP_AVATAR_KEY, avatarList);
        Notify.success("上传头像成功！");
        location.reload();
      }
    },
    uploadFail(r, file, fileList) {
      this.fileList = [];
      Notify.error(e);
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
      margin-right: 10px;
    }
  }
}
</style>