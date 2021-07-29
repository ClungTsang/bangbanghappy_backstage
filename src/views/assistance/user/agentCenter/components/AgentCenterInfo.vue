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
      <!-- <span slot="agentdescription" slot-scope="text, record">
        <span v-for="item in JSON.parse(text)" :key="item.value">
          {{ item.title }}
        </span>
      </span> -->
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该代理"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除代理</a>
        </a-popconfirm>
        <a @click="changeAgentInfo(record)">编辑代理</a>
      </span>
    </a-table>
    <a-modal
      title="编辑代理信息"
      :targetAgent="targetAgent"
      :visible="agentVisible"
      :width="800"
      :destroyOnClose="true"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form>
        <a-form-item label="区域代理列表" required>
          <a-select
            :default-value="defaultSelection"
            mode="multiple"
            placeholder="请选择"
            @change="handleAreaChange"
          >
            <a-select-option
              v-for="option in selectOptions"
              :key="option.value"
            >
              {{ option.title }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "头像",
    dataIndex: "headimgurl",
    scopedSlots: { customRender: "headimgurl" },
    width: 100,
    align: "center"
  },
  {
    title: "代理人姓名",
    dataIndex: "realname",
    width: 150,
    align: "center"
  },
  {
    title: "电话号码",
    dataIndex: "phonenum",
    width: 200,
    align: "center"
  },
  // {
  //   title: "代理区域",
  //   dataIndex: "agentdescription",
  //   width: 200,
  //   align: "center",
  //   ellipsis: true,
  //   scopedSlots: { customRender: "agentdescription" }
  // },
  {
    title: "更新时间",
    dataIndex: "updatetime",
    width: 200,
    align: "center"
  },
  {
    title: "操作",
    width: 250,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
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
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      loading: false,
      setPersonalVisible: false,
      agentVisible: false,
      selectOptions: [],
      selectedOptionsIds: [],
      targetAgent: null,
      defaultSelection: []
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
        pageNum: pagination.current
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      // 设定1000个对象，不够后期再加
      this.$get("/wechatcustomer/list", {
        pageSize: 10000,
        ...params
      }).then(res => {
        let pagination = { ...this.pagination };
        // pagination.total = res.data.data.total;
        let dataSource = res.data.data.rows.filter(item => {
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
        this.dataSource = dataSource.filter(item => item.id !== record.id);
        this.$message.success("删除成功");
      });
    },
    // 修改代理信息
    changeAgentInfo(record) {
      this.getSelectOptions(record);
      this.targetAgent = record;
      this.agentVisible = true;
    },
    // 确认修改
    async handleOk() {
      const params = {
        id: this.targetAgent.id,
        agentdescription: JSON.stringify(this.selectedOptionsIds)
      };
      await this.$post("/wechatcustomer/update", { ...params });
      this.fetch();
      this.$message.success("修改成功");
      this.agentVisible = false;
    },
    handleCancel() {
      this.agentVisible = false;
    },

    // 获取区域列表
    getSelectOptions(record) {
      this.defaultSelection = [];
      this.selectOptions = [];
      this.$get("/agentInformation/list").then(res => {
        const result = res.data.data.rows;
        result.forEach(item => {
          let params = {
            title: item.agentinformationdescription,
            value: item.id
          };
          this.selectOptions.push(params);
        });
        let res2 = JSON.parse(record.agentdescription);
        res2.forEach(item => {
          this.selectOptions.forEach(options => {
            if (item == options.value) {
              this.defaultSelection.push(options.value);
            }
          });
        });
      });
    },
    // 分类方式
    handleAreaChange(value) {
      console.log(`选择了：`, value);
      this.selectedOptionsIds = value;
    }
  }
};
</script>
