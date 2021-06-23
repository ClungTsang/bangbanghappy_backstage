<template>
  <div>
    <a-descriptions title="我的门店" bordered>
    <a-descriptions-item label="门店名称">
      <!-- <a-input defaultValue="内容" v-model="storeInfo.companyname"></a-input> -->
      {{storeInfo.companyname}}
    </a-descriptions-item>
    <a-descriptions-item label="联系人">{{storeInfo.storeowner}}</a-descriptions-item>
    <a-descriptions-item label="联系人电话">{{storeInfo.bossmobilenumber}}</a-descriptions-item>


    <a-descriptions-item label="门店地址">{{storeInfo.address}}</a-descriptions-item>
    <a-descriptions-item label="返佣比例">{{storeInfo.spendpercent}}</a-descriptions-item>
    <a-descriptions-item label="门店电话">{{storeInfo.storephone}}</a-descriptions-item>
    <a-descriptions-item label="门店状态">
      <a-badge status="default" text="未定义" v-if="this.storeInfo.storestatus == 4" />
      <a-badge status="success" text="开店" v-else-if="this.storeInfo.storestatus == 3" />
      <a-badge status="warning" text="休业" v-else-if="this.storeInfo.storestatus == 2" />
      <a-badge status="error" text="关店" v-else-if="this.storeInfo.storestatus == 1" />
      <a-badge status="processing" text="不营业" v-else="this.storeInfo.storestatus == 0" />
    </a-descriptions-item>
    <a-descriptions-item label="开始营业">
      {{storeInfo.openinghours}}
    </a-descriptions-item>
    <a-descriptions-item label="结束营业">
      {{storeInfo.closinghours}}
    </a-descriptions-item>
<a-descriptions-item label="公告内容" :span="3">
      <!-- <a-textarea defaultValue="请修改公告内容" v-model="storeInfo.detailedintroduction"></a-textarea> -->
      {{storeInfo.detailedintroduction}}
    </a-descriptions-item>
  </a-descriptions>
  </a-descriptions>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      storeInfo: {},
    };
  },
  computed: {
    ...mapState({
      userInfo: (state) => state.account.userInfo,
    }),
  },
  mounted() {
    this.getStoreInfo();
  },
  methods: {
    // 根据电话号码=登录名获取门店信息
    getStoreInfo() {
      let user = this.$db.get("USER");
      this.$get(`/business/LantianStore/getByPhone/${user.username}`)
        .then((res) => {
          return this.setStoreInfo(res.data.data);
        })
      // }
    },
    // 渲染数据到浏览器
    setStoreInfo(storeInfo) {
      this.storeInfo = storeInfo;
    },
  },
};
</script>
<style>
</style>
