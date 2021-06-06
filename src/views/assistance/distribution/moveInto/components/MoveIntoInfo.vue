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
import event from "@/utils/event";

const columns = [
  { title: "id", dataIndex: "id" },
  { title: "申请人", dataIndex: "title", align: "center" },
  { title: "申请理由", dataIndex: "content", align: "center" },
  { title: "创建时间", width: 200, dataIndex: "createTime", align: "center" },
  {
    title: "操作",
    width: 200,
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
    this.getQuestion();
  },
  methods: {
    // 修改答疑modal
    onUpdateQuestion(record) {
      this.changeVisible = true;
      this.form.getFieldDecorator("title");
      this.form.getFieldDecorator("detail");
      this.form.setFieldsValue({
        title: record.title,
        detail: record.detail,
      });
      this.question = record;
    },
    // 获取所有入驻申请
    getQuestion() {
      this.$get("/backend/notice/selectAllByNoticeStatus").then((res) => {
        this.dataSource = res.data.data;
      });
    },
    // 删除入驻申请
    confirmDelete(record) {
      this.$delete("/backend/notice", { id: record.id }).then(() => {
        let dataSource = this.dataSource.filter((item) => {
          return item.id !== record.id;
        });
        this.dataSource = dataSource;
      });
    },
    onDeleteOuter(record) {
      this.$get("/aidServiceType/delete", { id: record.id }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter(
          (item) => item.id !== record.id
        );
      });
    },
  },
};
</script>
<style>
</style>
