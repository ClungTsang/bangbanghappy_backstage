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
        onChange: onSelectChange
      }"
    >
      <span slot="storestatus" slot-scope="text, record">
        {{
          text == 0
            ? "不营业"
            : text == 1
            ? "关店"
            : text == 2
            ? "休店"
            : text == 3
            ? "开店"
            : "异常"
        }}
      </span>
      <span slot="showInfo" slot-scope="text, record">
        <a @click="showInfoModal(record)">查看</a>
        <a-divider type="vertical" />
        <a @click="changeMallModal(record)">修改</a>
        <a-divider type="vertical" />
        <a style="color:red" @click="deleteMall(record)">删除</a>
      </span>
    </a-table>

    <!-- 门店信息 -->
    <distribution-store-info
      :infoVisible="storeInfoVisible"
      :id="id"
      @close="onClose"
    ></distribution-store-info>
    <!-- 创建门店 -->
    <distribution-add
      :addVisible="changeVisible"
      @close="onClose"
      :id="changeTarget"
    ></distribution-add>
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
    fixed: "left"
  },
  {
    title: "门店地址",
    dataIndex: "address",
    width: 300,
    ellipsis: true,
    align: "center"
  },
  {
    title: "联系人",
    dataIndex: "storeowner",
    width: 150,
    align: "center"
  },
  {
    title: "老板电话",
    dataIndex: "bossmobilenumber",
    width: 150,
    align: "center"
  },
  {
    title: "门店电话",
    dataIndex: "storephone",
    width: 150,
    align: "center"
  },
  {
    title: "抽成比例",
    dataIndex: "spendpercent",
    align: "center"
  },
  {
    title: "门店状态",
    dataIndex: "storestatus",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "storestatus" }
  },
  {
    title: "操作",
    dataIndex: "showInfo",
    align: "center",
    scopedSlots: { customRender: "showInfo" },
    fixed: "right"
  }
];
import event from "@/utils/event.js";
import EditableCell from "@/components/editablecell/EditableCell.vue";
import DistributionStoreInfo from "./DistributionStoreInfo.vue";
import DistributionAdd from "./DistributionAdd.vue";
export default {
  components: { EditableCell, DistributionStoreInfo, DistributionAdd },
  data() {
    return {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      loading: false,
      id: null,
      changeTarget: 0,
      storeInfoVisible: false,
      changeVisible: false,
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    };
  },
  created() {
    this.fetch();
  },
  mounted() {
    // 被告知已经修改抽成完成
    event.$on("cleanSelectedRow", () => {
      this.fetch();
    });
    // 被告知需要刷新页面
    event.$on("mallChangeDone", () => {
      this.fetch();
    });
    this.$bus.$on("addMallDonw", () => {
      this.fetch();
    });
  },
  methods: {
    // 选择的列
    onSelectChange(selectedRowKeys, selectedRows) {
      event.$emit("selectedRows", selectedRows);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 切换店铺状态
    changeStatus(e, record) {
      const params = { storestatus: e, id: record.id };
      this.$put("/business/LantianStore", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      let token = this.$db.get("USER_TOKEN");
      let user = this.$db.get("USER");
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        //根据不同的角色请求旗下门店
        this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
          result => {
            if (result.data.data && result.data.code == 200) {
              return this.$get("/business/LantianStore/MapAllByStoreid", {
                Authentication: token,
                pageSize: 10,
                Parentid: result.data.data.id,
                ...params
              }).then(res => {
                if (res.data.data) {
                  let pagination = { ...this.pagination };
                  pagination.total = res.data.data.total;
                  this.dataSource = res.data.data.rows;
                  this.pagination = pagination;
                }
              });
            }
          }
        );
      } else {
        this.$get("/business/LantianStore/MapAll", {
          Authentication: token,
          pageSize: 10,
          ...params
        }).then(res => {
          let pagination = { ...this.pagination };
          pagination.total = res.data.data.total;
          this.dataSource = res.data.data.rows;
          this.pagination = pagination;
        });
      }
      this.selectedRowKeys = [];
      this.loading = false;
    },
    // 查看门店信息
    showInfoModal(record) {
      this.storeInfoVisible = true;
      this.id = record.id;
    },
    // 关闭门店信息
    onClose() {
      this.storeInfoVisible = false;
      this.changeVisible = false;
    },
    // 修改门店信息
    changeMallModal(record) {
      this.changeTarget = record.id;
      this.changeVisible = true;
    },
    // 删除门店
    deleteMall(record) {
      this.dataSource = this.dataSource.filter(item => item.id !== record.id);
      this.$delete(`/business/LantianStore/${record.id}`);
      this.$message.success("删除成功");
    }
  }
};
</script>
<style></style>
