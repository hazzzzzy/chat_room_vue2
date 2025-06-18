function getCache(k) {
  return localStorage.getItem(k);
}

function setCache(k, v) {
  return localStorage.setItem(k, v);
}

function delCache(k) {
  return localStorage.removeItem(k);
}

export { getCache, setCache, delCache };
