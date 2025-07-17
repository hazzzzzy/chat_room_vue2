<template>
  <div class="chat-intro-page">
    <section class="hero-section">
      <div class="hero-content">
        <h1>{{ siteName }}</h1>
        <h3>{{ tagline }}</h3>
      </div>
    </section>

    <section class="features-section">
      <div class="features-container">
        <div class="feature-item">
          <!-- <img
            src="https://via.placeholder.com/80/007bff/FFFFFF?text=💬"
            alt="即时沟通"
            class="feature-icon"
          /> -->
          <h3>即时沟通</h3>
          <p>发送文字、表情、图片，实时互动，畅所欲言。</p>
        </div>
        <div class="feature-item">
          <!-- <img
            src="https://via.placeholder.com/80/007bff/FFFFFF?text=🔒"
            alt="安全私密"
            class="feature-icon"
          /> -->
          <h3>安全私密</h3>
          <p>严格加密保障您的对话内容，保护个人隐私。</p>
        </div>
        <div class="feature-item">
          <!-- <img
            src="https://via.placeholder.com/80/007bff/FFFFFF?text=🌐"
            alt="全球连接"
            class="feature-icon"
          /> -->
          <h3>全球连接</h3>
          <p>与来自世界各地的朋友相遇，拓展您的社交圈。</p>
        </div>
      </div>
    </section>

    <section class="why-choose-us-section">
      <div class="why-choose-us-container">
        <div class="why-image-wrapper">
          <img
            src="https://bro9-1327032498.cos.ap-nanjing.myqcloud.com/20250710175948.png"
            alt="聊天室界面示例"
            class="chat-ui-preview"
          />
        </div>
        <div class="why-text-content">
          <h2>简单直观，即刻上手</h2>
          <p>
            我们深知流畅的用户体验至关重要。
            {{ siteName }} 拥有简洁清爽的界面，让您无需学习即可快速融入。
            无论是文字交流还是发送表情、分享图片，都能轻松实现。
            在这里，每一次点击都旨在拉近您与世界的距离，让沟通变得前所未有的简单和愉快。
          </p>
        </div>
      </div>
    </section>

    <section class="cta-section">
      <h2>立即加入，开启您的互动时刻！</h2>
      <p>免费注册，无限畅聊，发现更多精彩。</p>
      <el-popover placement="right" trigger="click">
        <h2>测试账号：test，密码：123456</h2>
        <div
          :href="registerLink"
          slot="reference"
          class="btn-primary"
          @click="vivo50"
        >
          免费注册
        </div>
      </el-popover>

      <p class="login-prompt">
        已有账号？ <a :href="loginLink" class="link-secondary">立即登录</a>
      </p>
    </section>
    <section class="beian">
      ICP备案/许可证号：<a href="https://beian.miit.gov.cn/" target="_blank"
        >粤ICP备2024269056号-2</a
      >
    </section>
  </div>
</template>

<script>
export default {
  name: "ChatIntroPage",
  data() {
    return {
      siteName: "ChatWave", // 在这里替换为你的网站名称
      tagline: "连接世界，分享此刻",
      registerLink: "/register", // 替换为你的注册页面路由或URL
      loginLink: "/login", // 替换为你的登录页面路由或URL
      vivo50Dialog: false,
    };
  },
  methods: {
    vivo50() {
      this.vivo50Dialog = true;
    },
  },
};
</script>

<style scoped>
/* 基本样式 */
.chat-intro-page {
  font-family: "Helvetica Neue", Arial, sans-serif;
  color: #333;
  line-height: 1.6;
  background-color: #fcfcfc;
  margin: 0;
  padding: 0;
  overflow-x: hidden; /* 防止水平滚动 */
}

/* 确保内容在容器内，并保持横向布局的视觉平衡 */
section {
  padding: 60px 5%; /* 左右留白，上下内边距 */
  max-width: 100%; /* 控制最大宽度，保持16:9比例下的视觉舒适 */
  margin: 0 auto; /* 居中显示 */
}

/* Hero Section */
/* Update your existing hero-content h1 styles */
.hero-content h1 {
  font-size: 5.5em; /* Make it significantly larger */
  font-weight: 800; /* Make it extra bold */
  margin-bottom: 15px;
  letter-spacing: 2px; /* Spread out the letters a bit for readability */
  color: #ffffff; /* Keep it white for good contrast on most gradients */
  text-shadow: 0px 8px 15px rgba(0, 0, 0, 0.3); /* Softer, larger shadow for depth */
  text-transform: uppercase; /* Optional: Make it all caps for more impact */
  padding-bottom: 5px; /* Add a little space at the bottom */
  position: relative; /* Needed for pseudo-elements */
}

/* Optional: Add a subtle underline effect */
.hero-content h1::after {
  content: "";
  display: block;
  width: 80px; /* Width of the underline */
  height: 4px; /* Thickness of the underline */
  background-color: #a8dadc; /* A subtle accent color, adjust to your palette */
  margin: 20px auto 0; /* Center it below the text */
  border-radius: 2px;
}

/* For the tagline below the h1 */
.hero-content h3 {
  font-size: 2em; /* Slightly larger tagline */
  font-weight: 500;
  opacity: 0.95; /* Make it a bit more visible */
  color: #f0f0f0; /* Off-white for subtle contrast */
  text-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
}

/* --- Keep the rest of your .hero-section styles --- */
.hero-section {
  background: linear-gradient(
    135deg,
    #8888f9 0%,
    #4077df 100%
  ); /* Example strong blue gradient */
  /* Or use your preferred gradient from previous suggestions */
  color: white;
  text-align: center;
  padding: 120px 5%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("https://via.placeholder.com/1920x1080/457b9d/a8dadc?text=Abstract+Background");
  background-size: cover;
  background-position: center;
  opacity: 0.2;
  z-index: 0;
}
.hero-content {
  position: relative;
  z-index: 1;
}

/* Features Section */
.features-section {
  background-color: #f8f9fa; /* 浅灰色背景 */
  border-bottom: 1px solid #e0e0e0;
}

.features-container {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap; /* 允许换行，适应小屏幕 */
  gap: 30px; /* 项目间距 */
}

.feature-item {
  flex: 1; /* 均分空间 */
  min-width: 280px; /* 最小宽度，防止过小 */
  max-width: 350px; /* 最大宽度 */
  text-align: center;
  padding: 30px 20px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08); /* 柔和阴影 */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-item:hover {
  transform: translateY(-8px); /* 悬停上浮效果 */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.feature-icon {
  width: 80px;
  height: 80px;
  margin-bottom: 20px;
  border-radius: 50%; /* 圆形图标背景 */
  background-color: #e6f2ff; /* 淡蓝色背景 */
  padding: 10px;
}

.feature-item h3 {
  font-size: 1.6em;
  color: #333;
  margin-bottom: 10px;
}

.feature-item p {
  font-size: 1.05em;
  color: #666;
}

/* Why Choose Us Section */
.why-choose-us-section {
  background-color: white;
  border-bottom: 1px solid #e0e0e0;
}

.why-choose-us-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap; /* 允许换行，适应小屏幕 */
  gap: 50px; /* 图片与文字间距 */
}

.why-image-wrapper {
  flex: 1;
  min-width: 300px; /* 防止图片过小 */
  max-width: 600px;
  text-align: center;
}

.chat-ui-preview {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  transition: transform 0.3s ease;
}

.chat-ui-preview:hover {
  transform: scale(1.02); /* 悬停放大效果 */
}

.why-text-content {
  flex: 1;
  min-width: 300px;
  max-width: 600px;
}

.why-text-content h2 {
  font-size: 2.8em;
  color: #2c3e50;
  margin-bottom: 20px;
  line-height: 1.2;
}

.why-text-content p {
  font-size: 1.15em;
  color: #555;
  line-height: 1.8;
}

/* CTA Section */
.cta-section {
  background-color: #e6f2ff; /* 按钮区背景 */
  text-align: center;
  padding: 80px 5%; /* 上下内边距 */
}

.cta-section h2 {
  font-size: 2.5em;
  color: #1a5e95;
  margin-bottom: 25px;
}

.cta-section p {
  font-size: 1.2em;
  color: #555;
  margin-bottom: 40px;
}

.btn-primary {
  display: inline-block;
  padding: 18px 50px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-size: 1.3em;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 15px rgba(0, 123, 255, 0.3);
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0, 123, 255, 0.4);
}

.login-prompt {
  margin-top: 30px;
  font-size: 1.1em;
  color: #666;
}

.link-secondary {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.link-secondary:hover {
  color: #0056b3;
  text-decoration: underline;
}

.beian {
  font-size: 1.15em;
  color: #555;
  line-height: 1.8;
  text-align: center;
}
/* 响应式调整 */
@media (max-width: 992px) {
  .hero-content h1 {
    font-size: 3.5em;
  }
  .hero-content h3 {
    font-size: 1.5em;
  }
  .features-container,
  .why-choose-us-container {
    flex-direction: column; /* 小屏幕堆叠 */
    align-items: center;
  }
  .feature-item,
  .why-image-wrapper,
  .why-text-content {
    max-width: 90%; /* 占据更多宽度 */
  }
  .why-text-content {
    padding-left: 0; /* 移除左侧内边距 */
    text-align: center;
  }
  .why-choose-us-container > div {
    width: 100%; /* 小屏幕下宽度填满 */
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.8em;
  }
  .hero-content h3 {
    font-size: 1.2em;
  }
  section {
    padding: 40px 3%; /* 进一步减少左右留白 */
  }
  .cta-section h2 {
    font-size: 2em;
  }
  .btn-primary {
    padding: 12px 30px;
    font-size: 1.1em;
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 2.2em;
  }
  .hero-content h3 {
    font-size: 1em;
  }
  .feature-item h3 {
    font-size: 1.4em;
  }
  .why-text-content h2 {
    font-size: 2.2em;
  }
}
</style>