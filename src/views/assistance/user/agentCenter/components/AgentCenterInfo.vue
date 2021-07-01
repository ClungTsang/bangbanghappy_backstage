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
      let token = this.$db.get("USER_TOKEN");
      // let user = this.$db.get("USER");
      // 超管和一级代理具备全查
      this.$get("/wechatcustomer/list", {
        Authentication: token,
        pageSize: 10,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
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
  },
};
</script>
