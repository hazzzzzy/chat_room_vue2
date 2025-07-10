function setCache(k, v) {
  const value = typeof v === "object" ? JSON.stringify(v) : v;
  localStorage.setItem(k, value);
}

function getCache(k) {
  const value = localStorage.getItem(k);
  try {
    return JSON.parse(value); // 如果是 JSON 格式，会解析成对象
  } catch {
    return value; // 如果不是 JSON 格式，直接返回原始字符串
  }
}

function delCache(k) {
  return localStorage.removeItem(k);
}
function getMyself() {
  let username = getCache(process.env.VUE_APP_USERNAME_KEY);
  let userID = getCache(process.env.VUE_APP_USERID_KEY);
  let token = getCache(process.env.VUE_APP_TOKEN_KEY);
  let avatar = getCache(process.env.VUE_APP_AVATAR_KEY);
  avatar = avatar[userID];
  return {
    username: username,
    userID: userID,
    token: token,
    avatar: avatar,
  };
}

function clearAllCache() {
  delCache(process.env.VUE_APP_USERNAME_KEY);
  delCache(process.env.VUE_APP_USERID_KEY);
  delCache(process.env.VUE_APP_TOKEN_KEY);
  delCache(process.env.VUE_APP_AVATAR_KEY);
}

export { getCache, setCache, delCache, getMyself, clearAllCache };
