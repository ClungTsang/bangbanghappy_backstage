<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource">
      <span slot="certificateUrls" slot-scope="text, record">
        <img style="width: 300px; heigth: auto" :src="record.certificateUrls" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="该操作视为协商成功"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleOk(record)"
        >
          <a>已解决</a>
        </a-popconfirm>
        <a-divider></a-divider>
        <a-popconfirm
          title="该操作视为协商失败，订单状态更改成已关闭"
          ok-text="确定"
          cancel-text="取消"
          @confirm="handleFail(record)"
        >
          <a>关闭订单</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  { title: "id", dataIndex: "id" },
  { title: "联系人", dataIndex: "publishUserNamemobile", align: "center" },
  { title: "订单编号", dataIndex: "outTradeNo", align: "center" },
  { title: "订单内容", dataIndex: "description", align: "center" },
  {
    title: "凭证内容",
    width: 200,
    dataIndex: "certificateContent",
    align: "center",
  },
  {
    title: "凭证图片",
    width: 300,
    dataIndex: "certificateUrls",
    align: "center",
    scopedSlots: { customRender: "certificateUrls" },
  },
  {
    title: "订单创建时间",
    width: 200,
    dataIndex: "createtime",
    align: "center",
  },
  {
    title: "操作",
    width: 120,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  data() {
    return {
      columns,
      dataSource: [],
      form: this.$form.createForm(this),
      question: null,
    };
  },
  created() {
    this.getMoveInto();
  },
  methods: {
    // 获取所有订单疑问
    getMoveInto() {
      this.$get("/aidOrder/list", {
        noticestatus: 1,
      }).then((res) => {
        this.dataSource = res.data.data.rows;
      });
    },
    //协商成功
    handleOk(record) {
      const params = {};

      this.$post("/aidOrder/update", { params }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.id !== record.id);
      });
    },
    // 协商失败
    handleFail(record) {
      const params = {};
      this.$post("/aidOrder/update", { params }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.id !== record.id);
      });
    },
  },
};
</script>
<style>
</style>
