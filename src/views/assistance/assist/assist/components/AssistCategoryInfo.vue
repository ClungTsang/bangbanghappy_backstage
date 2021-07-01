<template>
  <div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <!-- 订单状态变更 -->
      <span slot="aidorderstatus" slot-scope="text, record">
        {{
          text == 1
            ? "待付款"
            : text == 2
            ? "待援助"
            : text == 3
            ? "援助中"
            : text == 4
            ? "处理中"
            : text == 5
            ? "已完成"
            : text == 6
            ? "已取消"
            : "已关闭"
        }}
        <a-divider type="vertical"></a-divider>
        <!-- 超级管理作弊快捷切换 -->
        <a-select
          v-hasPermission="['order:change']"
          style="width: 100px"
          default-value="快速切换"
          @change="
            (e) => {
              onChange(e, record);
            }
          "
        >
          <a-select-option value="1">待付款</a-select-option>
          <a-select-option value="2">待援助</a-select-option>
          <a-select-option value="3">援助中</a-select-option>
          <a-select-option value="4">处理中</a-select-option>
          <a-select-option value="5">已完成</a-select-option>
          <a-select-option value="6">已取消</a-select-option>
          <a-select-option value="7">已关闭</a-select-option>
        </a-select>
      </span>
      <!-- 操作控制 -->
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定完成该订单"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmOk(record)"
        >
          <a>完成订单</a>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>
        <a-popconfirm
          title="确定关闭该订单"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmClose(record)"
        >
          <a>关闭订单</a>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>
        <a @click="showInfoModal(record)">查看</a>
      </span>
    </a-table>

    <assist-info-modal
      :infoVisible="assistInfoShow"
      :id="id"
      @close="onClose"
    ></assist-info-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "订单编号",
    dataIndex: "outTradeNo",
    width: 70,
    align: "center",

    ellipsis: true,
  },

  {
    title: "客户电话",
    width: 100,
    dataIndex: "publishUserNamemobile",
    align: "center",
  },
  {
    title: "订单分类",
    width: 100,
    dataIndex: "classifyName",
    align: "center",
  },
  {
    title: "订单标题",
    width: 100,
    dataIndex: "title",
    align: "center",
  },
  {
    title: "订单创建时间",
    width: 100,
    dataIndex: "createtime",
    align: "center",
  },
  {
    title: "状态",
    width: 50,
    dataIndex: "aidorderstatus",
    filters: [
      { text: "待付款", value: "1" },
      { text: "待援助", value: "2" },
      { text: "援助中", value: "3" },
      { text: "处理中", value: "4" },
      { text: "已完成", value: "5" },
      { text: "已取消", value: "6" },
      { text: "已关闭", value: "7" },
    ],
    align: "center",
    scopedSlots: { customRender: "aidorderstatus" },
  },
  {
    title: "操作",
    width: 120,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
import AssistInfoModal from "./AssistInfoModal";
export default {
  components: { AssistInfoModal },
  data() {
    return {
      columns,
      dataSource: [],
      pagination: {},
      loading: false,
      selectedRowKeys: [],
      assistInfoShow: false,
      id: null,
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
        ...filters,
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      let token = this.$db.get("USER_TOKEN");
      // 超管和一级代理具备全查
      this.$get("/aidOrder/list", {
        Authentication: token,
        pageSize: 10,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.loading = false;
        this.dataSource = res.data.data.rows;
        this.pagination = pagination;
      });
    },
    // 切换显示状态
    onChange(e, record) {
      const params = { aidorderstatus: e, id: record.id };
      this.$post("/aidOrder/updateByAidorderstatus", { ...params }).then(() => {
        this.$message.success("切换成功");
        // return this.fetch()
      });
    },

    // 选择列
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },

    onCloseAssistShowModal() {
      this.assistInfoVisible = false;
      console.log("closeMenu");
    },
    onCancelAssistShowModal() {
      this.assistInfoVisible = false;
    },
    // 删除问题
    confirmDelete(record) {
      this.$get("/aidOrder/delete", { id: record.id }).then(() => {
        let dataSource = this.dataSource.filter((item) => {
          return item.id !== record.id;
        });
        this.dataSource = dataSource;
      });
    },
    // 查看订单详细
    showInfoModal(record) {
      this.id = record.id;
      this.assistInfoShow = true;
      // console.log(record);
    },
    // 关闭订单详细
    onClose() {
      this.assistInfoShow = false;
    },
    // 改变订单为关闭状态
    confirmClose(record) {
      const params = { aidorderstatus: 7, id: record.id };
      this.$post("/aidOrder/updateByAidorderstatus", { ...params }).then(() => {
        this.$message.success("关闭订单成功");
        // return this.fetch();
      });
    },
    // 改变订单为完成状态
    confirmOk(record) {
      const params = { aidorderstatus: 5, id: record.id };
      this.$post("/aidOrder/updateByAidorderstatus", { ...params }).then(() => {
        this.$message.success("完成订单成功");
        // return this.fetch();
      });
    },
  },
};
</script>
<style>
</style>
