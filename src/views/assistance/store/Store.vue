<template>
  <a-card bordered="false">
    <div style="margin-bottom: 30px">
      <a-select
        style="width: 200px"
        default-value="切换当前门店状态"
        @change="onChange"
      >
        <a-select-option value="0">不营业</a-select-option>
        <a-select-option value="1">关店</a-select-option>
        <a-select-option value="2">休业</a-select-option>
        <a-select-option value="3">开店</a-select-option>
      </a-select>
    </div>
    <store-info></store-info>
  </a-card>
</template>
<script>
import event from "@/utils/event.js";

import StoreInfo from "./components/StoreInfo.vue";
export default {
  components: {
    StoreInfo,
  },
  methods: {
    // 切换显示状态
    async onChange(e) {
      let user = this.$db.get("USER");
      let res = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      const params = { storestatus: e, id: res.data.data.id };
      this.$put("/business/LantianStore", { ...params }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("切换门店状态成功");
          event.$emit("changeStoreStatus");
        }
      });
    },
  },
};
</script>
<style>
</style>
