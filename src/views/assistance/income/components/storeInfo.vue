<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
      <span slot="outTradeNo" slot-scope="text, record">
        <div v-if="text">{{ text }}</div>
        <div v-else>该订单为提现操作 , 不存在订单编号</div>
      </span>

      <span slot="amount" slot-scope="text, record"> {{ text }}元 </span>
      <span slot="analysisstatus" slot-scope="analysisstatus">
        <a-tag
          v-for="tag in analysisstatus"
          :key="tag"
          :color="tag == 1 ? 'blue' : tag == 2 ? 'orange' : 'green'"
        >
          {{
            tag == 1
              ? "押金记录"
              : tag == 2
              ? "收益记录"
              : tag == 3
              ? "提现记录"
              : tag == 4
              ? "管理员援助提成收益流水记录"
              : "管理员抽成一级代理流水记录"
          }}
        </a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <div v-show="record.outTradeNo">
          <a @click="showInfoModal(record)">查看订单</a>
        </div>
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
    scopedSlots: { customRender: "outTradeNo" },
  },
  {
    title: "描述",
    dataIndex: "contentLog",
    align: "center",
    scopedSlots: { customRender: "contentLog" },
  },
  {
    title: "类型",
    key: "analysisstatus",
    dataIndex: "analysisstatus",
    align: "center",
    scopedSlots: { customRender: "analysisstatus" },
    filters: [
      { text: "押金记录", value: "1" },
      { text: "收益记录", value: "2" },
      { text: "提现记录", value: "3" },
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
    width: 200,
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
      pagination: {},
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
    async fetch(params = {}) {
      this.loading = true;
      let user = this.$db.get("USER");
      let result = await this.$get("/wechatcustomerByBossmobilenumber", {
        wechatcustomerByBossmobilenumber: user.username,
      });
      if (result.data.data) {
        let res = await this.$get("/aidDataAnalysis/listByOpenid", {
          openid: result.data.data.openid,
          ...params,
        });
        let pagination = { ...this.pagination };

        pagination.total = res.data.data.total;
        this.dataSource = res.data.data.rows;
        this.pagination = pagination;
      }

      this.loading = false;
    },
    // 查看订单详细
    showInfoModal(record) {
      this.outTradeNo = 0;
      // console.log("初始化：",this.outTradeNo);
      // console.log('订单编号为：',record.outTradeNo);
      this.outTradeNo = record.outTradeNo;
      // console.log("赋值：",this.outTradeNo);
      this.assistInfoShow = true;
    },
    // 关闭订单详细
    onClose() {
      this.assistInfoShow = false;
    },
  },
};
</script>
