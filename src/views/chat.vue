<template>
  <el-container style="border: 1px solid #eee">
    <!-- 聊天内容 -->
    <el-main class="chat-main" ref="chatBody" id="chatBody">
      <div
        v-for="(msg, index) in messages"
        :key="index"
        :class="['chat-bubble', msg.sender]"
      >
        <!-- 用户消息 -->
        <span v-if="msg.sender === 'user'">{{ msg.text }}</span>

        <!-- AI 消息支持 Markdown -->
        <div v-if="msg.sender === 'ai'" class="ai-msg">
          <div v-html="msg.renderedMarkdown"></div>
          <!-- 光标显示 -->
          <span v-if="msg.typing" class="cursor"></span>
        </div>
      </div>
    </el-main>

    <!-- 输入框 -->
    <el-footer style="padding: 10px; border-top: 1px solid #eee">
      <el-input
        v-model="inputText"
        placeholder="请输入问题..."
        @keyup.enter.native="sendMessage"
        size="medium"
        class="input-box"
        clearable
      />
      <el-button type="primary" @click="sendMessage" :disabled="inputDisabled"
        >发送</el-button
      >
    </el-footer>
  </el-container>
</template>

<script>
import { marked } from "marked"; // ✅ 正确方式
import Notify from "@/utils/notify";

export default {
  name: "ChatWithMarkdown",
  data() {
    return {
      inputText: "",
      messages: [],
      eventSource: null,
      isConnected: false,
      lastAIIndex: -1,
      inputDisabled: false,
    };
  },
  mounted() {
    this.messages.push({
      text: "",
      sender: "ai",
      typing: false,
      renderedMarkdown:
        "欢迎使用ChatWave，我是ChatWave智能客服2.0，知无不言，随意提问",
    });
  },
  methods: {
    sendMessage() {
      if (this.inputDisabled) return;
      const question = this.inputText.trim();
      if (!question) return;

      // 添加用户消息
      this.messages.push({ text: question, sender: "user" });
      this.inputText = "";

      // 添加 AI 消息占位
      this.messages.push({
        text: "",
        sender: "ai",
        typing: true,
        renderedMarkdown: "",
      });
      this.inputDisabled = true;
      this.scrollToBottom();
      this.lastAIIndex = this.messages.length - 1;

      this.connectSSE(question, this.lastAIIndex);
    },
    connectSSE(question, aiIndex) {
      if (this.eventSource) this.eventSource.close();

      const apiBaseUrl =
        process.env.VUE_APP_API_BASE_URL || "http://localhost:9000";
      this.eventSource = new EventSource(
        `${apiBaseUrl}/api/chat/chat?q=${encodeURIComponent(question)}`
      );

      this.eventSource.onopen = () => {
        this.isConnected = true;
      };

      this.eventSource.onmessage = (event) => {
        this.messages[aiIndex].typing = false;
        try {
        const data = JSON.parse(event.data);

        // 逐字/逐段追加文本
        if (this.messages[aiIndex].text.includes("输入中...")) {
          this.messages[aiIndex].text = "";
        }
        this.messages[aiIndex].text += data.v;
        // Markdown 渲染
        this.messages[aiIndex].renderedMarkdown = marked(
          this.messages[aiIndex].text
        );
        this.scrollToBottom();
        } catch (err) {
          console.error("解析 SSE 数据失败:", err);
        }
      };

      this.eventSource.addEventListener("finish", () => {
        this.inputDisabled = false;
        this.messages[aiIndex].typing = false;
        this.isConnected = false;
        this.eventSource.close();
      });

      this.eventSource.onerror = (err) => {
        this.inputDisabled = true;
        console.error("SSE错误:", err);
        Notify.error("SSE错误:", err);
        this.messages[aiIndex].typing = false;
        this.isConnected = false;
        this.eventSource.close();
      };
    },
    scrollToBottom() {
      this.$nextTick(() => {
        // const chatBody = this.$refs.chatBody;
        // chatBody.scrollTop = chatBody.scrollHeight;
        const chatBody = document.getElementById("chatBody");
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    },
  },
};
</script>

<style scoped>
.chat-main {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
  /* background: #f5f5f5; */
  display: flex;
  flex-direction: column;
}

.chat-bubble {
  max-width: 70%;
  padding: 10px 14px;
  margin: 5px 0;
  border-radius: 5px;
  line-height: 1.5;
  word-wrap: break-word;
}

.chat-bubble.user {
  background: #409eff;
  color: white;
  align-self: flex-end;
  border-top-right-radius: 1px;
}

.chat-bubble.ai {
  background: #fff;
  color: #333;
  align-self: flex-start;
  border-top-left-radius: 1px;
}

.ai-msg {
  display: flex;
  align-items: center;
}

.input-box {
  width: calc(100% - 100px);
  margin-right: 10px;
}

/* 打字机光标 */
.cursor {
  width: 2px;
  background: #333;
  margin-left: 2px;
  animation: blink 1s step-start infinite;
  height: 1em;
}

@keyframes blink {
  0%,
  50%,
  100% {
    opacity: 1;
  }
  25%,
  75% {
    opacity: 0;
  }
}
</style>
