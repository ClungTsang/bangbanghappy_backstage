<template>
  <a-modal
    :visible="visible"
    title="查看"
    @ok="handleClose"
    @cancel="handleClose"
    :footer="null"
  >
    <a-descriptions bordered>
      <a-descriptions-item label="平台总收益">
        {{ dataSource.IncomeTotal }}元
      </a-descriptions-item>
      <!-- <a-descriptions-item label="平台对援助的综合抽成">
        {{ dataSource.aid_platform_income_percent }}%
      </a-descriptions-item> -->
    </a-descriptions>
  </a-modal>
</template>
<script>
export default {
  data() {
    return {
      // 平台收益
      dataSource: {
        // 平台总收益
        IncomeTotal: 0,
        // 平台对援助的综合抽成
        aid_platform_income_percent: 0,
      },
    };
  },
  props: {
    adminIncomeVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.adminIncomeVisible;
    },
  },
  watch: {
    visible: {
      handler() {
        this.getRecordByRootData();
      },
      immediate: true,
    },
  },
  methods: {
    //平台获取记录
    async getRecordByRootData() {
      let result = await this.$get(`/business/rootData`);
      result.data.data.forEach((item) => {
        // 平台总收益
        if (item.id == 1) {
          this.dataSource.IncomeTotal = item.valuedata;
        }
        // 平台对援助的综合抽成
        if (item.id == 4) {
          this.dataSource.aid_platform_income_percent = item.valuedata;
        }
      });
    },
    handleClose() {
      this.$emit("close");
    },
  },
};
</script>
