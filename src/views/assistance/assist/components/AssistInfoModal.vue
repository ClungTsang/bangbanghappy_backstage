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
        <a-descriptions-item label="订单编号">
          {{ assistInfo.outTradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="所属范围">
          {{ assistInfo.oncampus == 0 ? "校外" : "校内" }}
        </a-descriptions-item>
        <a-descriptions-item label="分类名称">{{
          assistInfo.classifyName
        }}</a-descriptions-item>
        <a-descriptions-item label="客户名字">{{
          assistInfo.publishUserOpenid
        }}</a-descriptions-item>
        <a-descriptions-item label="客户电话">{{
          assistInfo.publishUserNamemobile
        }}</a-descriptions-item>
        <a-descriptions-item label="客户地址">{{
          assistInfo.addressDetail
        }}</a-descriptions-item>
        <a-descriptions-item label="援助佣金">{{
          assistInfo.aidAmout
        }}</a-descriptions-item>
        <a-descriptions-item label="对求助者的抽成比例">{{
          assistInfo.aidPlatformIncome
        }}</a-descriptions-item>
        <a-descriptions-item label="对援助者的抽成比例">{{
          assistInfo.aiderIncome
        }}</a-descriptions-item>
        <a-descriptions-item label="求助内容">
          {{ assistInfo.description }}
        </a-descriptions-item>
        <a-descriptions-item label="求助标题">
          {{ assistInfo.title }}
        </a-descriptions-item>
        <a-descriptions-item label="商品价值">{{
          assistInfo.assistprice
        }}</a-descriptions-item>

        <a-descriptions-item label="求助状态">
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

        <a-descriptions-item label="援助者">{{
          assistInfo.aidUserOpenid
        }}</a-descriptions-item>
        <a-descriptions-item label="援助者电话">{{
          assistInfo.aidUserNamemobile
        }}</a-descriptions-item>
        <a-descriptions-item label="求助创建时间">{{
          assistInfo.createtime
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
      assistInfo: {},
    };
  },
  computed: {
    visible() {
      return this.infoVisible;
    },
  },
  watch: {
    info(val) {
      this.assistInfo = val;
    },
  },
  methods: {
    handleOk() {
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
