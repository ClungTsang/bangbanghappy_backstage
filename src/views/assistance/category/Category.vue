<template>
  <a-card :bordered="false">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form>
        <a-row>
          <div :class="advanced ? null : 'fold'">
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="订单编号"
                  v-model="queryParams.realname"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="客户姓名"
                  v-model="queryParams.phonenum"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="客户电话"
                  v-model="queryParams.referrerwechatname"
                />
              </a-form-item>
            </a-col>-->
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input placeholder="分类名称" v-model="queryParams.text" />
              </a-form-item>
            </a-col>

            <a-col :span="8">
              <a-space>
                <a-button
                  type="primary"
                  @click="
                    categorySetVisible = true;
                    targetCategory = { id: 0 };
                  "
                >
                  新增分类
                </a-button>
                <!-- <a-button type="primary" @click="search">查询</a-button> -->
                <!-- <a-button style="margin-left: 3px" @click="reset"
                  >重置</a-button
                > -->
                <!-- <a-dropdown>
                  <a-menu slot="overlay">
                    <a-menu-item key="export-data" @click="exportExcel"
                      >导出Excel</a-menu-item
                    >
                  </a-menu>
                  <a-button> 更多操作 <a-icon type="down" /> </a-button>
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
                <category-input-tree
                  @change="handleOrderWayChange"
                  ref="orderWayTree"
                  :orderStatus="0"
                >
                </category-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <category-input-tree
                  @change="handleOrderTypeChange"
                  ref="orderTypeTree"
                  :orderStatus="1"
                >
                </category-input-tree>
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
        :data-source="dataSource"
        :loading="loading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        @change="handleTableChange"
      >
        <!-- 图标 -->
        <!-- <span
          slot="iconurl"
          slot-scope="text, record"
        >
          <img
            style="width: 150px; heigth: auto"
            :src="record.iconurl[0]"
          />
        </span> -->
        <!-- 是否显示 -->
        <!-- <span
          slot="isdisplay"
          slot-scope="isdisplay"
        >
          <a-tag
            v-for="tag in isdisplay"
            :key="tag"
            :color="tag == 1 ? 'cyan' : 'purple'"
          >
            {{ tag == 1 ? '显示' : '不显示' }}
          </a-tag>
        </span> -->
        <!-- 设置 -->
        <!-- <span
          slot="setting"
          slot-scope="text, record"
        >
          <a-button
            type="primary"
            :disabled="nextDisabled"
            @click="check(record)"
          >
            查看上级
          </a-button>
          <a-button
            type="primary"
            ghost
            :disabled="nextDisabled"
            @click="
              () => {
                pid = record.id
                fetch()
              }
            "
          >
            查看下级
          </a-button>
        </span> -->
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a-button
            type="primary"
            @click="
              () => {
                categorySetVisible = true;
                targetCategory = record;
              }
            "
          >
            编辑
          </a-button>
          <a-popconfirm title="确认删除" @confirm="deleteCategory(record)">
            <a-button type="danger">删除</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- 分类信息 -->
    <category-set-modal
      :categorySetVisible="categorySetVisible"
      :targetCategory="targetCategory"
      @addCategoryDone="
        fetch();
        categorySetVisible = false;
      "
      @close="categorySetVisible = false"
    ></category-set-modal>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 100,
    align: "center"
  },
  // {
  //   title: "顺序号",
  //   width: 100,
  //   dataIndex: "ordernum",
  //   align: "center"
  // },
  // {
  //   title: '分类图标',
  //   dataIndex: 'iconurl',
  //   align: 'center',
  //   width: 150,
  //   scopedSlots: { customRender: 'iconurl' }
  // },
  {
    title: "分类名",
    width: 300,
    dataIndex: "text",
    align: "center"
  },

  // {
  //   title: "显示状态",
  //   width: 100,
  //   dataIndex: "isdisplay",
  //   align: "center",
  //   scopedSlots: { customRender: "isdisplay" }
  // },

  // {
  //   title: "创建时间",
  //   width: 200,
  //   dataIndex: "createtime",
  //   align: "center"
  // },
  // {
  //   title: "创建时间",
  //   width: 200,
  //   dataIndex: "createtime",
  //   align: "center"
  // },
  // {
  //   title: '设置',
  //   width: 60,
  //   dataIndex: 'setting',
  //   align: 'center',
  //   scopedSlots: { customRender: 'setting' }
  // },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];
import CategorySetModal from "./components/CategorySetModal.vue";
import CategoryInputTree from "./components/CategoryInputTree.vue";
export default {
  components: {
    CategorySetModal,
    CategoryInputTree
  },
  data() {
    return {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      advanced: false,
      loading: false,
      nextDisabled: false,
      targetCategoryId: null,
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      categorySetVisible: false,
      categoryChangeVisible: false,
      pid: 0
    };
  },
  mounted() {
    this.fetch();
    // this.$get('productClassification/deletebyID',{id:3})
  },
  methods: {
    // 选择列
    onSelectChange(selectedRowKeys) {
      console.info("选择了: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 展开更多筛选
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 筛查的订单状态
    // handleOrderStatusChange(value) {
    //   this.queryParams.orderstatus = value || "";
    // },
    // 筛查订单类型
    // handleOrderTypeChange(value) {
    //   this.queryParams.setting = value || "";
    // },
    // 筛查配送方式
    // handleOrderWayChange(value) {
    //   this.queryParams.isdisplay = value || "";
    // },
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
      // 重置列过滤器规则
      this.filteredInfo = null;
      // 重置列排序规则
      this.sortedInfo = null;
      // 重置查询参数
      this.queryParams = {};
      // 清空订单配送方式状态树选择
      // this.$refs.orderWayTree.reset();
      // 清空订单类型状态树选择
      // this.$refs.orderTypeTree.reset();
      // 清空订单状态树选择
      // this.$refs.orderStatusTree.reset();
      // 清空时间选择
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
      this.$get("/productClassification/ListLike", {
        ...params
      }).then(res => {
        const pagination = { ...this.pagination };
        this.pagination = pagination;
        pagination.total = res.data.data.total;
        let dataSource = [];
        if (res.data.data.rows) {
          dataSource = res.data.data.rows.filter(item => {
            return item.pid == this.pid;
          });
        }
        this.dataSource = dataSource;
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
      this.$get(
        "/backend/business/LantianDishesclassificationtable/MapAllByStoreId",
        {
          storeid: userRes.data.data.id
        }
      ).then(res => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.total;
        this.pagination = pagination;
        let dataSource = [];
        if (res.data.data) {
          dataSource = res.data.data;
        }
        this.dataSource = dataSource;
      });
      this.loading = false;
    },
    // TODO:导出excel表  接口未完善
    exportExcel() {
      const params = {
        pageNum: 1,
        pageSize: 10
      };
      this.$get("/productClassification/excel", { ...params }).then(res => {
        // console.log(res.data.data);
        const total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/productClassification/excel?pageNum=1&pageSize=${total}`;
      });
    },
    // 删除分类
    deleteCategory(record) {
      this.dataSource = this.dataSource.filter(item => item.id != record.id);
      this.$message.success("删除成功");
      this.$delete(
        `/backend/business/LantianDishesclassificationtable/${record.id}`
      );
    }
  }
};
</script>
