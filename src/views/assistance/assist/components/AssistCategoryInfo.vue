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
          default-value="待援助"
          style="width: 100px"
          @change="onChange"
        >
          <a-select-option value="待援助">待援助</a-select-option>
          <a-select-option value="援助中">援助中</a-select-option>
          <a-select-option value="已完成">已完成</a-select-option>
          <a-select-option value="处理中">处理中</a-select-option>
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
          <a @click="onDeleteAssistModal(record)">删除订单</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="onCheckAssistModal(record)">查看详细</a>
      </span>
    </a-table>

    <assist-info
      :showVisible="assistInfoVisible"
      @close="onCloseAssistShowModal"
      @cancel="onCancelAssistShowModal"
      :data="showData"
    ></assist-info>
  </div>
</template>
<script>
const dataSource = [
  // {
  //   orderid: "fc5efyev5656cs7aisd",
  //   clientname: "罗冠聪",
  //   clientphone: 13527889432,
  //   createtime: "2021年4月20日 16:29:12",
  //   tradetime: "2021年4月21日 16:30:12",
  //   status: 0,
  //   cost:20,
  //   assistprice:100,
  //   assistinfo: "想要喝水，请尽快送达到到我宿舍",
  //   notice: "尽快送达",
  // },
  // {
  //   orderid: "awq23dx34xqxxtaisd",
  //   clientname: "许冠杰",
  //   clientphone: 16602027350,
  //   createtime: "2021年5月20日 16:29:12",
  //   tradetime: "2021年5月31日 16:30:12",
  //   status: 1,
  //   cost:2,
  //   assistprice:20,
  //   assistor: "刘家俊",
  //   assistorPhone: 16234123731,
  //   assistinfo: "想要喝水，请尽快送达到到我宿舍",

  //   notice: "尽快送达",
  // },
  {
    orderid: "c357976rv25345isd",
    clientname: "张学友",
    clientphone: 18680271761,
    createtime: "2021年5月25日 16:29:12",
    tradetime: "2021年5月30日 16:30:12",
    status: 2,
    cost:20,
    assistprice:12,
    assistor: "刘家俊",
    assistorPhone: 16602027351,
    assistinfo: "想要喝水，请尽快送达到到我宿舍",
    notice: "尽快送达",
  },
];
const columns = [
  {
    title: "订单编号",
    dataIndex: "orderid",
    width: 100,
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
    width: 100,
    dataIndex: "clientphone",
    align: "center",
  },
  {
    title: "订单创建时间",
    width: 100,
    dataIndex: "createtime",
    align: "center",
  },
  {
    title: "预计完成时间",
    width: 100,
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
    width: 100,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
import AssistInfo from "./AssistInfo";
import event from "../../../../utils/event";
export default {
  components: { AssistInfo },
  data() {
    return {
      columns,
      dataSource,
      selectedRowKeys: [],
      loading: false,
      show: false,
      storeId: 0,
      assistInfoVisible: false,
      showData: {},
    };
  },
  mounted() {
    // 接受下拉框的分类storeid
    event.$on("transferAssist", (res) => {
      // console.log(`接收到下拉选项老哥传来的`, res);
      console.log(res);
      // this.storeId = res.storeId;
      // 网络查询
      // let result = await this.getAssistCategoryList(res);
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
    getAssistCategoryList(res) {
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
    onCheckAssistModal(record) {
      this.showData = record;
      this.assistInfoVisible = true;
      // console.log(record);
    },
    // 删除订单
    onDeleteAssistModal() {},
    onCloseAssistShowModal() {
      this.assistInfoVisible = false;
      console.log("closeMenu");
    },
    onCancelAssistShowModal() {
      this.assistInfoVisible = false;
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
