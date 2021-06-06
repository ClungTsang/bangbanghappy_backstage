<template>
  <div>
    <a-modal
      :visible="visible"
      :width="1400"
      title="该订单详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-descriptions bordered>
        <a-descriptions-item label="订单编号" :span="2">
          {{ assistInfo.outTradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="订单创建时间">
          {{ assistInfo.createtime }}
        </a-descriptions-item>
        <a-descriptions-item label="订单分类">
          {{ assistInfo.oncampus == 0 ? "校外" : "校内" }}
        </a-descriptions-item>
        <a-descriptions-item label="分类名称">{{
          assistInfo.classifyName
        }}</a-descriptions-item>
        <a-descriptions-item label="订单状态">
          <a-badge
            status="warning"
            text="待付款"
            v-if="this.assistInfo.aidorderstatus == 1"
          />
          <a-badge
            status="processing"
            text="待援助"
            v-else-if="this.assistInfo.aidorderstatus == 2"
          />
          <a-badge
            status="processing"
            text="援助中"
            v-else-if="this.assistInfo.aidorderstatus == 3"
          />
          <a-badge
            status="error"
            text="处理中"
            v-else="this.assistInfo.aidorderstatus == 4"
          />
          <a-badge
            status="success"
            text="已完成"
            v-else-if="this.assistInfo.aidorderstatus == 5"
          />
          <a-badge
            status="default"
            text="已关闭"
            v-else-if="this.assistInfo.aidorderstatus == 6"
          />
          <a-badge
            status="warning"
            text="待援助"
            v-else="this.assistInfo.aidorderstatus == 7"
          />
        </a-descriptions-item>

        <a-descriptions-item label="客户名字">{{
          orderUser.realname
        }}</a-descriptions-item>
        <a-descriptions-item label="客户电话">{{
          assistInfo.publishUserNamemobile
        }}</a-descriptions-item>
        <a-descriptions-item label="客户地址">{{
          assistInfo.addressDetail
        }}</a-descriptions-item>
        <!-- 自定义订单渲染 -->

        <a-descriptions-item label="订单标题">
          {{ assistInfo.description }}
        </a-descriptions-item>
        <a-descriptions-item label="订单内容">
          {{ assistInfo.title }}
        </a-descriptions-item>
        <a-descriptions-item label="商品价值">
          {{ assistInfo.assistprice }}
        </a-descriptions-item>
        <a-descriptions-item label="援助佣金">{{
          assistInfo.aidAmout
        }}</a-descriptions-item>
        <a-descriptions-item label="平台抽成比例">
          {{ assistInfo.aidPlatformIncome }}
        </a-descriptions-item>
        <a-descriptions-item label="援助者得到的佣金">{{
          assistInfo.aiderIncome
        }}</a-descriptions-item>

        <!-- 商铺渲染 -->

        <a-descriptions-item label="商铺名称">{{
          mallInfo.companyname
        }}</a-descriptions-item>
        <a-descriptions-item label="商铺联系人">
          {{ mallInfo.storeowner }}
        </a-descriptions-item>
        <a-descriptions-item label="商铺电话">{{
          mallInfo.storephone
        }}</a-descriptions-item>
        <a-descriptions-item label="订单标题">
          {{ assistInfo.title }}
        </a-descriptions-item>
        <a-descriptions-item label="菜品内容">
          {{ assistInfo.content }}
        </a-descriptions-item>
        <a-descriptions-item label="商品价值">
          {{ assistInfo.materialsAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="援助者">{{
          assistor.realname
        }}</a-descriptions-item>
        <a-descriptions-item label="援助者电话">{{
          assistor.phonenum
        }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    infoVisible: {
      type: Boolean,
      default: false,
    },
    info: {
      default: {},
    },
  },
  data() {
    return {
      // 订单信息
      assistInfo: {},
      // 求助者信息
      orderUser: {},
      // 援助者信息
      assistor: {},
      // 商铺信息
      mallInfo: {},
    };
  },
  computed: {
    visible() {
      return this.infoVisible;
    },
  },
  created() {},
  watch: {
    info(val) {
      this.getAssistorInfo();
      this.getOrderUserInfo();
      this.getMallInfo();
      this.assistInfo = val;
      console.log(this.assistInfo);
    },
  },
  methods: {
    // 控制开关
    handleOk() {
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
    // 获取求助者信息
    getOrderUserInfo() {
      const params = { openid: this.assistInfo.publishUserOpenid };
      this.$get("/wechatcustomerByopenId", { ...params }).then((res) => {
        if (res.data.data) {
          this.orderUser = res.data.data;
        }
      });
    },
    // 获取援助者信息
    getAssistorInfo() {
      const params = { openid: this.assistInfo.aidUserOpenid };
      this.$get("/wechatcustomerByopenId", { ...params }).then((res) => {
        if (res.data.data) {
          this.assistor = res.data.data;
        }
      });
    },
    // 获取商铺信息
    getMallInfo() {
      if (this.assistInfo.blackboardId) {
        let id = this.assistInfo.blackboardId;
        this.$get(`/business/LantianStore/${id}`).then((res) => {
          if (res.data.data) {
            this.mallInfo = res.data.data;
          }
        });
      }
    },
  },
};
</script>
