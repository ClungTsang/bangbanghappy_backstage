<template>
  <div>
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      :loading="loading"
    >
      <!-- 图片预览 -->
      <span slot="dishurl" slot-scope="text, record">
        <img
          style="width: 200px; heigth: auto"
          :src="JSON.parse(record.dishurl)"
        />
      </span>
      <!-- 显示控制 -->
      <span slot="dishstatus" slot-scope="text, record">
        <a-switch
          v-model="record.dishstatus == 1 ? true : false"
          :loading="switchLoading"
          @change="
            checked => {
              onSwitch(checked, record);
            }
          "
        >
          <a-icon slot="checkedChildren" type="check" />
          <a-icon slot="unCheckedChildren" type="close" />
        </a-switch>
      </span>
      <span slot="dishprice" slot-scope="text, record">{{ text }}元</span>
      <span slot="memberprice" slot-scope="text, record">{{ text }}元</span>
      <span slot="purchaselimit" slot-scope="text, record">{{ text }}个</span>
      <!-- 操作控制 -->
      <span slot="action" slot-scope="text, record">
        <a @click="onOpenMenuChangeModal(record)">修改</a>
        <a-divider type="vertical" />
        <a @click="onOpenMenushowModal(record)">查看</a>
        <a-divider type="vertical" />
        <a-popconfirm
          title="确定删除该菜品"
          ok-text="确定"
          cancel-text="取消"
          @confirm="onDeleteMenuDish(record)"
        >
          <a>删除</a>
        </a-popconfirm>
        <a-divider type="vertical" />
        <a @click="onCopyMenuModal(record)">复制</a>
      </span>
    </a-table>
    <!-- 修改菜品modal -->
    <menu-dish-change
      :changeVisible="menuChangeVisible"
      @close="onCloseMenuChangeModal"
      @cancel="onCancelMenuChangeModal"
      :data="showData"
    ></menu-dish-change>
    <!-- 菜品展示modal -->
    <menu-dish-info
      :showVisible="menuShowVisible"
      @close="onCloseMenuShowModal"
      @cancel="onCancelMenuShowModal"
      :data="showData"
    ></menu-dish-info>
    <!-- 复制菜品信息 -->
    <menu-dish-copy
      :copyVisible="menuCopyVisible"
      @close="onCloseCopyMenuModal"
      @cancel="onCancelCopyMenuModal"
      :data="showData"
    ></menu-dish-copy>
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
    scopedSlots: { customRender: "dishurl" }
  },
  {
    title: "商品名称",
    dataIndex: "dishname",
    width: 100,
    ellipsis: true,
    align: "center"
  },
  {
    title: "商品价格",
    width: 50,
    dataIndex: "dishprice",
    align: "center",
    scopedSlots: { customRender: "dishprice" }
  },

  {
    title: "会员价格",
    width: 50,
    dataIndex: "memberprice",
    align: "center",
    scopedSlots: { customRender: "memberprice" }
  },
  {
    title: "限购数量",
    width: 50,
    dataIndex: "purchaselimit",
    align: "center",
    scopedSlots: { customRender: "purchaselimit" }
  },
  {
    title: "商品介绍",
    width: 150,
    dataIndex: "description",
    align: "center",
    ellipsis: true
  },
  {
    title: "是否显示",
    width: 50,
    dataIndex: "dishstatus",
    align: "center",
    scopedSlots: { customRender: "dishstatus" }
  },
  {
    title: "操作",
    width: 150,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];
import { mapState } from "vuex";
import MenuDishChange from "./MenuDishChange.vue";
import MenuDishInfo from "./MenuDishInfo.vue";
import MenuDishCopy from "./MenuDishCopy.vue";
import event from "@/utils/event";
export default {
  components: { MenuDishChange, MenuDishInfo, MenuDishCopy },
  data() {
    return {
      columns,
      dataSource: [],
      selectedRowKeys: [],
      loading: false,
      switchLoading: false,
      show: false,
      // storeid: 0,
      // 菜品信息展示控制
      menuShowVisible: false,
      // 修改菜品控制
      menuChangeVisible: false,
      // 复制菜品控制
      menuCopyVisible: false,
      showData: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.account.userInfo
    })
  },
  created() {
    event.$on("addUserInfoDone", () => {
      this.showAllCategoryList();
    });
  },
  mounted() {
    // 接受下拉框的分类storeid
    event.$on("transferCategory", async res => {
      console.log(`接收到下拉选项老哥传来的`, res);
      // 网络查询
      let result = await this.getMenuCategoryList(res.storeid);
      // 显示全部
      if (res.dishclassificationname == "显示全部") {
        this.showAllCategoryList();
        return;
      }
      // 渲染分类数据
      if (result.data.data[res.dishclassificationname] !== "空") {
        this.dataSource = result.data.data[res.dishclassificationname];
      } else {
        this.dataSource = [];
      }
      this.loading = false;
    });
  },
  methods: {
    // 网络获取分类信息
    getMenuCategoryList(storeid) {
      const params = {
        storeid: storeid
      };
      // 根据storeid全查菜品分类
      return new Promise((resolve, reject) => {
        this.$get(`/backend/business/LantianDishmanagement/MapAllByStoreId`, {
          ...params
        }).then(res => {
          if (!res.data.data) {
            reject("无菜品数据");
          } else {
            resolve(res);
          }
        });
      });
    },
    // 显示全部
    async showAllCategoryList() {
      const res = await this.getMenuCategoryList(this.userInfo.id);
      if (res) {
        let keys = Object.keys(res.data.data);
        let items = res.data.data;
        // 存放对象
        let itemsList = [];
        // 遍历键
        keys.forEach(key => {
          // 如果该键的值为空，则删除该属性 并挑出该循环
          if (items[key] == "空") {
            delete items[key];
            return;
          }
          // 遍历该键中 值是数组的对象 并压入栈中
          items[key].forEach(item => {
            itemsList.push(item);
          });
        });
        this.dataSource = itemsList;
      }
      // 获取对象中的key数组
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
      const params = {
        id: record.id,
        dishstatus: checked ? 1 : 0
      };
      // console.log(params);
      this.$put("/backend/business/LantianDishmanagement", { ...params }).then(
        () => {
          _this.dataSource.forEach(item => {
            if (item.id === record.id) {
              item.dishstatus = checked ? 1 : 0;
            }
          });
          this.switchLoading = false;
          this.$message.success("修改成功");
        },
        () => {
          this.$message.error("修改失败");
        }
      );
    },

    // 控制删除菜品
    onDeleteMenuDish(record) {
      this.$delete(`/backend/business/LantianDishmanagement/${record.id}`).then(
        res => {
          if (res.data.code == 200) {
            this.$message.success(`删除${record.dishname}成功`);
            let item = this.dataSource.filter(item => {
              return item.id != record.id;
            });
            this.dataSource = item;
          } else {
            this.$message.success(`删除删除`);
          }
        }
      );
    },
    // 控制修改菜品
    onOpenMenuChangeModal(record) {
      this.showData = record;
      this.menuChangeVisible = true;
    },
    async onCloseMenuChangeModal() {
      // console.log(payload);
      // console.log(this.showData.dishclassificationid);
      // 网络查询
      // let result = await this.getMenuCategoryList(payload.storeid);
      // 渲染分类数据
      // this.dataSource = [];
      // if (result.data.data[payload.dishclassificationname] !== "空") {
      //   this.dataSource = result.data.data[payload.dishclassificationname];
      // }
      this.loading = false;
      this.menuChangeVisible = false;
      // const dataSource = [...this.dataSource];
      // dataSource.filter((item) => {
      //   item.id != record.id;
      // });
      // this.dataSource = dataSource;
    },
    onCancelMenuChangeModal() {
      this.menuChangeVisible = false;
    },
    // 控制查看菜品
    onOpenMenushowModal(record) {
      this.showData = record;
      this.menuShowVisible = true;
    },
    onCloseMenuShowModal() {
      this.menuShowVisible = false;
      // console.log("closeMenu");
    },
    onCancelMenuShowModal() {
      this.menuShowVisible = false;
    },
    // 控制复制菜品
    onCopyMenuModal(record) {
      this.showData = record;
      this.menuCopyVisible = true;
    },
    onCloseCopyMenuModal() {
      this.menuCopyVisible = false;
    },
    onCancelCopyMenuModal() {
      this.menuCopyVisible = false;
    }
  }
};
</script>
<style></style>
