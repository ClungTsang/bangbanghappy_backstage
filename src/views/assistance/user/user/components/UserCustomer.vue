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
         <span slot="viplevel" slot-scope="text, record">
           {{text == 0 ? '非会员' : '会员'}}
          </a-select>
        </span>
        <span slot="wechatcustomerStatus" slot-scope="text, record">
          <a-select
            :defaultValue="text == 0 ? '不限制' : '限制'"
            style="width: 100px"
            @change="
              (e) => {
                onChangeStatus(e, record);
              }
            "
          >
            <a-select-option value="0">不限制</a-select-option>
            <a-select-option value="1">限制</a-select-option>
          </a-select>
        </span>

        <span slot="needdeposit" slot-scope="text, record">
          <a-select
            :defaultValue="text == 1 ? '需要' : '不需要'"
            style="width: 100px"
            @change="
              (e) => {
                onChangeMoney(e, record);
              }
            "
          >
            <a-select-option value="1">需要</a-select-option>
            <a-select-option value="0">不需要</a-select-option>
          </a-select>
        </span>
        <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该用户"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除用户</a>
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
    title: "用户姓名",
    dataIndex: "realname",
    width: 150,
    align: "center",
  },
  {
    title: "用户昵称",
    dataIndex: "customername",
    width: 150,
    align: "center",
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: 100,
    align: "center",
  },
  {
    title: "电话号码",
    dataIndex: "phonenum",
    width: 200,
    align: "center",
  },
  {
    title: "会员等级",
    dataIndex: "viplevel",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "viplevel" },
  },
  {
    title: "更新时间",
    dataIndex: "updatetime",
    width: 200,
    align: "center",
  },
  {
    title: "是否限制援助他人",
    dataIndex: "wechatcustomerStatus",
    align: "center",
    width: 150,
    scopedSlots: { customRender: "wechatcustomerStatus" },
  },
  {
    title: "是否需要交押金",
    dataIndex: "needdeposit",
    align: "center",
    width: 150,
    scopedSlots: { customRender: "needdeposit" },
  },
  {
    title: "操作",
    width: 100,
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
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
      },
      loading: false,
      setPersonalVisible: false,
    };
  },
  mounted() {
    this.fetch();
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
      this.$get("/wechatcustomer/list", {
        pageSize: 10,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.dataSource = res.data.data.rows;
        this.loading = false;
        this.pagination = pagination;
      });
    },
    // 切换交押金状态
    onChangeMoney(e, record) {
      console.log(e, record);
      const params = { needdeposit: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 切换用户援助状态
    onChangeStatus(e, record) {
      console.log(e, record);
      const params = { wechatcustomerStatus: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 删除用户
    // 删除问题
    confirmDelete(record) {
      this.$get("/wechatcustomer/delete", { id: record.id }).then(() => {
        let dataSource = this.dataSource.filter((item) => {
          return item.id !== record.id;
        });
        this.$message.success("删除用户成功");
        this.dataSource = dataSource;
      });
    },
  },
};
</script>
