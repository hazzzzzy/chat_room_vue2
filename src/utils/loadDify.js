export function loadDify() {
  if (document.getElementById("oKJq14gv13mezH4P")) {
    console.log("Dify already loaded");
    return;
  }

  // 先写配置
  window.difyChatbotConfig = {
    token: "oKJq14gv13mezH4P",
    userVariables: {
      // 例如：
      avatar_url:
        "https://bro9-1327032498.cos.ap-nanjing.myqcloud.com/logo.png",
      // name: 'NAME',
    },
  };

  // 再加载 embed 脚本
  const embedScript = document.createElement("script");
  embedScript.src = "https://udify.app/embed.min.js";
  embedScript.id = "oKJq14gv13mezH4P";
  embedScript.defer = true;
  document.head.appendChild(embedScript);

  // 样式
  const style = document.createElement("style");
  style.innerHTML = `
    #dify-chatbot-bubble-button {
      background-color: #1C64F2 !important;
    }
    #dify-chatbot-bubble-window {
      width: 30rem !important;
      height: 40rem !important;
    }
  `;
  document.head.appendChild(style);
  // if (!document.getElementById("dify-chatbot-bubble-button")) {
  //   console.log("Dify already loaded");
  //   return;
  // }
  console.log("load success");

  // window.location.reload();
}

export function removeDify() {
  // 移除所有相关元素
  const ids = ["oKJq14gv13mezH4P"];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });

  const styleEl = document.querySelector("style[data-dify-style]");
  if (styleEl) styleEl.remove();

  // 移除配置对象（避免缓存）
  delete window.difyChatbotConfig;

  // 同时移除按钮 DOM
  const bubble = document.getElementById("dify-chatbot-bubble-button");
  if (bubble) bubble.remove();
}
