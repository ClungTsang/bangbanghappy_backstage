<template>
  <a-card :bordered="false" class="card-area">
    <div>
      <a-row type="flex">
        <a-col>
          <a-button
            @click="closeStoreIncomeVisible"
            type="primary"
            v-hasPermission="['adminTotolIncome:check']"
          >
            查看平台总收益
          </a-button>
        </a-col>
        <a-col>
          <a-button
            @click="openStoreIncomeVisible"
            type="primary"
            v-hasPermission="['mallTotolIncome:check']"
          >
            查看门店收益情况
          </a-button>
        </a-col>
        <a-col style="margin-left: 5px">
          <a-button
            @click="onOpenAssistModal"
            ghost
            type="primary"
            v-hasPermission="['incomeAssist:set']"
          >
            全局援助抽成
          </a-button>
        </a-col>
      </a-row>
      <!-- 更改对援助的抽成 -->
      <income-assist-change
        :assistVisible="assistVisible"
        @close="onCloseAssistModal"
      >
      </income-assist-change>
      <!-- 根据当前用户渲染不同收益情况 -->
      <div v-if="status">
        <!-- 平台收益流水 -->
        <admin-info></admin-info>
      </div>
      <div v-else="status">
        <!-- 商家收益流水 -->
        <store-info></store-info>
      </div>
    </div>
    <store-info-modal
      :storeIncomeVisible="storeIncomeVisible"
      @close="closeStoreIncomeVisible"
    ></store-info-modal>
  </a-card>
</template>
<script>
import AdminInfo from "./components/adminInfo.vue";
import StoreInfo from "./components/storeInfo.vue";
import IncomeAssistChange from "./components/IncomeAssistChange.vue";
import StoreInfoModal from "./components/StoreInfoModal.vue";
export default {
  data() {
    return {
      incomeGetVisible: false,
      assistVisible: false,
      status: false,
      // 控制商家收益信息展示
      storeIncomeVisible: false,
    };
  },
  components: {
    IncomeAssistChange,
    StoreInfo,
    AdminInfo,
    StoreInfoModal,
  },
  mounted() {
    this.judge();
  },
  methods: {
    judge() {
      let user = this.$db.get("USER");

      if (user.roleName == "平台运营者" || user.roleName == "管理员") {
        this.status = true;
      }
      console.log(user.roleName);
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
    // 控制商家流水信息
    closeStoreIncomeVisible() {
      this.storeIncomeVisible = false;
    },
    openStoreIncomeVisible() {
      this.storeIncomeVisible = true;
    },
  },
};
</script>
<style>
</style>
