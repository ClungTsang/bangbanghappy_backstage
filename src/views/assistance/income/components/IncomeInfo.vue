<template>
  <div>
    <a-descriptions title="收益中心" layout="vertical" bordered>
      <a-descriptions-item label="平台总收益" :span="2">
        {{ income.totalIncome }}元
      </a-descriptions-item>
      <!-- <a-descriptions-item label="押金总金额" :span="2">
        2000
      </a-descriptions-item> -->
      <a-descriptions-item label="押金抽成总收益" :span="2">
        0
      </a-descriptions-item>
      <a-descriptions-item label="代理抽成总收益" :span="2">
        0
      </a-descriptions-item>
    </a-descriptions>
  </div>
</template>

<script>
export default {
  data() {
    return {
      income: {totalIncome:0},
    };
  },
  mounted() {
    this.getRecord();
    this.getTotalIncome();
  },
  methods: {
    // 获取最新平台总收益
    getTotalIncome() {
      this.$get("/business/rootData").then((res) => {
        this.income.totalIncome = res.data.data[0].valuedata;
      });
    },
    // 获取记录
    getRecord() {
      const params = {
        openid: "manger_bangbanghelper_boss",
      };
      this.$get("/aidDataAnalysis", { ...params }).then((res) => {
        // this.income.totalIncome = res.data.data[0].valuedata;

        // this.data.value = res.data.data
      });
    },
  },
};
</script>
<style>
</style>
