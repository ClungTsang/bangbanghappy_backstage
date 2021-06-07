<template>
  <div>
    <a-table
      :columns="columns"
      :dataSource="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
      <span slot="storestatus" slot-scope="text, record">
        <a-select
          :default-value="
            text == 0
              ? '不营业'
              : text == 1
              ? '关店'
              : text == 2
              ? '休店'
              : text == 3
              ? '开店'
              : '异常'"
          style="width: 100px"
          @change="
            (e) => {
              changeStatus(e, record);
            }
          "
        >
          <a-select-option value="0"> 不营业 </a-select-option>
          <a-select-option value="1"> 关店 </a-select-option>
          <a-select-option value="2"> 休店 </a-select-option>
          <a-select-option value="3"> 开店 </a-select-option>
          <a-select-option value="4"> 异常 </a-select-option>
        </a-select>
      </span>
      <span slot="showInfo" slot-scope="text, record"
        ><a @click="showInfoModal(record)">查看该门店</a></span
      >
    </a-table>

    <distribution-store-info
      :infoVisible="storeInfoVisible"
      :id="id"
      @close="onClose"
    ></distribution-store-info>
  </div>
</template>
<script>
const columns = [
  {
    title: "门店编号",
    dataIndex: "id",
    width: 100,
    align: "center",
  },
  {
    title: "门点名称",
    dataIndex: "companyname",
    width: 200,
    ellipsis: true,
    align: "center",
  },
  {
    title: "门店地址",
    dataIndex: "address",
    width: 300,
    // 宽度自动省略
    ellipsis: true,
    align: "center",
  },
  {
    title: "联系人",
    dataIndex: "storeowner",
    width: 150,
    align: "center",
  },
  {
    title: "老板电话",
    dataIndex: "bossmobilenumber",
    width: 150,
    align: "center",
  },
  {
    title: "门店电话",
    dataIndex: "storephone",
    width: 150,
    align: "center",
  },
  {
    title: "抽成比例",
    dataIndex: "spendpercent",
    align: "center",
  },
  {
    title: "门店状态",
    dataIndex: "storestatus",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "storestatus" },
  },
  {
    title: "操作",
    dataIndex: "showInfo",
    align: "center",
    scopedSlots: { customRender: "showInfo" },
    fixed: "right",
  },
];
import event from "@/utils/event.js";
import EditableCell from "../../../../../components/editablecell/EditableCell";
import DistributionStoreInfo from "./DistributionStoreInfo.vue";
export default {
  components: { EditableCell, DistributionStoreInfo },

  data() {
    return {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      pagination: {},
      loading: false,
      storeInfoVisible: false,
      id: null,
    };
  },
  computed: {
    hasSelected() {
      return this.selectedRowKeys.length > 0;
    },
  },
  mounted() {
    this.fetch();
    // 被告知已经修改抽成完成
    event.$on("cleanSelectedRow", () => {
      this.selectedRowKeys = [];
    });
  },
  methods: {
    // 选择列
    onSelectChange(selectedRowKeys) {
      // console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
      event.$emit("selectedRowKeys", this.selectedRowKeys);
    },
    // 切换店铺状态
    changeStatus(e, record) {
      console.log(e, record);
      const params = { storestatus: e, id: record.id };
      this.$put("/business/LantianStore", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
      //用record.key来确定门店id，从而改变门店的店铺状态
    },
    onStatusChange(key) {
      console.log(`修改的门店key值为${key}`);
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      console.log(pagination);
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      let token = this.$db.get("USER_TOKEN");
      let user = this.$db.get("USER");
      // 超管和一级代理具备全查
      this.$get("/business/LantianStore/MapAll", {
        // TODO:根据不同的角色请求旗下门店
        // this.$get(`/business/LantianStore/${user.username}`, {
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
    showInfoModal(record) {
      this.storeInfoVisible = true;
      // console.log(record);
      this.id = record.id;
    },
    // 关闭门店信息
    onClose() {
      this.storeInfoVisible = false;
    },
  },
};
</script>
<style>
</style>
