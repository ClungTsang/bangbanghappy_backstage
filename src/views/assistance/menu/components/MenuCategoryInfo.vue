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
      <!-- 图片预览 -->
      <span slot="dishurl" slot-scope="text, record">
        <img style="width: 200px; heigth: auto" :src="JSON.parse(record.dishurl)" />
      </span>
      <!-- 显示控制 -->
      <span slot="dishstatus" slot-scope="text, record">
        <a-switch
          v-model="record.dishstatus == 1 ? true : false"
          :loading="switchLoading"
          @change="
            (checked) => {
              onSwitch(checked, record);
            }
          "
        >
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </span>
      <!-- 操作控制 -->
      <span slot="action" slot-scope="text, record">
        <a @click="onOpenMenuChangeModal(record)">修改</a>
        <a-divider type="vertical" />
        <a @click="onOpenMenushowModal(record)">查看</a>
      </span>
    </a-table>
    <menu-dish-change
      :changeVisible="menuChangeVisible"
      @close="onCloseMenuChangeModal"
      @cancel="onCancelMenuChangeModal"
      :data="showData"
    ></menu-dish-change>
    <menu-dish-info
      :showVisible="menuShowVisible"
      @close="onCloseMenuShowModal"
      @cancel="onCancelMenuShowModal"
      :data="showData"
    ></menu-dish-info>
  </div>
</template>
<script>
const columns = [
  // {
  //   title: "顺序",
  //   dataIndex: "rank",
  //   width: 100,
  //   align: "center",
  // },
  {
    title: "商品照片",
    dataIndex: "dishurl",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "dishurl" },
  },
  {
    title: "商品名称",
    dataIndex: "dishname",
    width: 100,
    align: "center",
  },
  // {
  //   title: "是否显示",
  //   width: 100,
  //   dataIndex: "visible",
  //   align: "center",
  // },
  {
    title: "商品价格",
    width: 100,
    dataIndex: "dishprice",
    align: "center",
  },
  // {
  //   title: "活动价格",
  //   width: 100,
  //   dataIndex: "activityprice",
  //   align: "center",
  // },
  // {
  //   title: "会员价格",
  //   width: 100,
  //   dataIndex: "memberprice",
  //   align: "center",
  // },
  {
    title: "商品介绍",
    width: 100,
    dataIndex: "description",
    align: "center",
  },
  {
    title: "是否显示",
    width: 100,
    dataIndex: "dishstatus",
    align: "center",
    scopedSlots: { customRender: "dishstatus" },
  },
  {
    title: "操作",
    width: 100,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
import MenuDishChange from "./MenuDishChange";
import MenuDishInfo from "./MenuDishInfo";
import event from "../../../../utils/event";
export default {
  components: { MenuDishChange, MenuDishInfo },
  data() {
    return {
      columns,
      dataSource: [],
      selectedRowKeys: [],
      loading: false,
      switchLoading: false,
      show: false,
      storeId: 0,
      menuShowVisible: false,
      menuChangeVisible: false,
      showData: {},
    };
  },
  mounted() {
    // 接受下拉框的分类storeid
    event.$on("transferCategory", async (res) => {
      // console.log(`接收到下拉选项老哥传来的`, res);
      this.storeId = res.storeId;
      // 网络查询
      let result = await this.getMenuCategoryList(res);
      // 渲染数据
      if (result.data.data[res.category] !== "空") {
        this.dataSource = result.data.data[res.category];
      } else {
        this.dataSource = [];
      }
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
      this.switchLoading = true;
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
          this.switchLoading = false;
          this.$message.success("修改成功");
        },
        () => {
          this.$message.error("修改失败");
        }
      );
      console.log(this.dataSource);
    },
    // 控制修改菜品
    onOpenMenuChangeModal(record) {
      this.menuChangeVisible = true;
      this.showData = record;
    },
    onCloseMenuChangeModal() {
      this.menuChangeVisible = false;
    },
    onCancelMenuChangeModal() {
      this.menuChangeVisible = false;
    },
    // 控制查看菜品
    onOpenMenushowModal(record) {
      this.showData = record;

      this.menuShowVisible = true;
      // console.log(record);
    },
    onCloseMenuShowModal() {
      this.menuShowVisible = false;
      console.log("closeMenu");
    },
    onCancelMenuShowModal() {
      this.menuShowVisible = false;
    },
  },
};
</script>
<style>
</style>
