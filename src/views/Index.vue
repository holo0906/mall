<template>
  <div>
    <!-- 导航 -->
    <m-header></m-header>
    <!-- 子路由的出口，首页中的其他内容 -->
    <router-view></router-view>
  </div>
</template>

<script>
import MHeader from "@/common/MHeader";

export default {
  components: {
    MHeader,
  },
};
</script>

<style lang="scss" scoped>
</style>