<template>
  <a-card :bordered="false" class="card-area">
    <div>
      <a-row type="flex">
        <a-col>
          <a-button
            @click="onOpenIncomeModal"
            type="primary"
            v-hasPermission="['income:get']"
          >
            提现金额
          </a-button>
        </a-col>
        <a-col style="margin-left: 5px">
          <a-button
            @click="onOpenAssistModal"
            ghost
            type="primary"
            v-hasPermission="['incomeAssist:set']"

          >
            全局押金抽成
          </a-button>
        </a-col>
      </a-row>

      <income-get
        :getVisible="incomeGetVisible"
        @close="onCloseIncomeModal"

      ></income-get>

      <income-assist-change
        :assistVisible="assistVisible"
        @close="onCloseAssistModal"
      ></income-assist-change>

      <income-info ref="income"></income-info>
    </div>
  </a-card>
</template>
<script>
import IncomeAssistChange from "./components/IncomeAssistChange.vue";
import IncomeGet from "./components/IncomeGet.vue";
import IncomeInfo from "./components/IncomeInfo.vue";
export default {
  data() {
    return {
      incomeGetVisible: false,
      assistVisible: false,
    };
  },
  components: { IncomeGet, IncomeInfo, IncomeAssistChange },
  methods: {
    onOpenIncomeModal() {
      this.$refs.income.judge()
      this.incomeGetVisible = true;
    },
    onCloseIncomeModal() {
      this.incomeGetVisible = false;
    },
    onOpenAssistModal() {
      this.assistVisible = true;
    },
    onCloseAssistModal() {
      this.assistVisible = false;
    },
  },
};
</script>
<style>
</style>
