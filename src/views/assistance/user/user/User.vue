<template>
  <div>
    <a-card :bordered="false">

    <!-- 升级会员金额 -->
    <a-button type="primary" @click="openVipPriceModal"
      >调整升级会员所需金额</a-button
    >
    <!-- 用户信息 -->
    <user-customer></user-customer>
    <vip-price-modal
      :vipPriceVisible="vipPriceVisible"
      @close="closeVipPriceModal"
    ></vip-price-modal>
    </a-card>
  </div>
</template>
<script>
import UserCustomer from "./components/UserCustomer.vue";
import VipPriceModal from "./components/VipPriceModal.vue";
export default {
  components: { UserCustomer, VipPriceModal },
  data() {
    return {
      vipPriceVisible: false,
    };
  },
  methods: {
    openVipPriceModal() {
      this.vipPriceVisible = true;
    },
    closeVipPriceModal() {
      this.vipPriceVisible = false;
    },
  },
};
</script>
<style>
</style>
