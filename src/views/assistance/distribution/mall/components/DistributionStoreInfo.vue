<template>
  <div>
    <a-modal
      :visible="visible"
      :width="1100"
      title="该门店详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-descriptions title="我的门店" bordered>
        <a-descriptions-item label="门店名称">
          <!-- <a-input defaultValue="内容" v-model="storeInfo.companyname"></a-input> -->
          {{ storeInfo.companyname }}
        </a-descriptions-item>
        <a-descriptions-item label="联系人">{{
          storeInfo.storeowner
        }}</a-descriptions-item>
        <a-descriptions-item label="联系人电话">{{
          storeInfo.bossmobilenumber
        }}</a-descriptions-item>
        <a-descriptions-item label="门店地址">{{
          storeInfo.address
        }}</a-descriptions-item>
        <a-descriptions-item label="抽成比例">{{
          storeInfo.spendpercent
        }}</a-descriptions-item>
        <a-descriptions-item label="门店电话">{{
          storeInfo.storephone
        }}</a-descriptions-item>
        <a-descriptions-item label="门店状态">
          <a-badge
            status="default"
            text="未定义"
            v-if="this.storeInfo.storestatus == 4"
          />
          <a-badge
            status="success"
            text="开店"
            v-else-if="this.storeInfo.storestatus == 3"
          />
          <a-badge
            status="warning"
            text="休店"
            v-else-if="this.storeInfo.storestatus == 2"
          />
          <a-badge
            status="error"
            text="关店"
            v-else-if="this.storeInfo.storestatus == 1"
          />
          <a-badge
            status="processing"
            text="不营业"
            v-else="this.storeInfo.storestatus == 0"
          />
        </a-descriptions-item>
        <a-descriptions-item label="开始营业">
          {{ storeInfo.openinghours }}
        </a-descriptions-item>
        <a-descriptions-item label="结束营业">
          {{ storeInfo.closinghours }}
        </a-descriptions-item>
        <a-descriptions-item label="安全秘钥">
          {{ storeInfo.pwdkey }}
        </a-descriptions-item>
        <a-descriptions-item label="绑定状态">
          {{ storeInfo.gzhopenid ? "已绑定" : "未绑定" }}
        </a-descriptions-item>
        <a-descriptions-item label="绑定openid">
          {{ storeInfo.gzhopenid ? storeInfo.gzhopenid : "无openid" }}
        </a-descriptions-item>
        <a-descriptions-item label="公告内容" :span="3">
          {{ storeInfo.detailedintroduction }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    infoVisible: {
      type: Boolean,
      default: false
    },
    id: {
      default: 0
    }
  },
  data() {
    return {
      storeInfo: {}
    };
  },
  computed: {
    visible() {
      return this.infoVisible;
    }
  },
  watch: {
    id(val) {
      this.getMallInfo(val);
    }
  },
  methods: {
    handleOk() {
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
    // 网络请求商铺信息
    getMallInfo(id) {
      this.$get(`/business/LantianStore/${id}`).then(res => {
        this.storeInfo = res.data.data;
      });
    }
  }
};
</script>
