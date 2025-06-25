<template>
  <div class="chatroom-intro-page">
    <div class="content-wrapper">
      <header class="intro-header">
        <h1>🎨 ChatWave: 连接与分享的艺术空间 💬</h1>
        <p class="tagline">
          ✨ 欢迎来到 ChatWave，一个让您的文字和心声自由流淌的数字港湾。 ✨
        </p>
        <p>
          在这里，每一次敲击键盘都可能开启一段新的故事，每一条消息都承载着连接的可能。我们致力于为您打造一个纯粹、友好且充满活力的交流平台，让您轻松找到同好，分享热爱，或仅仅是放松身心，享受片刻的宁静。
        </p>
      </header>

      <section class="features-section">
        <h2>🌟 我们的特色，只为您的体验增光添彩：</h2>
        <ul class="feature-list">
          <li>
            <h3>极简美学设计</h3>
            <p>
              告别繁杂，拥抱简洁。ChatWave
              界面干净清爽，一目了然，让您的注意力聚焦于对话本身，享受纯粹的交流乐趣。
            </p>
          </li>
          <li>
            <h3>沉浸式聊天体验</h3>
            <p>
              流畅的消息传递，优雅的排版布局，为您营造一个如行云流水般自然、舒适的聊天环境。让每一次互动都成为一种享受。
            </p>
          </li>
          <li>
            <h3>多元化情感表达</h3>
            <p>
              从文字的魅力到表情符号的活力，ChatWave
              支持多种方式让您的情感跃然屏上，让交流更加生动有趣。
            </p>
          </li>
          <li>
            <h3>安全与隐私保障</h3>
            <p>
              我们深知沟通的信任基石。ChatWave
              致力于保护您的隐私，让您安心畅聊，无需担忧。
            </p>
          </li>
          <li>
            <h3>跨平台无缝连接</h3>
            <p>
              无论您身处何方，使用何种设备，ChatWave
              都能提供一致且流畅的体验，让您随时随地与世界保持连接。
            </p>
          </li>
        </ul>
      </section>

      <section class="explore-section">
        <h2>🌍 探索无限可能，尽在 ChatWave。</h2>
        <p>
          无论是分享日常趣事，探讨专业知识，还是寻找志同道合的朋友，ChatWave
          都能成为您理想的选择。我们相信，一个美好的聊天环境能够激发更多的灵感和共鸣。
        </p>
      </section>

      <footer class="call-to-action-footer">
        <h2>💖 加入我们，开启您的聊天新篇章。</h2>
        <p>
          ChatWave
          不仅仅是一个聊天室，它是一个汇聚思想、碰撞火花的社区。我们期待您的加入，共同编织一个更精彩的数字世界。
        </p>
        <p class="final-tagline">ChatWave - 连接每一刻，分享每一次心跳。</p>
      </footer>
    </div>

    <div class="background-overlay"></div>
  </div>
</template>

<script>
export default {
  name: "ChatRoomIntro",
  // 此组件仅为展示，无需数据或方法
};
</script>

<style scoped>
/* 引入 Google Fonts - 可以根据喜好选择字体 */
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700&family=Playfair+Display:wght@700&display=swap");

.chatroom-intro-page {
  font-family: "Noto Sans SC", sans-serif; /* 主要中文字体 */
  color: #333;
  line-height: 1.6;
  background-color: #f8f8f8; /* 浅灰色背景 */
  width: 100%;
  /* min-height: 100vh; */
  display: flex;
  justify-content: center;
  align-items: flex-start; /* 内容从顶部开始排列 */
  padding: 40px 20px;
  box-sizing: border-box;
  position: relative;
  /* overflow: hidden; 隐藏超出部分，配合背景图 */
}

/* 背景覆盖层 - 用于添加模糊、渐变或图案 */
.background-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    rgba(135, 206, 235, 0.2),
    rgba(255, 160, 122, 0.2)
  ); /* 柔和渐变 */
  /* 或者使用背景图片，例如： */
  /* background-image: url('https://source.unsplash.com/random/1920x1080/?abstract,technology'); */
  /* background-size: cover; */
  /* background-position: center; */
  /* filter: blur(5px); */ /* 模糊效果 */
  z-index: 0; /* 确保在内容下方 */
}

.content-wrapper {
  max-width: 900px;
  width: 100%;
  background-color: rgba(
    255,
    255,
    255,
    0.95
  ); /* 半透明白色背景，让背景图隐约可见 */
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  position: relative; /* 确保内容在背景之上 */
  z-index: 1;
  text-align: center; /* 默认居中 */
}

.intro-header {
  margin-bottom: 40px;
}

.intro-header h1 {
  font-family: "Playfair Display", serif; /* 标题字体 */
  font-size: 3em;
  color: #4a4a4a;
  margin-bottom: 15px;
  letter-spacing: 1px;
}

.intro-header .tagline {
  font-size: 1.5em;
  color: #666;
  font-weight: 400;
  margin-bottom: 25px;
}

.intro-header p {
  font-size: 1.1em;
  color: #555;
  max-width: 700px;
  margin: 0 auto;
}

.section-title {
  font-size: 2em;
  color: #4a4a4a;
  margin-bottom: 30px;
  position: relative;
  display: inline-block;
}

.section-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #a7d9f7; /* 强调色 */
  border-radius: 2px;
}

.features-section {
  background-color: #f0f8ff; /* 浅蓝色背景，区分区块 */
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 40px;
  text-align: left; /* 特性列表文字左对齐 */
}

.features-section h2 {
  font-size: 2em;
  color: #4a4a4a;
  margin-bottom: 30px;
  text-align: center; /* 标题居中 */
}

.feature-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(280px, 1fr)
  ); /* 响应式网格布局 */
  gap: 25px;
}

.feature-list li {
  background-color: #ffffff;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.feature-list li:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.feature-list h3 {
  font-size: 1.4em;
  color: #007bff; /* 强调色 */
  margin-bottom: 10px;
}

.feature-list p {
  font-size: 0.95em;
  color: #666;
}

.explore-section {
  margin-bottom: 40px;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.explore-section h2 {
  font-size: 2em;
  color: #4a4a4a;
  margin-bottom: 20px;
}

.explore-section p {
  font-size: 1.1em;
  color: #555;
}

.call-to-action-footer {
  padding-top: 30px;
  border-top: 1px solid #eee;
}

.call-to-action-footer h2 {
  font-size: 2em;
  color: #4a4a4a;
  margin-bottom: 20px;
}

.call-to-action-footer p {
  font-size: 1.1em;
  color: #555;
  margin-bottom: 15px;
}

.final-tagline {
  font-weight: 700;
  font-size: 1.2em;
  color: #007bff;
}

/* 媒体查询 - 适应小屏幕 */
@media (max-width: 768px) {
  .content-wrapper {
    padding: 30px 15px;
  }

  .intro-header h1 {
    font-size: 2.2em;
  }

  .intro-header .tagline {
    font-size: 1.2em;
  }

  .intro-header p,
  .explore-section p,
  .call-to-action-footer p {
    font-size: 1em;
  }

  .features-section h2,
  .explore-section h2,
  .call-to-action-footer h2 {
    font-size: 1.8em;
  }

  .feature-list {
    grid-template-columns: 1fr; /* 小屏幕下每行一个特性 */
  }
}
</style>