<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="amount" slot-scope="text, record"> {{ text }}元 </span>
      <span slot="analysisstatus" slot-scope="analysisstatus">
        <a-tag
          v-for="tag in analysisstatus"
          :key="tag"
          :color="tag == 4 ? 'blue' : 'green'"
        >
          {{
            tag == 4
              ? "管理员援助提成收益流水记录"
              : "管理员抽成一级代理流水记录"
          }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showInfoModal(record)">查看订单</a>
      </span>
    </a-table>
    <assist-info-modal
      :infoVisible="assistInfoShow"
      :id="outTradeNo"
      @close="onClose"
    ></assist-info-modal>
  </div>
</template>
<script>
import AssistInfoModal from "./AssistInfoModal.vue";

const columns = [
  {
    title: "订单编号",
    dataIndex: "outTradeNo",
    align: "center",
    width: 300,
    ellipsis: true,
  },
  { title: "描述", dataIndex: "contentLog", align: "center" },
  {
    title: "类型",
    key: "analysisstatus",
    dataIndex: "analysisstatus",
    align: "center",
    scopedSlots: { customRender: "analysisstatus" },
    filters: [
      { text: "管理员援助提成收益流水记录", value: "4" },
      { text: "管理员抽成一级代理流水记录", value: "5" },
    ],
    filterMultiple: false,
  },
  {
    title: "金额",
    dataIndex: "amount",
    align: "center",
    scopedSlots: { customRender: "amount" },
  },
  { title: "日期", width: 200, dataIndex: "createtime", align: "center" },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { AssistInfoModal },

  data() {
    return {
      columns,
      dataSource: [],
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
      assistInfoShow: false,
      outTradeNo: 0,
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
        ...filters,
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      this.$get("/aidDataAnalysis/listByOpenid", {
        openid: "manger_bangbanghelper_boss",
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.dataSource = res.data.data.rows;
        this.loading = false;
        this.pagination = pagination;
      });
    },
    // 查看订单详细
    showInfoModal(record) {
      console.log(record);
      this.outTradeNo = record.outTradeNo;
      this.assistInfoShow = true;
      // console.log(record);
    },
    // 关闭订单详细
    onClose() {
      this.assistInfoShow = false;
    },
  },
};
</script>
<style>
</style>
