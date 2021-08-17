<template>
  <a-card :bordered="false">
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
      <!-- 导出所有门店信息 -->
      <a-button @click="exportExcel" v-hasPermission="['exportMall:export']"
        >导出门店表</a-button
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
import DistributionChange from "./components/DistributionChange.vue";
import DistributionAdd from "./components/DistributionAdd.vue";
import DistributionInfo from "./components/DistributionInfo.vue";
export default {
  data() {
    return {
      distributionAdd: {
        visible: false
      },
      distributionChange: {
        visible: false
      }
    };
  },
  components: {
    DistributionInfo,
    DistributionAdd,
    DistributionChange
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
    exportExcel() {
      let total = 0;
      const params = {
        pageNum: 1,
        pageSize: 10
      };
      let user = this.$db.get("USER");
      // 甲方如果需要代理也能导表
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        //根据不同的角色请求旗下门店
        this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
          result => {
            if (result.data.data && result.data.code == 200) {
              return this.$get("/business/LantianStore/MapAllByStoreid", {
                ...params,
                Parentid: result.data.data.id
              }).then(res => {
                if (res.data.data) {
                  total = res.data.data.total;
                }
              });
            }
          }
        );
      } else {
        this.$get("/business/LantianStore/MapAll", {
          ...params
        }).then(res => {
          total = res.data.data.total;
        });
      }
      window.location.href = `https://javabangbanghappy.lanfriend.cn/business/LantianStore/excel?pageNum=1&pageSize=${total}`;
    }
  }
};
</script>
<style></style>
