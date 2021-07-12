<template>
  <a-modal
    :visible="visible"
    title="查看"
    @ok="handleClose"
    @cancel="handleClose"
    :footer="null"
  >
    <a-descriptions layout="vertical" bordered>
      <a-descriptions-item label="商家盈利">
        {{ distribution.blackboradincome }}元
      </a-descriptions-item>
      <a-descriptions-item label="获得的佣金">
        {{ distribution.incomecommision }}元
      </a-descriptions-item>
      <a-descriptions-item label="支付的佣金">
        {{ distribution.spendcommision }}元
      </a-descriptions-item>
      <a-descriptions-item label="支付的佣金比例">
        {{ distribution.spendpercent }}%
      </a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      // 门店收益
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
    };
  },
  props: {
    storeIncomeVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.storeIncomeVisible;
    },
  },
  mounted() {
    this.getRecordByBossPhone();
  },
  methods: {
    // 代理商获取记录
    async getRecordByBossPhone() {
      let user = this.$db.get("USER");
      let result = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      this.distribution = result.data.data;
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
