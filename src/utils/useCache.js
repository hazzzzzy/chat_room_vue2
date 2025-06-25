function getCache(k) {
  return localStorage.getItem(k);
}

function setCache(k, v) {
  return localStorage.setItem(k, v);
}

function delCache(k) {
  return localStorage.removeItem(k);
}
function getMyself() {
  let username = getCache(process.env.VUE_APP_USERNAME_KEY);
  let userID = getCache(process.env.VUE_APP_USERID_KEY);
  let token = getCache(process.env.VUE_APP_TOKEN_KEY);

  return [username, userID];
}

export { getCache, setCache, delCache, getMyself };
