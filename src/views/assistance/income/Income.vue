<template>
  <a-card :bordered="false" class="card-area">
    <div>
      <a-row type="flex">
        <!-- 查看平台总收益 -->
        <a-col>
          <a-button
            @click="openAdminIncomeVisible"
            type="primary"
            v-hasPermission="['adminTotolIncome:check']"
          >
            查看平台总收益
          </a-button>
        </a-col>
        <!-- 查看门店收益情况 -->
        <a-col>
          <a-button
            @click="openStoreIncomeVisible"
            type="primary"
            v-hasPermission="['mallTotolIncome:check']"
          >
            查看门店收益情况
          </a-button>
        </a-col>
        <!-- 全局援助抽成 -->
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

      <!-- 根据当前用户渲染不同收益情况 -->
      <div v-if="status">
        <!-- 商家收益流水 -->
        <store-info></store-info>
      </div>
      <div v-else>
        <!-- 平台收益流水 -->
        <admin-info></admin-info>
      </div>
    </div>
    <!-- 查看商家收益情况 -->
    <store-info-modal
      :storeIncomeVisible="storeIncomeVisible"
      @close="closeStoreIncomeVisible"
    ></store-info-modal>
    <!-- 查看平台收益情况 -->
    <admin-info-modal
      :adminIncomeVisible="adminIncomeVisible"
      @close="closeAdminIncomeVisible"
    ></admin-info-modal>
    <!-- 更改对援助的抽成 -->
    <income-assist-change
      :assistVisible="assistVisible"
      @close="onCloseAssistModal"
    ></income-assist-change>
  </a-card>
</template>
<script>
import AdminInfo from "./components/adminInfo.vue";
import StoreInfo from "./components/storeInfo.vue";
import IncomeAssistChange from "./components/IncomeAssistChange.vue";
import StoreInfoModal from "./components/StoreInfoModal.vue";
import AdminInfoModal from "./components/AdminInfoModal.vue";
export default {
  data() {
    return {
      // 判断用户角色
      status: true,
      // 控制援助抽成信息展示
      assistVisible: false,
      // 控制商家收益信息展示
      storeIncomeVisible: false,
      // 控制超管和平台收益信息展示
      adminIncomeVisible: false
    };
  },
  components: {
    IncomeAssistChange,
    StoreInfo,
    AdminInfo,
    StoreInfoModal,
    AdminInfoModal
  },
  created() {
    this.judge();
  },
  methods: {
    judge() {
      let roles = this.$db.get("ROLES");
      console.info(roles);
      if (
        roles[0] == "平台运营员" ||
        roles[0] == "管理员" ||
        roles[0] == "开发人员"
      ) {
        this.status = false;
      }
    },
    // 超管和平台控制援助抽成
    onOpenAssistModal() {
      this.assistVisible = true;
    },
    onCloseAssistModal() {
      this.assistVisible = false;
    },
    // 控制超管和平台收益信息
    closeAdminIncomeVisible() {
      this.adminIncomeVisible = false;
    },
    openAdminIncomeVisible() {
      this.adminIncomeVisible = true;
    },
    // 控制商家收益信息
    closeStoreIncomeVisible() {
      this.storeIncomeVisible = false;
    },
    openStoreIncomeVisible() {
      this.storeIncomeVisible = true;
    }
  }
};
</script>
<style></style>
