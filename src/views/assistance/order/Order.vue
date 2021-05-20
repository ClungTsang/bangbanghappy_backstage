<template>
  <a-card :bordered="bordered">
    <div>
      <!-- 切换订单模块 -->
      <order-category-change></order-category-change>
      <!-- 展示订单信息 -->
      <order-category-info></order-category-info>
    </div>
  </a-card>
</template>
<script>
import OrderCategoryChange from "./components/OrderCategoryChange.vue";
import OrderCategoryInfo from "./components/OrderCategoryInfo.vue";
export default {
  components: {
    OrderCategoryChange,
    OrderCategoryInfo,
  },
  data() {
    return {
      bordered: false,
    };
  },
};
</script>
<style>
</style>
