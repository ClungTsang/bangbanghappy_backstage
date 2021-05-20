<template>
  <a-card bordered="false">
    <div>
      <!-- 切换订单模块 -->
      <assist-category-change></assist-category-change>
      <!-- 展示订单信息 -->
      <assist-category-info></assist-category-info>
    </div>
  </a-card>
</template>
<script>
import AssistCategoryChange from "./components/AssistCategoryChange.vue";
import AssistCategoryInfo from "./components/AssistCategoryInfo.vue";
export default {
  components: {
    AssistCategoryChange,
    AssistCategoryInfo,
  },
};
</script>
<style>
</style>
