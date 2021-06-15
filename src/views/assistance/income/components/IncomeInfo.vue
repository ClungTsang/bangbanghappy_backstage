<template>
  <div>
    <a-card :bordered="false" v-if="status">
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item label="平台总收益">
          {{ income.totalIncome }}元
        </a-descriptions-item>
        <a-descriptions-item label="押金抽成总收益"> 0 </a-descriptions-item>
        <a-descriptions-item label="代理抽成总收益"> 0 </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card :bordered="false" v-else>
      <a-descriptions layout="vertical" bordered>
        <a-descriptions-item label="黑板盈利">
          {{ distribution.blackboradincome }}元
        </a-descriptions-item>
        <a-descriptions-item label="获得的佣金">
          {{ distribution.incomecommision }}元
        </a-descriptions-item>
        <a-descriptions-item label="支付的佣金">
          {{ distribution.spendcommision }}元
        </a-descriptions-item>
        <a-descriptions-item label="支付的佣金比例">
          {{ distribution.spendpercent }}元
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      income: { totalIncome: 0 },
      distribution: {
        // 获得的佣金 分销门店上交的的
        incomecommision: 0,
        // 黑板盈利 外卖赚的
        blackboradincome: 0,
        // 支付的佣金 上交给上级的佣金
        spendcommision: 0,
        // 支付的佣金比例 上交给上级的佣金比例
        spendpercent: 0,
      },
      status: true,
    };
  },
  mounted() {
    this.judge();
  },
  methods: {
    judge() {
      let user = this.$db.get("USER");

      if (user.description == "一级代理" || user.roleName == "一级代理") {
        this.status = false;
        this.getRecordByBossPhone();
      } else {
        this.status = true;
        this.getRecordBySuper();
        this.getSuperTotalIncome();
      }
    },
    // 获取最新平台总收益
    getSuperTotalIncome() {
      this.$get("/business/rootData").then((res) => {
        this.income.totalIncome = res.data.data[0].valuedata;
      });
    },
    // 平台获取记录
    getRecordBySuper() {
      const params = {
        openid: "manger_bangbanghelper_boss",
        analysisstatus: 5,
      };
      this.$get("/aidDataAnalysis", { ...params }).then((res) => {
        console.log(res);
        // this.income.totalIncome = res.data.data[0].valuedata;
        // this.data.value = res.data.data
      });
    },
    // 代理商获取记录
    getRecordByBossPhone() {
      let user = this.$db.get("USER");
      //根据不同的角色请求旗下门店
      this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
        (result) => {
          this.distribution = result.data.data;
        }
      );
    },
  },
};
</script>
<style>
</style>
