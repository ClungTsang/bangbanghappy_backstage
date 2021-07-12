<template>
  <div>
    <a-descriptions title="我的门店" bordered>
    <a-descriptions-item label="门店名称">
      {{storeInfo.companyname}}
    </a-descriptions-item>
    <a-descriptions-item label="联系人">{{storeInfo.storeowner}}</a-descriptions-item>
    <a-descriptions-item label="联系方式">{{storeInfo.bossmobilenumber}}</a-descriptions-item>
    <a-descriptions-item label="门店地址">{{storeInfo.address}}</a-descriptions-item>
    <a-descriptions-item label="返佣比例">{{storeInfo.spendpercent}}%</a-descriptions-item>
    <a-descriptions-item label="门店电话">{{storeInfo.storephone}}</a-descriptions-item>
    <a-descriptions-item label="门店状态">

      <a-badge status="default" text="未定义" v-if="this.storeInfo.storestatus == 4" />
      <a-badge status="success" text="开店" v-else-if="this.storeInfo.storestatus == 3" />
      <a-badge status="warning" text="休业" v-else-if="this.storeInfo.storestatus == 2" />
      <a-badge status="error" text="关店" v-else-if="this.storeInfo.storestatus == 1" />
      <a-badge status="processing" text="不营业" v-else="this.storeInfo.storestatus == 0" />
    </a-descriptions-item>
    <a-descriptions-item label="开始营业时间">
      {{storeInfo.openinghours}}
    </a-descriptions-item>
    <a-descriptions-item label="结束营业时间">
      {{storeInfo.closinghours}}
    </a-descriptions-item>
    <a-descriptions-item label="公告内容" :span="3">
      <!-- <a-textarea defaultValue="请修改公告内容" v-model="storeInfo.detailedintroduction"></a-textarea> -->
      {{storeInfo.detailedintroduction}}
    </a-descriptions-item>
    <a-descriptions-item label="绑定状态">
      <a-badge status="success" text="已绑定公众号" v-if="this.bindingStatus" />
      <a-badge status="error" text="未绑定公众号" v-else />
    </a-descriptions-item>
  </a-descriptions>
  </a-descriptions>
  </div>
</template>
<script>
import event from '@/utils/event.js'
export default {
  data() {
    return {
      storeInfo: {},
      bindingStatus: false,
    };
  },
  created() {
    this.getStoreInfo();
    this.getBindingStatus();
  },
  mounted(){
event.$on('changeStoreStatus',()=>{
  this.getStoreInfo();
    this.getBindingStatus();
})
  },
  methods: {
    // 根据电话号码=登录名获取门店信息
    getStoreInfo() {
      let user = this.$db.get("USER");
      this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
        (res) => {
          return this.setStoreInfo(res.data.data);
        }
      );
    },
    // 获取公众号绑定状态
    async getBindingStatus() {
      let user = this.$db.get("USER");
      //根据不同的角色请求旗下门店

      let result = await this.$get("/wechatcustomerByBossmobilenumber", {
        wechatcustomerByBossmobilenumber: user.username,
      });
      if (result.data.data.openid) {
        this.bindingStatus = true;
      }
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
