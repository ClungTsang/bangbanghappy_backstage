<template>
  <div>
    <a-modal
      :visible="visible"
      title="查看求助详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1200"
    >
      <a-descriptions title="" bordered>
        <a-descriptions-item label="订单编号">
          {{ assist.orderid }}
        </a-descriptions-item>
        <a-descriptions-item label="客户名字">{{
          assist.clientname
        }}</a-descriptions-item>
        <a-descriptions-item label="客户电话">{{
          assist.clientphone
        }}</a-descriptions-item>

        <a-descriptions-item label="求助状态">
          <a-badge
            status="warning"
            text="待援助"
            v-if="this.assist.status == 0"
          />
          <a-badge
            status="processing"
            text="援助中"
            v-else-if="this.assist.status == 1"
          />
          <a-badge
            status="success"
            text="已完成"
            v-else-if="this.assist.status == 2"
          />
          <a-badge
            status="error"
            text="处理中"
            v-else="this.assist.status == 3"
          />
        </a-descriptions-item>
<a-descriptions-item label="援助金额">{{
          assist.cost
        }}</a-descriptions-item>
        <a-descriptions-item label="商品价值">{{
          assist.assistprice
        }}</a-descriptions-item>

        <a-descriptions-item label="援助者">{{
          assist.assistor
        }}</a-descriptions-item>
        <a-descriptions-item label="援助者电话">{{
          assist.assistorPhone
        }}</a-descriptions-item>
<a-descriptions-item label="备注信息">{{
          assist.notice
        }}</a-descriptions-item>
        <a-descriptions-item label="求助创建时间">{{
          assist.createtime
        }}</a-descriptions-item>
        <a-descriptions-item label="预计完成时间">{{
          assist.tradetime
        }}</a-descriptions-item>

        <a-descriptions-item label="求助内容" :span="2">{{
          assist.assistinfo
        }}</a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formLayout: "horizontal",
      assist: {},
    };
  },
  props: {
    showVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: {},
    },
  },
  computed: {
    visible() {
      return this.showVisible;
    },
  },
  watch: {
    data(val) {
      this.assist = val;
    },
  },
  methods: {
    handleOk() {
      this.$emit("cancel");
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style>
</style>
