<template>
  <a-card :bordered="false">
    <div>
      <!-- 展示订单信息 -->
      <assist-category-info></assist-category-info>
    </div>
  </a-card>
</template>
<script>
import AssistCategoryInfo from "./components/AssistCategoryInfo.vue";
export default {
  components: {
    AssistCategoryInfo,
  },
};
</script>
<style>
</style>
