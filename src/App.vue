<template>
  <div id="app">
    <!-- 1. 渲染 views 中的 Index.vue -->
    <router-view class="main"></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
};
</script>

<style lang='scss'>
//导入样式，需要在最后添加;，不然会报错
@import "assets/style/index.scss";

#app {
  height: 100%;
}
.main {
  background-color: #ededed;
  overflow: hidden;
  width: 100%;
}
</style>
