<template>
  <a-card :bordered="false">
    <!-- 导出所有订单信息 -->
    <a-button @click="exportExcel" v-hasPermission="['exportOrder:export']">导出订单表</a-button>
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
  },
};
</script>
<style>
</style>
