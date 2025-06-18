<template>
  <div class="main">
    <div class="roomList" v-loading="loading.roomListLoading">
      <el-menu
        class="el-menu-vertical-demo"
        @open="handleOpen"
        @close="handleClose"
        @select="jump"
      >
        <el-menu-item v-for="room in rooms" :key="room.id" :index="room.id">
          <i class="el-icon-no-smoking"></i>
          <span slot="title">{{ room.id }} - {{ room.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="msg-container">
      <el-card class="showStatus" v-show="isUserJoinRoom">
        连接状态：<span :style="{ color: isConnect ? 'green' : 'red' }">
          {{ socketStatus }} </span
        >| 当前房间在线人数：{{ onlineUserAmount }}
      </el-card>
      <el-card class="msg-box" id="msgBox">
        <el-empty description="请选择房间" class="empty-container"></el-empty>
        <el-card
          v-for="(msg, index) in messages"
          :key="index"
          shadow="always"
          class="msg-ele"
        >
          <div slot="header" class="box-head">
            <span>{{ msg[0] }} | {{ msg[2] }}</span>
          </div>
          {{ msg[1] }}
        </el-card>
      </el-card>
      <el-card class="input-box" shadow="always">
        <el-form
          :model="msgForm"
          :inline="true"
          @submit.native.prevent
          style="width: 100%"
          ref="msgForm"
        >
          <el-form-item
            prop="message"
            :rules="[{ required: true, message: '消息不能为空' }]"
          >
            <el-input
              v-model="msgForm.message"
              @keyup.enter.native.prevent="submitForm('msgForm')"
            />
          </el-form-item>
          <el-form-item
            ><el-button @click="submitForm('msgForm')" type="primary"
              >发送</el-button
            >
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import Notify from "@/utils/notify";
import { getCache, setCache } from "@/utils/useCache";
import http from "@/utils/r";

export default {
  data() {
    return {
      //   message: "",
      messages: [],
      isConnect: false,
      onlineUserAmount: 0,
      msgForm: {
        message: "",
      },
      rooms: [],
      isUserJoinRoom: false,
      loading: {
        roomListLoading: false,
      },
    };
  },
  computed: {
    socketStatus() {
      return this.isConnect ? "已连接" : "未连接";
    },
  },
  watch: {
    messages() {
      this.$nextTick(() => {
        const box = document.getElementById("msgBox");
        if (box) {
          box.scrollTop = box.scrollHeight;
        }
      });
    },
  },
  mounted() {
    this.getRoomList();
    // this.connWs();
  },
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    jump(key) {
      if (this.isConnect !== true) {
        this.connWs();
      }
    },
    async getRoomList() {
      this.loading.roomListLoading = true;
      await http
        .get("/rooms/getList")
        .then((data) => {
          this.rooms = data.data;
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.loading.roomListLoading = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$socket.emit("sendMsg", this.msgForm.message);
          this.msgForm.message = "";
        } else {
          return;
        }
      });
    },
    // addNewUser() {
    //   if (getCache("crUsername") == null) {
    //     this.$prompt("输入用户名", "", {
    //       showClose: false,
    //       showCancelButton: false,
    //       closeOnClickModal: false,
    //       closeOnPressEscape: false,
    //       showInput: true,
    //       confirmButtonText: "保存",
    //       inputValidator: (v) => {
    //         const vL = v.length;
    //         if (!vL) {
    //           return "用户名不可为空";
    //         } else if (vL < 4 || vL > 8) {
    //           return "用户名长度需为4至8";
    //         }
    //         return true;
    //       },
    //     }).then((v) => {
    //       setCache("crUsername", v.value);
    //       this.connWs();
    //       Notify.success(`欢迎，${localStorage.getItem("crUsername")}`);
    //     });
    //   }
    // },
    connWs() {
      const username = getCache(process.env.VUE_APP_USERNAME_KEY);
      if (username) {
        this.$createWs();
        this.$socket = this.$getSocket();
        this.$socket.emit("getRoomList");
        // 成功连接
        this.$socket.on("connect", () => {
          this.$socket.emit("join", username);
          Notify.success("连接成功");
          this.isConnect = true;
        });
        // 断开连接
        this.$socket.on("disconnect", () => {
          this.isConnect = false;
          Notify.info("已断开连接");
        });
        // 获取广播消息
        this.$socket.on("getMsg", (msg) => {
          this.messages.push([msg.sender, msg.msg, msg.sendTime]);
        });
        // 获取在线人数
        this.$socket.on("countUser", (data) => {
          this.onlineUserAmount = data.onlineUserAmount;
        });
        // 获取房间
        this.$socket.on("getRoomList", (data) => {
          this.rooms = data;
        });
      } else {
        Notify.error("未检测到登录态，请重新登录");
      }
      this.loading.roomListLoading = false;
    },
  },
};
</script>

<style lang="less">
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > div {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .roomList {
    width: 20%;
    .el-menu-vertical-demo {
      width: 100%;
      height: 100%;
    }
  }
  .msg-container {
    width: 80%;
    flex-direction: column;
    // justify-content: left;
    align-items: center;
    > div {
      display: flex;
    }
    .el-card__body {
      width: 100%;
    }
    .empty-container {
      width: 100%;
    }
    .showStatus {
      flex: 1;
      text-align: center;
      width: 95%;
      margin-bottom: 20px;
    }
    .msg-box {
      flex: 8;
      height: 70%;
      width: 95%;
      overflow-y: auto;
      margin-bottom: 20px;

      .msg-ele {
        flex: 2;

        margin-bottom: 10px;
        word-break: break-word; /* 单词换行 */
        //   white-space: normal; /* 默认换行 */
        .el-card__header {
          font-size: 12px;
          height: 30px;
          padding: 5px;
        }
        .el-card__body {
          padding: 10px;
        }
      }
    }
    .input-box {
      height: 20%;
      width: 95%;
    }
  }
}
</style>