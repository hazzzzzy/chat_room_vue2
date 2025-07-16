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
          <el-menu-item index="/room">
            <i class="el-icon-chat-dot-square"></i>
            <span slot="title">聊天室</span>
          </el-menu-item>
          <el-menu-item index="/user">
            <i class="el-icon-user"></i>
            <span slot="title">用户管理</span>
          </el-menu-item>
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
      <el-main> <router-view></router-view> </el-main>
    </el-container>
    <el-dialog title="修改昵称" :visible.sync="vivo50Dialog" width="400px">
      <el-form
        :inline="true"
        :model="editNameForm"
        class="demo-form-inline"
        :rules="editNameForm.rules"
        ref="editForm"
        v-loading="editNameForm.loading"
        @submit.native.prevent
      >
        <el-form-item label="" prop="username">
          <el-input
            v-model="editNameForm.username"
            placeholder="输入昵称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('editForm')"
            >提交</el-button
          >
        </el-form-item>
      </el-form>
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
import http from "@/utils/r";
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
      editNameForm: {
        username: "",
        rules: {
          username: [
            { required: true, message: "请输入新昵称", trigger: "blur" },
            {
              min: 3,
              max: 10,
              message: "长度在 3 到 10 个字符",
              trigger: "blur",
            },
          ],
        },
        loading: false,
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
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.editNameForm.loading = true;
          await http
            .post("/user/edit", { username: this.editNameForm.username })
            .then((r) => {
              setCache(
                process.env.VUE_APP_USERNAME_KEY,
                this.editNameForm.username
              );
              Notify.success(r.msg);
              setTimeout(() => {
                location.reload();
              }, 500);
            })
            .catch((e) => {})
            .finally(() => {
              this.editNameForm.loading = false;
            });
        }
        return;
      });
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