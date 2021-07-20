<template>
  <a-card :bordered="false">
    <!-- 导出所有入驻申请信息 -->
    <a-button @click="exportExcel" v-hasPermission="['exportMoveinto:export']">导出入驻申请表</a-button>
    <!-- 信息展示 -->
    <move-into-info></move-into-info>
  </a-card>
</template>
<script>
import MoveIntoInfo from "./components/MoveIntoInfo.vue";
export default {
  components: { MoveIntoInfo },
  methods: {
    exportExcel() {
      let total = 0;
      const params = {
        pageNum: 1,
        pageSize: 10,
      };
      this.$get("/backend/notice/selectAllByNoticeStatus", {
        noticestatus: 1,
        ...params
      }).then((res) => {
        total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/backend/notice/excel?pageNum=1&pageSize=${total}`;
      });
    },
  },
};
</script>
<style>
</style>
