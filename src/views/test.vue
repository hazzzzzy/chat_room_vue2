<template>
  <div class="flex-wrapper">
    <div class="auto-width-box">这是一些内容，长度不固定</div>
    <div class="auto-width-box">这是一些内容，长度不固定</div>
    <div class="auto-width-box">
      这是一些内容，长度不固定这是一些内容，长度不固定这是一些内容，长度不固定这是一些内容，长度不固定这是一些内容，长度不固定这是一些内容，长度不固定
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less" scoped>
.flex-wrapper {
  display: flex;
  justify-content: flex-start; /* 可根据需要改为 center / flex-end */
}

.auto-width-box {
  display: inline-block;
  max-width: 50%;
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 8px;

  /* 可选：如果你想让内容超出不换行、显示省略号 */
  white-space: normal; /* 或 nowrap */
  word-break: break-word; /* 控制单词或中文是否换行 */
}
</style>