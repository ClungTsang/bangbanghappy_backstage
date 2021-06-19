<template>
  <div>
    <!-- 导出所有求助分类信息 -->
    <a-button @click="exportExcel" v-hasPermission="['exportService:export']">导出求助表</a-button>
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="12">
        <assist-sort-inner-info></assist-sort-inner-info>
      </a-col>
      <a-col :span="12">
        <assist-sort-outer-info></assist-sort-outer-info>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import AssistSortInnerInfo from "./components/AssistSortInnerInfo.vue";
import AssistSortOuterInfo from "./components/AssistSortOuterInfo.vue";
export default {
  components: { AssistSortInnerInfo, AssistSortOuterInfo },
  methods: {
    exportExcel() {
      let total = 0;
      const params = {
        pageNum: 1,
        pageSize: 10,
      };
      this.$get("/aidServiceType/list", {
        ...params,
      }).then((res) => {
        console.log(res.data.data);
        total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/aidServiceType/excel?pageNum=1&pageSize=${total}`;
      });
    },
  },
};
</script>
<style>
</style>
