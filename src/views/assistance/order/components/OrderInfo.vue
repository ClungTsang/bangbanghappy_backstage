<template>
  <div>
    <a-modal
      :visible="visible"
      title="查看订单详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="1000"
    >
      <a-descriptions title="" bordered>
        <a-descriptions-item label="订单编号">
          {{ order.orderid }}
        </a-descriptions-item>
        <a-descriptions-item label="客户名字">{{
          order.clientname
        }}</a-descriptions-item>
        <a-descriptions-item label="客户电话">{{
          order.clientphone
        }}</a-descriptions-item>
        <a-descriptions-item label="订单状态">
          <a-badge
            status="warning"
            text="已付款"
            v-if="this.order.status == 0"
          />
          <a-badge
            status="success"
            text="已付款"
            v-else="this.order.status == 1"
          />
        </a-descriptions-item>
        <a-descriptions-item label="备注信息" :span="2">{{
          order.notice
        }}</a-descriptions-item>
        <a-descriptions-item label="订单创建时间">{{
          order.createtime
        }}</a-descriptions-item>
        <a-descriptions-item label="交易时间">{{
          order.tradetime
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
      order: {},
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
      this.order = val;
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
