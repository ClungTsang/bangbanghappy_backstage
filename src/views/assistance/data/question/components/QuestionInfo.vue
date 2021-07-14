<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource">
      <span slot="isDelete" slot-scope="text, record">
        <!-- {{text ==0?显示:不显示}} -->
        <a-select
          :default-value="text == 0 ? '显示' : '不显示'"
          style="width: 80px"
          @change="
            (e) => {
              onChange(e, record);
            }
          "
        >
          <a-select-option value="0"> 显示 </a-select-option>
          <a-select-option value="1"> 不显示 </a-select-option>
        </a-select>
      </span>

      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该答疑"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除答疑</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="onUpdateQuestion(record)">修改答疑</a>
      </span>
    </a-table>
    <a-modal
      :visible="changeVisible"
      title="修改答疑"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="问题标题">
          <a-input v-decorator="['title']"></a-input>
        </a-form-item>
        <a-form-item label="问题解答">
          <a-textarea v-decorator="['detail']"></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import event from "@/utils/event";

const columns = [
  // { title: "id", dataIndex: "id" },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
    width: 200,
    ellipsis: true,
  },
  {
    title: "内容",
    dataIndex: "detail",
    align: "center",
    width: 500,
    ellipsis: true,
  },
  {
    title: "是否显示",
    dataIndex: "isDelete",
    align: "center",
    scopedSlots: { customRender: "isDelete" },
  },
  { title: "创建时间", width: 200, dataIndex: "createTime", align: "center" },
  { title: "更新时间", width: 200, dataIndex: "updateTime", align: "center" },
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
      changeVisible: false,
      form: this.$form.createForm(this),
      question: null,
    };
  },
  created() {
    this.getQuestion();
  },
  mounted() {
    event.$on("addCompleted", () => {
      this.dataSource = [];
      this.getQuestion();
    });
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
    //修改答疑
    handleOk() {
      let value = this.form.getFieldsValue();
      let id = this.question.id;
      this.$post("/question/update", { ...value, id: id }).then(() => {
        this.changeVisible = false;
        this.dataSource = [];
        this.getQuestion();
      });
    },
    // 切换显示状态
    onChange(e, record) {
      const params = { isDelete: e, id: record.id };
      this.$post("/question/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 取消修改答疑
    handleCancel() {
      this.changeVisible = false;
    },
    // 获取所有问题
    getQuestion() {
      this.$get("/question").then((res) => {
        this.dataSource = res.data.data;
      });
    },
    // 删除问题
    confirmDelete(record) {
      this.$get("/question/delete", { id: record.id }).then(() => {
        let dataSource = this.dataSource.filter((item) => {
          return item.id !== record.id;
        });
        this.dataSource = dataSource;
      });
    },
  },
};
</script>
<style>
</style>
