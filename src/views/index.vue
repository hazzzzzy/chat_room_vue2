<template>
  <div>
    <div class="mmmm">
      <h1>主页</h1>
    </div>
  </div>
</template>
  
  <script>
export default {
  methods: {
    back() {
      this.$router.push("/home");
    },
  },
};
</script>
  
  <style scoped>
h1 {
  color: red;
}
.mmmm {
  width: 100%;
  height: 100%;
  text-align: center;
}
</style>