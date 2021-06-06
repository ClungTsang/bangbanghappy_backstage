<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource">
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该申请"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除申请</a>
        </a-popconfirm>
      </span>
    </a-table>
  </div>
</template>
<script>
const columns = [
  { title: "id", dataIndex: "id" },
  { title: "申请人", width: 200, dataIndex: "title", align: "center" },
  { title: "申请理由", width: 300, dataIndex: "content", align: "center" },
  { title: "创建时间", width: 200, dataIndex: "createtime", align: "center" },
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
    // 获取所有入驻申请
    getMoveInto() {
      this.$get("/backend/notice/selectAllByNoticeStatus", {
        noticestatus: 1,
      }).then((res) => {
        this.dataSource = res.data.data.rows;
      });
    },
    // 删除入驻申请
    confirmDelete(record) {
      this.$delete("/backend/notice", { id: record.id }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.id !== record.id);
      });
    },
  },
};
</script>
<style>
</style>
