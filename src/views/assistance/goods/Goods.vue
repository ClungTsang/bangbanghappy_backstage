<template>
  <a-card :bordered="false">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form>
        <a-row>
          <div :class="advanced ? null : 'fold'">
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="商品名称"
                  v-model="queryParams.dishname"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-space>
                <a-button type="primary" @click="addGoods">新增商品</a-button>
                <a-select
                  v-model="categoryValue"
                  @change="chooseCategory"
                  style="width: 150px"
                >
                  <a-select-option
                    v-for="(item, index) in categoryList"
                    :key="index"
                    :value="item.value"
                    >{{ item.title }}</a-select-option
                  >
                </a-select>
                <!-- <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 3px" @click="reset"
                  >重置</a-button
                > -->
                <!-- <a-button type="dashed" @click="showCouponModal"
                  >查看当前提货表信息</a-button
                > -->
                <!-- <a-button type="danger" @click="freightVisible = true"
                  >修改全局运费</a-button
                > -->
                <!-- <a-dropdown>
                  <a-menu slot="overlay">
                    <a-menu-item key="export-data" @click="exportExcel">导出Excel</a-menu-item>
                  </a-menu>
                  <a-button>
                    更多操作
                    <a-icon type="down" />
                  </a-button>
                </a-dropdown> -->
                <!-- <a @click="toggleAdvanced">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a> -->
              </a-space>
            </a-col>
          </div>
        </a-row>
        <!-- <a-row>
          <template v-if="advanced">
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="handleIsattributesChange"
                  ref="isattributesTree"
                  :treePlaceholder="'属性'"
                  :treeData="isattributesTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="handleIsnewChange"
                  ref="isnewTree"
                  :treePlaceholder="'新品'"
                  :treeData="isnewTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="handleIsRecomendChange"
                  ref="isrecommendTree"
                  :treePlaceholder="'推荐'"
                  :treeData="isrecommendTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="handleIsShelvesChange"
                  ref="isshelvesTree"
                  :treePlaceholder="'上架'"
                  :treeData="isshelvesTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="handlePresellChange"
                  ref="presellTree"
                  :treePlaceholder="'预售'"
                  :treeData="presellTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
          </template>
        </a-row> -->
      </a-form>
    </div>
    <div>
      <a-table
        ref="TableInfo"
        :rowKey="record => record.id"
        :columns="columns"
        :data-source="currentDataSource"
        :pagination="pagination"
        :loading="loading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        @change="handleTableChange"
      >
        <!-- 商品图片 -->
        <span slot="dishurl" slot-scope="text, record">
          <img style="width: 200px; heigth: auto" :src="$restoreUrl(text)" />
        </span>
        <!-- 属性 -->
        <!-- <span slot="isattributes" slot-scope="text, record">
          <a-button
            type="primary"
            ghost
            icon="align-left"
            @click="
              () => {
                targetAttributesId = record.id;
                attributesVisible = true;
              }
            "
          />
        </span> -->
        <!-- 提货表 -->
        <!-- <span slot="coupon" slot-scope="text, record">
          <a-button
            type="primary"
            shape="circle"
            icon="credit-card"
            @click="
              () => {
                targetCouponId = record.id
                couponVisible = true
              }
            "
          />
        </span> -->
        <!-- 快捷调整 -->
        <span slot="dishstatus" slot-scope="text, record">
          <span>
            <a-switch
              v-model="record.dishstatus == 1 ? true : false"
              :loading="switchLoading"
              @change="
                checked => {
                  onChangeTags(checked, record, 1);
                }
              "
            />
          </span>
          <!-- <br />
          <br /> -->
          <!-- <span>
            新品：
            <a-switch
              v-model="record.isnew == 1 ? true : false"
              :loading="switchLoading"
              @change="
                checked => {
                  onChangeTags(checked, record, 2);
                }
              "
            />
          </span>
          <br />
          <br /> -->
          <!-- <span>
            推荐：
            <a-switch
              v-model="record.isrecommend == 1 ? true : false"
              :loading="switchLoading"
              @change="
                checked => {
                  onChangeTags(checked, record, 3);
                }
              "
            />
          </span>
          <br />
          <br /> -->
          <!-- <span>
            预售：
            <a-switch
              v-model="record.presell == 1 ? true : false"
              :loading="switchLoading"
              @change="
                checked => {
                  onChangeTags(checked, record, 4);
                }
              "
            />
          </span> -->
        </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <!-- <a-button type="primary" @click="addCoupon(record)"
            >加入提货表</a-button
          >
          <br />
          <br /> -->
          <a-button type="primary" ghost @click="changeGoods(record)"
            >编辑</a-button
          >
          <br />
          <br />

          <!-- <a-button type="dashed" @click="changeGoods(record)">查看</a-button> -->
          <a-popconfirm title="确认删除该商品" @confirm="deleteGood(record)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- 提货表编辑与查看 -->
    <!-- <gift-coupon-info-modal :couponVisible="couponVisible" :targetCouponId="targetCouponId" @close="() => (couponVisible = false)"></gift-coupon-info-modal> -->
    <!-- 商品属性编辑与查看 -->
    <goods-attribute-modal
      :attributesVisible="attributesVisible"
      :targetAttributesId="targetAttributesId"
      @close="
        () => {
          attributesVisible = false;
          fetch();
        }
      "
    ></goods-attribute-modal>
    <!-- 选择商品属性 -->
    <!-- <a-modal :visible="attributesAddToCouponVisible" title="选择商品属性"> -->
    <!-- <goods-coupon-info-modal
      :couponVisible="couponVisible"
      @close="() => (couponVisible = false)"
    ></goods-coupon-info-modal> -->
    <!-- 全局运费设置 -->
    <!-- <global-freight-modal
      :freightVisible="freightVisible"
      @close="freightVisible = false"
    ></global-freight-modal> -->
  </a-card>
</template>
<script>
const labelCol = {
  xl: { span: 5 },
  xs: { span: 24 },
  sm: { span: 5 }
};
const wrapperCol = {
  xl: { span: 19 },
  xs: { span: 24 },
  sm: { span: 12 }
};
const isattributesTree = [
  { title: "无属性", value: 0 },
  { title: "有属性", value: 1 }
];
const isnewTree = [
  { title: "非新品", value: 0 },
  { title: "新品", value: 1 }
];
const isrecommendTree = [
  { title: "不推荐", value: 0 },
  { title: "推荐", value: 1 }
];
const isshelvesTree = [
  { title: "不上架", value: 0 },
  { title: "上架", value: 1 }
];
const presellTree = [
  { title: "非预售", value: 0 },
  { title: "预售", value: 1 }
];
const columns = [
  // {
  //   title: "id",
  //   dataIndex: "id",
  //   width: 40,
  //   align: "center",
  //   ellipsis: true
  // },
  {
    title: "商品图片",
    width: 200,
    dataIndex: "dishurl",
    align: "center",
    scopedSlots: { customRender: "dishurl" }
  },
  {
    title: "商品名称",
    width: 100,
    dataIndex: "dishname",
    align: "center"
  },
  {
    title: "简介",
    width: 200,
    dataIndex: "description",
    align: "center"
  },
  {
    title: "所属分类",
    width: 100,
    dataIndex: "dishclassificationname",
    align: "center"
  },
  {
    title: "价格",
    width: 80,
    dataIndex: "dishprice",
    align: "center"
  },
  {
    title: "会员价",
    width: 80,
    dataIndex: "memberprice",
    align: "center"
  },
  {
    title: "销量",
    width: 80,
    dataIndex: "sales",
    align: "center"
  },
  {
    title: "限购量",
    width: 80,
    dataIndex: "purchaselimit",
    align: "center"
  },
  // {
  //   title: "货号",
  //   width: 80,
  //   dataIndex: "goodsnum",
  //   align: "center"
  // },

  // {
  //   title: '提货表',
  //   width: 100,
  //   dataIndex: 'coupon',
  //   align: 'center',
  //   scopedSlots: { customRender: 'coupon' }
  // },
  // {
  //   title: "标签",
  //   width: 100,
  //   dataIndex: "tags",
  //   align: "center",
  //   scopedSlots: { customRender: "tags" }
  // },
  {
    title: "上架状态",
    width: 100,
    dataIndex: "dishstatus",
    align: "center",
    scopedSlots: { customRender: "dishstatus" }
  },
  // {
  //   title: "属性",
  //   width: 50,
  //   dataIndex: "isattributes",
  //   align: "center",
  //   scopedSlots: { customRender: "isattributes" }
  // },
  // {
  //   title: '创建时间',
  //   width: 130,
  //   dataIndex: 'createtime',
  //   align: 'center',
  //   ellipsis: true
  // },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];
import event from "@/utils/event";
import GoodsAttributeModal from "./components/GoodsAttributeModal.vue";
import GoodsCouponInfoModal from "./components/GoodsCouponInfoModal.vue";
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
export default {
  components: {
    GoodsAttributeModal,
    GoodsCouponInfoModal,
    DefaultInputTree,
    GlobalFreightModal: () => import("./components/GlobalFreightModal.vue")
  },
  data() {
    return {
      couponForm: this.$form.createForm(this),
      dataSource: [],
      currentDataSource: [],
      columns,
      selectedRowKeys: [],
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      advanced: false,
      loading: false,
      nextDisabled: false,
      targetGoodInfo: null,
      switchLoading: false,
      wrapperCol,
      labelCol,
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      couponVisible: false,
      freightVisible: false,
      targetCouponId: 0,
      attributesVisible: false,
      targetAttributesId: 0,
      goodAddVisible: false,
      goodChangeVisible: false,
      goodInfoVisible: false,
      // 属性筛选
      isattributesTree,
      // 新品筛选
      isnewTree,
      // 推荐筛选
      isrecommendTree,
      // 上架筛选
      isshelvesTree,
      // 预售筛选
      presellTree,
      isshelves: false,
      isnew: false,
      isrecommend: false,
      presell: false,
      selectedCoupon: null,
      attributesAddToCouponVisible: false,
      categoryValue: -1,
      categoryList: []
    };
  },
  mounted() {
    event.$on("addCategoryDone", () => {
      this.fetch();
    });
    this.$bus.$on("changeGoodsDone", () => {
      this.fetch();
    });
    this.fetch();
    this.initCategory();
  },

  computed: {
    // ...mapState({
    //   coupon: state => state.account.coupon,
    //   targetCoupon: state => state.account.targetCoupon
    // })
  },
  methods: {
    // ...mapMutations({
    //   setCoupon: "account/setCoupon",
    //   setTargetCoupon: "account/setTargetCoupon"
    // }),
    // 初始化分类列表
    async initCategory() {
      const user = this.$db.get("USER");
      const userRes = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      const res = await this.$get(
        "/backend/business/LantianDishesclassificationtable/MapAllByStoreId",
        {
          storeid: userRes.data.data.id
        }
      );
      if (res.data.data) {
        this.categoryList = res.data.data.map(item => ({
          title: item.text,
          value: item.id
        }));
      }
      this.categoryList.unshift({
        title: "查看全部",
        value: -1
      });
    },
    // 切换选择分类
    chooseCategory() {
      if (this.categoryValue == -1) {
        this.currentDataSource = this.dataSource;
      } else {
        this.currentDataSource = this.dataSource.filter(
          item => item.dishclassificationid === this.categoryValue
        );
      }
    },
    // 选择列
    onSelectChange(selectedRowKeys) {
      console.info("选择了: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 展开更多筛选
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 筛查属性方式
    handleIsattributesChange(value) {
      this.queryParams.isattributes = value;
      if (value == undefined) {
        delete this.queryParams["isattributes"];
      }
    },
    // 筛查新品方式
    handleIsnewChange(value) {
      this.queryParams.isnew = value;
      if (value == undefined) {
        delete this.queryParams["isnew"];
      }
    },
    // 筛查推荐方式
    handleIsRecomendChange(value) {
      this.queryParams.isrecommend = value;
      if (value == undefined) {
        delete this.queryParams["isrecommend"];
      }
    },
    // 筛查上架方式
    handleIsShelvesChange(value) {
      console.log("value", value);
      this.queryParams.isshelves = value;
      if (value == undefined) {
        delete this.queryParams["isshelves"];
      }
    },
    // 筛查预售方式
    handlePresellChange(value) {
      this.queryParams.presell = value;
      if (value == undefined) {
        delete this.queryParams["presell"];
      }
    },
    // 重置筛选条件
    reset() {
      // 取消选中
      this.selectedRowKeys = [];
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent;
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent;
        this.paginationInfo.pageSize = this.pagination.defaultPageSize;
      }
      this.filteredInfo = null;
      this.sortedInfo = null;
      this.queryParams = {};
      if (this.advanced) {
        this.$refs.isattributesTree.reset();
        this.$refs.isnewTree.reset();
        this.$refs.isrecommendTree.reset();
        this.$refs.isshelvesTree.reset();
        this.$refs.presellTree.reset();
      }
      this.fetch();
    },
    // 搜索
    search() {
      let { sortedInfo, filteredInfo } = this;
      let sortField, sortOrder;
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        sortField = sortedInfo.field;
        sortOrder = sortedInfo.order;
      }
      this.selectData({
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams,
        ...filteredInfo
      });
    },
    // 搜索接口
    selectData(params = {}) {
      this.loading = true;
      // 如果分页信息为空，则设置为默认值
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent;
      this.$refs.TableInfo.pagination.pageSize = this.pagination.defaultPageSize;
      params.pageSize = this.pagination.defaultPageSize;
      params.pageNum = this.pagination.defaultCurrent;
      this.$get("/product/ListLike", {
        ...params
      }).then(res => {
        const pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        let dataSource = [];
        if (res.data.data.rows) {
          dataSource = res.data.data.rows.map(item => ({
            ...item,
            dishurl: this.$restoreUrl(JSON.parse(item.dishurl))[0]
          }));
        }
        this.dataSource = dataSource;
        this.pagination = pagination;
      });
      this.loading = false;
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
      this.paginationInfo = pagination;
      this.filteredInfo = filters;
      this.sortedInfo = sorter;
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      });
    },
    // 网络请求
    async fetch(params = {}) {
      this.loading = true;
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current;
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize;
        params.pageSize = this.paginationInfo.pageSize;
        params.pageNum = this.paginationInfo.current;
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize;
        params.pageNum = this.pagination.defaultCurrent;
      }
      const user = this.$db.get("USER");
      const userRes = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      this.$get("/backend/business/LantianDishmanagement/MapAllByStoreId", {
        storeid: userRes.data.data.id
      }).then(res => {
        const pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.pagination = pagination;
        let dataSource = [];
        if (res.data.data) {
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
          dataSource = itemsList;
        }
        this.dataSource = dataSource;
        this.currentDataSource = dataSource.filter(item => {
          if (this.categoryValue > 0) {
            return item.dishclassificationid === this.categoryValue;
          } else {
            return item;
          }
        });
      });
      this.loading = false;
    },
    // 导出excel表
    exportExcel() {
      const params = {
        pageNum: 1,
        pageSize: 10
      };
      this.$get("/product/excel", { ...params }).then(res => {
        const total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/product/excel?pageNum=1&pageSize=${total}`;
      });
    },
    // 删除商品
    deleteGood(record) {
      this.dataSource = this.dataSource.filter(item => item.id !== record.id);
      this.$message.success("删除成功");
      this.$delete(`/backend/business/LantianDishmanagement/${record.id}`, {
        id: record.id
      });
    },
    // 切换上架状态
    onChangeTags(checked, record, status) {
      this.switchLoading = true;
      let params = {
        id: record.id
      };

      switch (status) {
        case 1:
          params["dishstatus"] = checked ? 1 : 0;
          break;
        case 2:
          params["isnew"] = checked ? 1 : 0;
          break;
        case 3:
          params["isrecommend"] = checked ? 1 : 0;
          break;
        case 4:
          params["presell"] = checked ? 1 : 0;
          break;
        default:
          console.warn("未知错误");
      }
      this.$put("/backend/business/LantianDishmanagement", { ...params }).then(
        () => {
          this.$message.success("切换成功");
          this.fetch();
          this.switchLoading = false;
        },
        () => {
          this.$message.error("修改失败");
        }
      );
    },
    // 添加该商品到提货表
    async addCoupon(record) {
      // 判断缓存中是否存在指定提货表
      if (!this.targetCoupon) {
        this.$message.error("未指定提货表");
        return;
      }
      // 判断该商品是否存在商品属性
      let productsAttributeListRes = await this.$get("/productAttribute/list");
      if (productsAttributeListRes.data.data.rows) {
        let res = productsAttributeListRes.data.data.rows.filter(
          item => item.productid == record.id
        );
        // 存在则需要跳转并选择商品属性
        if (res.length > 0) {
          this.targetAttributesId = record.id;
          this.attributesVisible = true;
          return;
        }
      }

      // 当前选中提货表
      let targetCoupon = this.targetCoupon;
      // 缓存中所有提货表
      let localStorageCoupon = [...this.coupon];
      // 当前缓存中需要被更改的提货表
      let beChangedTargetCoupon = localStorageCoupon.filter(
        item => item.id == targetCoupon.id
      );
      // 当前缓存中不需要被更改的提货表
      let unBeChangedCoupon = localStorageCoupon.filter(
        item => item.id !== targetCoupon.id
      );
      // 缓存中的同一个商品
      let sameTargetProduct = beChangedTargetCoupon[0].productinformation.filter(
        item => item.product.id == record.id
      );
      const params = {
        id: targetCoupon.id,
        giftkeystatus: 0,
        giftkey: targetCoupon.giftkey,
        giftname: targetCoupon.giftname
      };
      // 判断缓存中是否存在同一个商品 有则对数量进行+1处理
      if (sameTargetProduct.length > 0) {
        let targetProduct = sameTargetProduct[0];
        // 对商品数量进行 +1 处理
        targetProduct["count"] += 1;
        // 缓存中的其他商品
        let unSameProduct = beChangedTargetCoupon[0].productinformation.filter(
          item => {
            return item.product.id !== record.id;
          }
        );
        params["productinformation"] = [...unSameProduct, targetProduct];
      }
      // 不存在同一件商品则直接新增
      else {
        let productinformationArr = {
          product: {
            ...record,
            dishurl: this.$formatUrl([{ url: record.dishurl }])
          },
          productAttribute: null,
          count: 1
        };
        params["productinformation"] = [
          ...beChangedTargetCoupon[0].productinformation,
          productinformationArr
        ];
      }
      this.setCoupon([...unBeChangedCoupon, params]);
      this.setTargetCoupon(params);
      this.$message.success("添加进提货表成功");
    },
    // 修改商品信息
    changeGoods(record) {
      this.$router.push({
        path: "/assistance/goods/add",
        query: { id: record.id }
      });
    },
    // 新增商品
    addGoods() {
      this.$router.push({ path: "/assistance/goods/add" });
    },
    showCouponModal() {
      // 判断缓存中是否存在指定提货表
      if (!this.targetCoupon) {
        this.$message.error("未指定提货表");
        return;
      }
      this.couponVisible = true;
    }
  }
};
</script>
