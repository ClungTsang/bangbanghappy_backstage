<template>
  <div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :loading="loading"
    >
      <!-- 订单状态变更 -->
      <span slot="status" slot-scope="text, record">
        <a-select
          default-value="未付款"
          style="width: 100px"
          @change="onChange"
        >
          <a-select-option value="未付款">未付款</a-select-option>
          <a-select-option value="已付款">已付款</a-select-option>
          <a-select-option value="配送中">配送中</a-select-option>
          <a-select-option value="已送达">已送达</a-select-option>
          <a-select-option value="待处理">待处理</a-select-option>
          <a-select-option value="已关闭">已关闭</a-select-option>
        </a-select>
      </span>
      <!-- 操作控制 -->
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该订单"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete"
          @cancel="cancel"
        >
          <a @click="onDeleteOrderModal(record)">删除订单</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="onCheckOrderModal(record)">查看详细</a>
      </span>
    </a-table>

    <order-info
      :showVisible="orderInfoVisible"
      @close="onCloseOrderShowModal"
      @cancel="onCancelOrderShowModal"
      :data="showData"
    ></order-info>
  </div>
</template>
<script>
const dataSource = [
  {
    orderid: "jh12g3jhgh1qq8s7aisd",
    clientname: "小王",
    clientphone: 18680271771,
    createtime: "2021年5月20日 16:29:12",
    tradetime: "2021年5月20日 16:30:12",
    status: 1,
    notice: "尽快送达",
  },
];
const columns = [
  {
    title: "订单编号",
    dataIndex: "orderid",
    width: 200,
    align: "center",
  },
  {
    title: "客户名字",
    width: 100,
    dataIndex: "clientname",
    align: "center",
  },
  {
    title: "客户电话",
    width: 130,
    dataIndex: "clientphone",
    align: "center",
  },
  {
    title: "订单创建时间",
    width: 250,
    dataIndex: "createtime",
    align: "center",
  },
  {
    title: "交易时间",
    width: 250,
    dataIndex: "tradetime",
    align: "center",
  },
  {
    title: "状态更改",
    width: 100,
    dataIndex: "status",
    align: "center",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
import OrderInfo from "./OrderInfo";
import event from "@/utils/event";
export default {
  components: { OrderInfo },
  data() {
    return {
      columns,
      dataSource,
      selectedRowKeys: [],
      loading: false,
      show: false,
      storeId: 0,
      orderInfoVisible: false,
      showData: {},
    };
  },
  mounted() {
    // 接受下拉框的分类storeid
    event.$on("transferOrder", (res) => {
      // console.log(`接收到下拉选项老哥传来的`, res);
      console.log(res);
      // this.storeId = res.storeId;
      // 网络查询
      // let result = await this.getMenuCategoryList(res);
      // // 渲染数据
      // if (result.data.data[res.category] !== "空") {
      //   this.dataSource = result.data.data[res.category];
      // } else {
      //   this.dataSource = [];
      // }
      this.loading = false;
    });
  },
  methods: {
    // 网络获取分类信息
    getMenuCategoryList(res) {
      this.loading = true;
      const params = {
        // 小程序传1
        // LantianDishmanagementstatus: 0,
        storeid: res.storeId,
      };
      // 根据storeid全查菜品分类
      return this.$get(
        `/backend/business/LantianDishmanagement/MapAllByStoreId`,
        {
          ...params,
        }
      );
    },
    // 选择列
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },

    // 获取更换状态和更换对象
    onSwitch(checked, record) {
      const _this = this;
      // console.log(this.dataSource);
      const params = {
        id: record.id,
        // storeid: this.storeId,
        dishstatus: checked ? 1 : 0,
      };
      this.$put("/backend/business/LantianDishmanagement", { ...params }).then(
        () => {
          _this.dataSource.forEach((item) => {
            if (item.id === record.id) {
              item.dishstatus = checked ? 1 : 0;
              // debugger;
            }
          });
          this.$message.success("修改成功");
        },
        () => {
          this.$message.error("修改失败");
        }
      );
      console.log(this.dataSource);
    },
    // 控制查看订单
    onCheckOrderModal(record) {
      this.showData = record;
      this.orderInfoVisible = true;
      // console.log(record);
    },
    // 删除订单
    onDeleteOrderModal() {},
    onCloseOrderShowModal() {
      this.orderInfoVisible = false;
      console.log("closeMenu");
    },
    onCancelOrderShowModal() {
      this.orderInfoVisible = false;
    },
    // 切换订单状态
    onChange(value) {
      // TODO:用record.key来确定门店id，从而改变门店的店铺状态
      this.$message.success(`切换订单状态为${value}成功`);
    },
    confirmDelete() {
      this.$message.success("删除订单成功");
      this.dataSource = [];
    },
  },
};
</script>
<style>
</style>
