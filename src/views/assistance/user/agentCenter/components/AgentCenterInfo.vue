<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="headimgurl" slot-scope="text, record">
        <img style="width: 60px; heigth: 60px" :src="record.headimgurl" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该代理"
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
  {
    title: "头像",
    dataIndex: "headimgurl",
    scopedSlots: { customRender: "headimgurl" },
    width: 100,
    align: "center",
  },
  {
    title: "代理人姓名",
    dataIndex: "realname",
    width: 150,
    align: "center",
  },
  {
    title: "电话号码",
    dataIndex: "phonenum",
    width: 200,
    align: "center",
  },
  {
    title: "代理区域",
    dataIndex: "agentdescription",
    width: 200,
    align: "center",
    ellipsis: true,
  },
  {
    title: "更新时间",
    dataIndex: "updatetime",
    width: 200,
    align: "center",
  },
  {
    title: "操作",
    width: 250,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  data() {
    return {
      dataSource: [],
      columns,
      pagination: {},
      loading: false,
      setPersonalVisible: false,
    };
  },
  mounted() {
    this.fetch();
    // 接受下拉框的分类storeid
  },
  methods: {
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      // 设定1000个对象，不够后期再加
      this.$get("/wechatcustomer/list", {
        pageSize: 10000,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        // pagination.total = res.data.data.total;
        let dataSource = res.data.data.rows.filter((item) => {
          return item.agent == 1;
        });
        this.dataSource = dataSource;
        this.loading = false;
        this.pagination = pagination;
      });
    },
    // 切换交押金状态
    onChangeMoney(e, record) {
      const params = { needdeposit: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    onChangeStatus(e, record) {
      const params = { wechatcustomerStatus: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 删除代理
    confirmDelete(record) {
      const params = { agent: 0, agentdescription: "", id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.id !== record.id);
        this.$message.success("删除成功");
      });
    },
  },
};
</script>
