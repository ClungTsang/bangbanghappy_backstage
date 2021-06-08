<template>
  <div>
    <a-card :bordered="false">
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
        <span slot="needdeposit" slot-scope="text, record">
          <a-select
          :default-value="
            text == 1?'需要':'不需要'"
          style="width: 100px"
          @change="
            (e) => {
              onChange(e, record);
            }
          "
        >
          <a-select-option value="1">需要</a-select-option>
          <a-select-option value="0">不需要</a-select-option>
        </a-select>
        </span>
      </a-table>
    </a-card>
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
    dataIndex: "customername",
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
    title: "会员等级",
    dataIndex: "viplevel",
    width: 100,
    align: "center",
  },
  {
    title: "更新时间",
    dataIndex: "updatetime",
    width: 200,
    align: "center",
  },
  {
    title: "是否需要交押金",
    dataIndex: "needdeposit",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "needdeposit" },
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
        pageNum: pagination.current
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      let token = this.$db.get("USER_TOKEN");
      // let user = this.$db.get("USER");
      // 超管和一级代理具备全查
      this.$get("/wechatcustomer", {
        Authentication: token,
        pageSize: 10,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.loading = false;
        // 遍历数组
        this.dataSource = res.data.data;
        this.pagination = pagination;
      });
    },
    // 切换显示状态
    onChange(e, record) {
      console.log(e, record);
      const params = { needdeposit: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
  },
};
</script>
