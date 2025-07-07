<template>
  <div class="main">
    <div class="roomList" v-loading="loading.roomListLoading">
      <el-menu class="el-menu-vertical-demo" @select="jump" default-active="0">
        <el-menu-item
          v-for="room in rooms"
          :key="room.id"
          :index="String(room.id)"
        >
          <i class="el-icon-no-smoking"></i>
          <span slot="title">{{ room.id }} - {{ room.name }}</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="main-container">
      <el-card class="showStatus"
        ><div>
          连接状态：<span :style="{ color: isConnect ? 'green' : 'red' }">
            {{ socketStatus }}
          </span>
          <span v-show="isConnect"
            >| 当前房间在线人数：{{ onlineRoomUserAmount }} | 当前在线人数：{{
              onlineUserAmount
            }}</span
          >
        </div>
      </el-card>
      <el-card class="msg-box" id="msgBox" v-loading="loading.historyLoading">
        <el-empty
          description="请选择房间"
          class="empty-container"
          v-show="!room"
        ></el-empty>
        <!-- <el-button
          type="primary"
          @click="loadMoreHistory"
          v-show="isConnect && countCurrentMsg() < this.roomMessageAmount"
          >加载更多历史记录
        </el-button> -->
        <div
          class="isHistoryRemain"
          v-show="isConnect && countCurrentMsg() < this.roomMessageAmount"
        >
          ————上划加载历史消息————
        </div>
        <div
          v-for="(msg, index) in messages"
          :key="index"
          :index="index"
          class="msg-container-container"
        >
          <!-- 系统 -->
          <div
            :class="getHistorySource(msg.sender)"
            v-if="msg.role === '系统消息'"
          >
            <div class="msg-main">
              <div
                class="msg-content"
                :style="{
                  'background-color': getMsgColor(msg.sender),
                }"
              >
                {{ msg.msg }}
              </div>
            </div>
          </div>
          <!-- 本人 -->
          <div
            :class="getHistorySource(msg.sender)"
            v-if="msg.sender === me[0]"
          >
            <div class="msg-main">
              <div class="msg-header">
                <div>{{ msg.sender }}</div>
                <div>{{ msg.sendTime }}</div>
              </div>
              <div
                class="msg-content"
                :style="{
                  'background-color': getMsgColor(msg.sender),
                }"
              >
                {{ msg.msg }}
              </div>
            </div>
            <div class="msg-ava">
              <el-avatar
                shape="square"
                size="large"
                src="/default_avatar.png"
              ></el-avatar>
            </div>
          </div>
          <!-- 他人 -->
          <div
            :class="getHistorySource(msg.sender)"
            v-if="msg.sender !== me[0] && msg.role !== '系统消息'"
          >
            <div class="msg-ava">
              <el-avatar
                shape="square"
                size="large"
                src="/default_avatar.png"
              ></el-avatar>
            </div>
            <div class="msg-main">
              <div class="msg-header">
                <div>{{ msg.sender }}</div>
                <div>{{ msg.sendTime }}</div>
              </div>
              <div
                class="msg-content"
                :style="{
                  'background-color': getMsgColor(msg.sender),
                }"
              >
                {{ msg.msg }}
              </div>
            </div>
          </div>
        </div>
      </el-card>
      <el-card
        class="input-box"
        shadow="always"
        v-show="isConnect"
        :body-style="{
          display: 'flex',
          'flex-direction': 'row',
          'justify-content': 'flex-start',
          'align-items': 'center',
          padding: 0,
          height: '100%',
        }"
      >
        <div class="emojiPicker" @click="handleEmoji">😋</div>
        <div class="emoji" v-show="emoji" @mouseleave="handleEmoji">
          <VEmojiPicker @select="selectEmoji" />
        </div>
        <el-form
          :model="msgForm"
          :inline="true"
          @submit.native.prevent
          ref="msgForm"
          class="input-form-class"
        >
          <el-form-item
            prop="message"
            :rules="[{ required: true, message: '消息不能为空' }]"
          >
            <el-input
              v-model="msgForm.message"
              @keyup.enter.native.prevent="submitForm('msgForm')"
              :disabled="!isConnect"
            />
          </el-form-item>
          <el-form-item
            ><el-button
              @click="submitForm('msgForm')"
              type="primary"
              :disabled="!isConnect"
              >发送</el-button
            >
          </el-form-item>
        </el-form>
        <!-- <el-button @click="test">ces</el-button> -->
      </el-card>
    </div>
  </div>
</template>

<script>
import Notify from "@/utils/notify";
import { getCache, getMyself } from "@/utils/useCache";
import http from "@/utils/r";
import { VEmojiPicker } from "v-emoji-picker";

export default {
  components: {
    VEmojiPicker,
  },
  data() {
    return {
      roomMessageAmount: 0,
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
      me: null,
      fangdou: false,
      sendMsgfangdou: false,
      emoji: false,
    };
  },
  computed: {
    socketStatus() {
      return this.isConnect ? "已连接" : "未连接";
    },
  },
  // watch: {
  //   messages() {
  //     this.$nextTick(() => {
  //       const box = document.getElementById("msgBox");
  //       if (box) {
  //         box.scrollTop = box.scrollHeight;
  //       }
  //     });
  //   },
  // },
  mounted() {
    this.getRoomList();
    this.me = getMyself();
    document.addEventListener("visibilitychange", this.listenPage);

    const box = document.getElementById("msgBox");
    if (box) {
      box.addEventListener("scroll", this.handleScroll);
    }
  },
  beforeDestroy() {
    this.stopBlinkingTitle();
    document.removeEventListener("visibilitychange", this.listenPage);

    const box = document.getElementById("msgBox");
    if (box) {
      box.removeEventListener("scroll", this.handleScroll);
    }
  },
  methods: {
    // test() {
    //   const box = document.getElementById("msgBox");
    //   console.log(box.scrollTop);
    // },
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
    // async getHistory() {
    //   this.loading.historyLoading = true;
    //   await http
    //     .get("/rooms/getHistory", { params: { roomID: this.room } })
    //     .then((data) => {
    //       this.messages = data.data;
    //     })
    //     .catch((e) => {
    //       console.error(e);
    //     })
    //     .finally(() => {
    //       this.loading.historyLoading = false;
    //     });
    // },
    submitForm(formName) {
      if (this.sendMsgfangdou === true) {
        Notify.warning("发消息过于频繁");
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$socket.emit("serverSendMsg", this.msgForm.message);
          this.msgForm.message = "";
          this.roomMessageAmount += 1;
          this.$nextTick(() => {
            const box = document.getElementById("msgBox");
            if (box) {
              box.scrollTop = box.scrollHeight;
            }
          });
        }
      });
      this.sendMsgfangdou = true;
      setTimeout(() => {
        this.sendMsgfangdou = false;
      }, 3000);
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
          if (document.hidden && data.role !== "系统消息") {
            this.startBlinkingTitle();
          }
          this.$nextTick(() => {
            const box = document.getElementById("msgBox");
            if (box) {
              box.scrollTop = box.scrollHeight;
            }
          });
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
          this.messages = data.history;
          this.roomMessageAmount = data.roomMessageAmount;
          this.$nextTick(() => {
            const box = document.getElementById("msgBox");
            if (box) {
              box.scrollTop = box.scrollHeight;
            }
          });
        });
        // 接收更多历史消息
        this.$socket.on("clientLoadMoreHistory", (data) => {
          try {
            const chatContainer = document.getElementById("msgBox");
            const oldScrollHeight = chatContainer.scrollHeight;
            this.messages = data.history.concat(this.messages);
            // 等待DOM更新完成（如果用React/Vue等框架可能需要nextTick或setTimeout）
            this.$nextTick(() => {
              const chatContainer = document.getElementById("msgBox");
              const newScrollHeight = chatContainer.scrollHeight;
              const addedHeight = newScrollHeight - oldScrollHeight;
              chatContainer.scrollTop = addedHeight;
            });
          } finally {
            this.loading.historyLoading = false;
          }
        });
      } else {
        Notify.error("未检测到登录态，请重新登录");
        this.$router.push("/login");
      }
    },
    // 新消息标签页闪烁
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
    // 获取聊天气泡样式
    getMsgColor(sender) {
      const username = this.me[0];
      if (sender === username) {
        return "rgb(149, 236, 105)";
      } else {
        return;
      }
    },
    getHistorySource(v) {
      if (v == this.me[0]) {
        return "msg-container self-msg-container";
      } else if (v === "系统消息") {
        return "msg-container system-msg-container";
      } else if (v !== this.me[0]) {
        return "msg-container other-msg-container";
      }
    },
    //加载更多历史数据
    countCurrentMsg() {
      let msgAmount = 0;
      const ls = this.messages;
      if (ls.length == 0) {
        return 0;
      } else {
        for (let i = 0; i < ls.length; i++) {
          const item = ls[i];
          if (item && typeof item === "object" && "id" in item) {
            msgAmount += 1;
          }
        }
        return msgAmount;
      }
    },
    loadMoreHistory() {
      try {
        this.loading.historyLoading = true;
        const msgs = this.messages;
        let historyID = null;
        for (let i = 0; i < this.messages.length; i++) {
          const item = msgs[i];
          if (item && typeof item === "object" && "id" in item) {
            historyID = item.id;
            break;
          }
        }
        if (historyID) {
          this.$socket.emit("serverLoadMoreHistory", {
            historyID: historyID,
            roomID: this.room,
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
      }
    },
    handleScroll() {
      const box = document.getElementById("msgBox");
      if (
        this.fangdou === true ||
        this.countCurrentMsg() >= this.roomMessageAmount ||
        !box ||
        box.scrollTop !== 0
      ) {
        return;
      }
      this.loadMoreHistory();
      this.fangdou = true;
      setTimeout(() => {
        this.fangdou = false;
      }, 1000);
    },
    //emoji
    handleEmoji() {
      this.emoji = !this.emoji;
    },
    selectEmoji(v) {
      this.msgForm.message += v.data;
    },
  },
};
</script>

<style lang="less" scoped>
.main {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  > div {
    height: 100%;
    justify-content: center;
    align-items: center;
  }
  .roomList {
    min-width: 200px;
    width: 15%;
    .el-menu-vertical-demo {
      width: 100%;
      height: 100%;
    }
  }
  .main-container {
    width: 85%;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    // align-items: center;

    .showStatus {
      flex: 1;
      text-align: center;
      width: 95%;
      margin-bottom: 20px;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .msg-box {
      flex: 8;
      height: 70%;
      width: 95%;
      overflow-y: auto;
      // display: flex;
      // flex-direction: column;
      // align-items: center;
      .isHistoryRemain {
        color: rgb(126, 128, 136);
        font-size: 14px;
        text-align: center;
        width: 100%;
      }
      .msg-container-container {
        .msg-container {
          display: flex;
          flex-direction: row;
          margin-bottom: 20px;
          width: 100%;
          font-size: 14px;
          transition: 1s;
          .msg-ava {
            margin-right: 10px;
          }
          .msg-main {
            width: 100%; // 注意：如果 msg-container 是整个聊天行的容器，这里设置 width: 100% 可能需要根据你的实际 HTML 结构和想要的效果进行调整
            display: flex;
            flex-direction: column;
            .msg-header {
              font-size: 12px;
              padding: 2px;
            }
            .msg-content {
              display: inline-block; /* 核心：根据内容自适应宽度 */
              max-width: 70%; /* 最宽不超过容器的一半 */
              padding: 10px;
              min-height: 20px;
              line-height: 1.4;
              position: relative;
              box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
              overflow-wrap: break-word; /* 中文换行 */
              word-break: break-word; /* 英文换行 */
            }
          }
          &.other-msg-container {
            .msg-main {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              .msg-header {
                text-align: left;
              }
              .msg-content {
                border-radius: 0 10px 10px 10px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              }
            }
          }
          &.self-msg-container {
            .msg-ava {
              margin-right: 0px;
              margin-left: 10px;
            }
            .msg-main {
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              .msg-header {
                text-align: right;
              }
              .msg-content {
                border-radius: 10px 0px 10px 10px;
              }
            }
          }
          &.system-msg-container {
            .msg-main {
              display: flex;
              flex-direction: column;
              align-items: center;
              .msg-content {
                border: none;
                box-shadow: none;
                color: rgb(126, 128, 136);
              }
            }
          }
        }
      }
    }
    .input-box {
      margin-top: 20px;
      flex: 1;
      // height: 20%;
      width: 95%;
      color: rgb(91, 205, 10);
      .input-form-class {
        display: flex;
        flex-direction: row;
        // justify-content: center;
        align-items: center;
      }
      .el-form-item {
        margin-bottom: 0;
      }
      .emojiPicker {
        border-radius: 5px;
        min-width: 40px;
        min-height: 40px;
        margin-left: 10px;
        margin-right: 5px;
        font-size: 24px;
        text-align: center;
        cursor: pointer;
      }
      .emoji {
        position: absolute;
        z-index: 2;
        bottom: 100px;
      }
    }
  }
}
</style>