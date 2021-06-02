<template>
  <div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :pagination="pagination"
      :loading="loading"
    >
      <!-- 求助状态变更 -->
      <span slot="aidorderstatus" slot-scope="text, record">
        <a-select
          :default-value="
            text == 1
              ? '待付款'
              : text == 2
              ? '待援助'
              : text == 3
              ? '援助中'
              : text == 4
              ? '处理中'
              : text == 5
              ? '已完成'
              : text == 6
              ? '已取消'
              : '已关闭'
          "
          style="width: 100px"
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
          title="确定删除该订单"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除订单</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="showInfoModal(record)">查看详细</a>
      </span>
    </a-table>

    <assist-info-modal
      :infoVisible="assistInfoShow"
      :info="assistInfo"
      @close="onClose"
    ></assist-info-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: "求助编号",
    dataIndex: "outTradeNo",
    width: 100,
    align: "center",
  },

  {
    title: "客户电话",
    width: 100,
    dataIndex: "publishUserNamemobile",
    align: "center",
  },
  {
    title: "求助分类",
    width: 100,
    dataIndex: "classifyName",
    align: "center",
  },
  {
    title: "求助标题",
    width: 100,
    dataIndex: "title",
    align: "center",
  },
  {
    title: "求助创建时间",
    width: 100,
    dataIndex: "createtime",
    align: "center",
  },
  {
    title: "状态更改",
    width: 100,
    dataIndex: "aidorderstatus",
    align: "center",
    scopedSlots: { customRender: "aidorderstatus" },
  },
  {
    title: "操作",
    width: 100,
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
      selectedRowKeys: [],
      loading: false,
      assistInfoShow: false,
      assistInfo: null,
    };
  },
  created() {},
  mounted() {
    this.fetch();
    // 接受下拉框的分类storeid
  },
  methods: {
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
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
      let user = this.$db.get("USER");
      // 超管和一级代理具备全查
      this.$get("/aidOrder/list", {
        Authentication: token,
        pageSize: 10,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.loading = false;
        // 遍历数组
        let dataSourceList = res.data.data.rows;
        dataSourceList.forEach((item) => {
          item.key = item.id;
          this.dataSource.push(item);
        });
        this.pagination = pagination;
      });
    },
    // 切换显示状态
    onChange(e, record) {
      console.log(e, record);
      const params = { aidorderstatus: e, id: record.key };
      this.$post("/aidOrder/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },

    // 选择列
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },

    // 删除求助
    onDeleteAssistModal() {},
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
    // 查看求助详细
    showInfoModal(record) {
      this.assistInfoShow = true;
      // console.log(record);
      this.assistInfo = record;
    },
    // 关闭求助详细
    onClose() {
      this.assistInfoShow = false;
    },
  },
};
</script>
<style>
</style>
