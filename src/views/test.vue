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
      <el-card class="showStatus" v-show="isConnect">
        连接状态：<span :style="{ color: isConnect ? 'green' : 'red' }">
          {{ socketStatus }} </span
        >| 当前房间在线人数：{{ onlineRoomUserAmount }} | 当前在线人数：{{
          onlineUserAmount
        }}
      </el-card>
      <el-card class="msg-box" id="msgBox" v-loading="loading.historyLoading">
        <el-empty
          description="请选择房间"
          class="empty-container"
          v-show="!room"
        ></el-empty>

        <div class="message-list">
          <div
            v-for="(msg, index) in messages"
            :key="index"
            :class="getMessageClass(msg.sender)"
          >
            <div v-if="msg.sender !== '系统消息'" class="avatar-wrapper">
              <el-avatar
                shape="square"
                size="medium"
                :src="getAvatarSrc(msg.sender)"
              ></el-avatar>
            </div>
            <div class="message-content">
              <div class="message-header">
                <span v-if="msg.sender !== '系统消息'">{{ msg.sender }}</span>
                <span class="send-time">{{ msg.sendTime }}</span>
              </div>
              <div
                class="message-bubble"
                :style="{ 'background-color': getMsgColor(msg.sender) }"
              >
                {{ msg.msg }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card class="input-box" shadow="always" v-show="isConnect">
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
import { getCache, getMyself } from "@/utils/useCache";
import http from "@/utils/r";

export default {
  data() {
    return {
      messages: [],
      isConnect: false,
      onlineUserAmount: 0,
      onlineRoomUserAmount: 0,
      msgForm: {
        message: "",
      },
      room: null,
      rooms: [],
      loading: {
        roomListLoading: false,
        historyLoading: false,
      },
      blink: {
        timer: null,
        originTitle: document.title,
        state: null,
      },
    };
  },
  computed: {
    socketStatus() {
      return this.isConnect ? "已连接" : "未连接";
    },
  },
  watch: {
    // Modified watch to scroll the specific message list container
    messages() {
      this.$nextTick(() => {
        const msgList = this.$el.querySelector(".message-list");
        if (msgList) {
          msgList.scrollTop = msgList.scrollHeight;
        }
      });
    },
  },
  mounted() {
    this.getRoomList();
    document.addEventListener("visibilitychange", this.listenPage);
  },
  beforeDestroy() {
    this.stopBlinkingTitle();
    document.removeEventListener("visibilitychange", this.listenPage);
  },
  methods: {
    async jump(key) {
      this.loading.roomListLoading = true;
      if (this.isConnect !== true) {
        await this.connWs();
      }
      if (key == this.room) {
        this.loading.roomListLoading = false;
        return;
      }
      this.$socket.emit("serverJoinRoom", {
        roomID: key,
        username: getMyself()[0],
        userID: getMyself()[1],
      });
      this.room = key;
      this.messages = [];
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
    async getHistory() {
      this.loading.historyLoading = true;
      await http
        .get("/rooms/getHistory", { params: { roomID: this.room } })
        .then((data) => {
          this.messages = data.data;
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.loading.historyLoading = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$socket.emit("serverSendMsg", this.msgForm.message);
          this.msgForm.message = "";
        }
      });
    },
    connWs() {
      const username = getCache(process.env.VUE_APP_USERNAME_KEY);
      if (username) {
        this.$createWs();
        this.$socket = this.$getSocket();
        // 成功连接
        this.$socket.on("connect", () => {
          this.$socket.emit("serverOnline", username);
          Notify.success("连接成功");
          this.isConnect = true;
        });
        // 断开连接
        this.$socket.on("disconnect", (reason) => {
          this.isConnect = false;
          console.log(reason);
          Notify.info("已断开连接");
        });
        // 获取广播消息
        this.$socket.on("clientGetMsg", (data) => {
          this.messages.push({
            role: data.role,
            msg: data.msg,
            sender: data.sender,
            sendTime: data.sendTime,
          });
          if (document.hidden) {
            this.startBlinkingTitle();
          }
        });
        // 获取在线人数
        this.$socket.on("countUser", (data) => {
          this.onlineUserAmount = data.onlineUserAmount;
        });
        // 用户加入房间
        this.$socket.on("clientJoinRoom", (data) => {
          this.room = data.room;
          this.loading.roomListLoading = false;
        });
        // 用户离开房间
        this.$socket.on("clientCountRoomUser", (data) => {
          this.onlineRoomUserAmount = data.onlineRoomUserAmount;
        });
        // 接收历史消息
        this.$socket.on("clientGetHistory", (data) => {
          this.messages = data;
        });
      } else {
        Notify.error("未检测到登录态，请重新登录");
        this.$router.push("/login");
      }
    },
    // Modified getMsgColor to return appropriate colors
    getMsgColor(sender) {
      const username = getMyself()[0];
      if (sender === "系统消息") {
        return "rgb(255, 255, 144)"; // Yellow for system messages
      } else if (sender === username) {
        return "rgb(149, 236, 105)"; // Green for self messages
      } else {
        return "#FFFFFF"; // White for other user messages
      }
    },
    // New method to determine message class for alignment
    getMessageClass(sender) {
      const username = getMyself()[0];
      if (sender === "系统消息") {
        return "message-item system-message";
      } else if (sender === username) {
        return "message-item self-message";
      } else {
        return "message-item other-message";
      }
    },
    // New method to get avatar source
    getAvatarSrc(sender) {
      // You can implement logic here to return different avatars based on sender
      // For now, it returns a default avatar
      return "/default_avatar.png";
    },
    startBlinkingTitle() {
      if (this.blink.timer) return;
      this.blink.title = document.title;
      this.blink.timer = setInterval(() => {
        document.title = this.blink.state
          ? "【新消息】"
          : this.blink.originTitle;
        this.blink.state = !this.blink.state;
      }, 1000);
    },
    stopBlinkingTitle() {
      if (this.blink.timer) {
        clearInterval(this.blink.timer);
        this.blink.timer = null;
        document.title = this.blink.originTitle;
      }
    },
    listenPage() {
      if (!document.hidden) {
        this.stopBlinkingTitle();
      }
    },
  },
};
</script>
<style lang="less" scoped>
// Define common color variables
@system-msg-color: rgb(255, 255, 144);
@self-msg-color: rgb(149, 236, 105);
@other-msg-color: #ffffff;
@text-color-light: #999;
@box-shadow-light: 0 1px 1px rgba(0, 0, 0, 0.1);

// Define common size variables
@msg-margin-bottom: 15px;
@avatar-margin-horizontal: 10px;
@bubble-padding: 10px 12px;
@header-margin-bottom: 5px;
@send-time-margin-left: 10px;
@bubble-border-radius: 8px; // Base border radius for message bubbles

.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-start; // Align items to the top for better layout

  > div {
    height: 100%;
    // Removed redundant justify-content and align-items here to allow inner divs to control their alignment
    display: flex;
  }

  .roomList {
    width: 20%;
    // Adjusted to column for its internal content
    flex-direction: column;
    .el-menu-vertical-demo {
      width: 100%;
      height: 100%;
    }
  }

  .msg-container {
    width: 80%;
    flex-direction: column;
    align-items: center;
    padding: 20px; // Add some padding to the container
    box-sizing: border-box; // Include padding in the width calculation

    // Override Element UI card body padding for consistent layout
    .el-card__body {
      width: 100%;
      padding: 0 !important; // Remove default padding from card body
      box-sizing: border-box;
    }

    .empty-container {
      width: 100%;
      height: 100%; // Ensure it fills the space when no room is selected
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .showStatus {
      flex-shrink: 0; // Prevent it from shrinking
      text-align: center;
      width: 100%; // Take full width of its parent
      margin-bottom: 20px;
      .el-card__body {
        padding: 10px 20px !important; // Restore padding for status card
      }
    }

    .msg-box {
      flex-grow: 1; // Allow it to grow and take available space
      height: 0; // Set height to 0 for flex-grow to work properly with overflow
      width: 100%; // Take full width
      margin-bottom: 20px;
      display: flex; // Make it a flex container
      flex-direction: column; // Arrange content vertically
      overflow-y: auto; // Allow message list to scroll

      // The actual message list container
      .message-list {
        flex-grow: 1;
        overflow-y: auto; // Allow message list to scroll
        // padding: 10px;
      }

      .message-item {
        display: flex;
        margin-bottom: @msg-margin-bottom;
        align-items: flex-start; // Align items (avatar and message) to the top
        width: 100%;
        .avatar-wrapper {
          flex-shrink: 0; // Prevent avatar from shrinking
          margin: 0 @avatar-margin-horizontal; // Spacing between avatar and message
        }

        .message-content {
          max-width: 70%; // Limit message content width
          word-break: break-word; // Break long words
          display: flex;
          flex-direction: column;

          .message-header {
            font-size: 0.8em;
            color: @text-color-light;
            margin-bottom: @header-margin-bottom;
            // display: flex; // Use flex for sender and time alignment

            .send-time {
              margin-left: @send-time-margin-left;
            }
          }

          .message-bubble {
            border: 1px solid;
            padding: @bubble-padding;
            min-height: 20px;
            line-height: 1.4;
            position: relative;
            box-shadow: @box-shadow-light;
          }
        }

        // Self-sent messages
        &.self-message {
          justify-content: flex-end; // Align entire message item to the right
          .message-content {
            align-items: flex-end; // Align message header and bubble to the right

            .message-header {
              justify-content: flex-end; // Align sender and time to the right
            }

            .message-bubble {
              border-radius: @bubble-border-radius 0 @bubble-border-radius
                @bubble-border-radius; // Top-right corner is straight
              background-color: @self-msg-color;

              // Arrow for self messages
              &::after {
                content: "";
                position: absolute;
                top: 0;
                right: -8px; // Position the arrow to the right of the bubble
                width: 0;
                height: 0;
                border-left: 8px solid @self-msg-color; // Arrow color matches bubble
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
              }
            }
          }
        }

        // Other user messages
        &.other-message {
          justify-content: flex-start; // Align entire message item to the left
          .message-content {
            align-items: flex-start; // Align message header and bubble to the left

            .message-header {
              justify-content: flex-start; // Align sender and time to the left
            }

            .message-bubble {
              border-radius: 0 @bubble-border-radius @bubble-border-radius
                @bubble-border-radius; // Top-left corner is straight
              background-color: @other-msg-color;

              // Arrow for other messages
              &::before {
                content: "";
                position: absolute;
                top: 0;
                left: -8px; // Position the arrow to the left of the bubble
                width: 0;
                height: 0;
                border-right: 8px solid @other-msg-color; // Arrow color matches bubble
                border-top: 8px solid transparent;
                border-bottom: 8px solid transparent;
              }
            }
          }
        }

        // System messages
        &.system-message {
          justify-content: center; // Center the system message
          text-align: center; // Center text within the bubble

          .message-content {
            max-width: 70%; // Limit system message width
            align-items: center; // Center header and bubble for system messages
          }

          .message-header {
            display: none; // Hide sender/time for system messages, or customize as needed
          }

          .message-bubble {
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 0.9em;
            color: #666;
            background-color: @system-msg-color !important; // Ensure system message color
            box-shadow: none; // No shadow for system messages
          }
        }
      }
    }

    .input-box {
      flex-shrink: 0; // Prevent it from shrinking
      width: 100%; // Take full width
      .el-card__body {
        padding: 20px !important; // Restore padding for input card
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .el-form {
        display: flex;
        align-items: center;
        width: 100%;
        .el-form-item {
          flex-grow: 1; // Input field takes most space
          margin-bottom: 0; // Remove default margin-bottom
          &:last-child {
            flex-grow: 0; // Button doesn't grow
            margin-left: 10px; // Spacing for the button
          }
        }
      }
    }
  }
}
</style>