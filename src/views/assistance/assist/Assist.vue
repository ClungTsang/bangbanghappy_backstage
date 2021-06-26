<template>
  <a-card :bordered="false">
    <!-- 导出所有订单信息 -->
    <a-button
      @click="exportExcel"
      type="primary"
      v-hasPermission="['exportOrder:export']"
      >导出订单表</a-button
    >
    <a-button @click="onOpenMockOrder" v-hasPermission="['mockOrder:add']"
      >模拟订单</a-button
    >

    <!-- 展示订单信息 -->
    <assist-category-info></assist-category-info>
    <!-- 模拟订单 -->
    <mock-order-modal
      :mockVisible="mockVisible"
      @close="onCloseMockOrder"
    ></mock-order-modal>
  </a-card>
</template>
<script>
import AssistCategoryInfo from "./components/AssistCategoryInfo.vue";
import MockOrderModal from "./components/MockOrderModal.vue";
export default {
  data() {
    return {
      mockVisible: false,
    };
  },
  components: {
    AssistCategoryInfo,
    MockOrderModal,
  },
  methods: {
    exportExcel() {
      let total = 0;
      const params = {
        pageNum: 1,
        pageSize: 10,
      };
      this.$get("/aidOrder/list", { ...params }).then((res) => {
        console.log(res.data.data);
        total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/aidOrder/excel?pageNum=1&pageSize=${total}`;
      });
    },
    // 模拟订单modal
    onOpenMockOrder() {
      this.mockVisible = true;
    },
    onCloseMockOrder() {
      this.mockVisible = false;
    },
  },
};
</script>
<style>
</style>
