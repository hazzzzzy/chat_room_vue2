<template>
  <div>
    <div class="mmmm">
      <h1>你访问了不存在的网页</h1>
      <el-button type="primary" @click="back">返回首页</el-button>
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