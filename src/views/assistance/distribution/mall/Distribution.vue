<template>
  <a-card bordered="false">
    <div>
      <!-- 新建门店按钮 -->
      <a-button
        type="primary"
        @click="openAddDistribution"
        v-hasPermission="['distribution:add']"
        >新增门店</a-button
      >
      <!-- 批量修改门店抽成比例按钮 -->
      <a-button
        type="success"
        @click="openChangeDistribution"
        v-hasPermission="['distribution:change']"
        >批量修改抽成</a-button
      >
      <!-- 创建门店 -->
      <distribution-add
        :addVisible="distributionAdd.visible"
        @close="closeAddDistribution"
      ></distribution-add>
      <!-- 修改抽成 -->
      <distribution-change
        :changeVisible="distributionChange.visible"
        @close="closeChangeDistribution"
      ></distribution-change>
      <!-- 门店信息 -->
      <distribution-info></distribution-info>
    </div>
  </a-card>
</template>
<script>
import DistributionChange from "./components/DistributionChange";
import DistributionAdd from "../components/DistributionAdd.vue";
import DistributionInfo from "../components/DistributionInfo.vue";
export default {
  data() {
    return {
      distributionAdd: {
        visible: false,
      },
      distributionChange: {
        visible: false,
      },
    };
  },
  components: {
    DistributionInfo,
    DistributionAdd,
    DistributionChange,
  },
  methods: {
    // 增加门户控制
    openAddDistribution() {
      this.distributionAdd.visible = true;
    },
    closeAddDistribution() {
      this.distributionAdd.visible = false;
    },
    // 修改抽成控制
    openChangeDistribution() {
      this.distributionChange.visible = true;
    },
    closeChangeDistribution() {
      this.distributionChange.visible = false;
    },
  },
};
</script>
<style>
</style>
