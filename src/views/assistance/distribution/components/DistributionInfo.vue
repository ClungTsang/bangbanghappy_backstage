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
        <!-- <template slot="spendpercent" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChange(record.key, 'spendpercent', $event)"
          />
        </template> -->
        <span slot="storestatus" slot-scope="text, record">
          <a-select
            default-value="不营业"
            style="width: 100px"
            @change="onChange"
          >
            <a-select-option value="不营业"> 不营业 </a-select-option>
            <a-select-option value="开店"> 开店 </a-select-option>
            <a-select-option value="休店"> 休店 </a-select-option>
            <a-select-option value="关店"> 关店 </a-select-option>
            <a-select-option value="异常"> 异常 </a-select-option>
          </a-select>
        </span>
        <span slot="showInfo"><a @click="showInfoModal(record.key)">查看该门店</a></span>
      </a-table>

  </div>
</template>
<script>
const columns = [
  // {
  //   title: "门店编号",
  //   dataIndex: "id",
  //   width: 100,
  //   align: "center",
  // },
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
    // scopedSlots: { customRender: "spendpercent" },
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
import EditableCell from "../../../../components/editablecell/EditableCell";
export default {
  data() {
    return {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      pagination: {},
      loading: false,
    };
  },
  components: { EditableCell },
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
    // 改变选择列属性
    // onCellChange(key, dataIndex, value) {
    //   console.log(key);
    //   const dataSource = [...this.dataSource];
    //   const target = dataSource.find((item) => item.key === key);
    //   console.log(target);

    //   if (target) {
    //     target[dataIndex] = value;
    //     this.dataSource = dataSource;
    //   }
    // },
    // 切换店铺状态
    onChange(value) {
      //用record.key来确定门店id，从而改变门店的店铺状态
      this.$message.success(`切换门店状态成为${value}成功`);
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
        // 遍历数组
        let dataSourceList = res.data.data.rows;
        dataSourceList.forEach((item) => {
          this.dataSource.push({
            key: item.id,
            companyname: item.companyname,
            address: item.address,
            storeowner: item.storeowner,
            bossmobilenumber: item.bossmobilenumber,
            storephone: item.storephone,
            spendpercent: item.spendpercent,
            // storestatus: item.storestatus,
          });
        });
        this.pagination = pagination;
      });
    },
    // TODO: 弹框显示该门户的详细信息 参照二级代理的 门店管理 模块
    showInfoModal() {},
  },
};
</script>
<style>
</style>
