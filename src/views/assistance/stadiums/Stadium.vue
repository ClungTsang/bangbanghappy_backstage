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
                  placeholder="商户名称"
                  v-model="queryParams.companyname"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input placeholder="商户地址" v-model="queryParams.address" />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="联系人"
                  v-model="queryParams.storeowner"
                />
              </a-form-item>
            </a-col>

            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="老板电话"
                  v-model="queryParams.bossmobilenumber"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="门店电话"
                  v-model="queryParams.storephone"
                />
              </a-form-item>
            </a-col> -->

            <a-col :span="8">
              <a-space>
                <a-button
                  type="primary"
                  v-hasPermission="['mall:add']"
                  @click="addStadium"
                  >新增商户</a-button
                >
                <a-button
                  type="primary"
                  v-hasPermission="['mall:change']"
                  ghost
                  @click="multipleChangeCommission"
                  >批量修改商户抽成比例</a-button
                >
                <!-- <a-button type="primary" @click="search">查询</a-button> -->
                <!-- <a-button style="margin-left: 3px" @click="reset"
                  >重置</a-button
                > -->
                <a-dropdown>
                  <a-menu slot="overlay">
                    <a-menu-item key="export-data" @click="exportExcel"
                      >导出Excel</a-menu-item
                    >
                  </a-menu>
                  <a-button v-hasPermission="['mall:export']">
                    更多操作 <a-icon type="down" />
                  </a-button>
                </a-dropdown>
                <!-- <a @click="toggleAdvanced">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a> -->
              </a-space>
            </a-col>
          </div>
        </a-row>
        <a-row>
          <template v-if="advanced">
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-input-tree
                  @change="handleCategoryChange"
                  ref="categoryTree"
                  :orderStatus="0"
                ></stadium-input-tree>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-input-tree @change="handleTagsChange" ref="tagsTree" :orderStatus="1"></stadium-input-tree>
              </a-form-item>
            </a-col> -->
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-input-tree
                  @change="handleStarsChange"
                  ref="starsTree"
                  :orderStatus="2"
                ></stadium-input-tree>
              </a-form-item>
            </a-col>
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-input-tree @change="handleOpendaysChange" ref="opendaysTree" :orderStatus="3"></stadium-input-tree>
              </a-form-item>
            </a-col> -->
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-input-tree
                  @change="handleLiveupdateChange"
                  ref="liveupdateTree"
                  :orderStatus="4"
                ></stadium-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-input-tree
                  @change="handleConveniencestoresalesChange"
                  ref="conveniencestoresalesTree"
                  :orderStatus="5"
                ></stadium-input-tree>
              </a-form-item>
            </a-col>
          </template>
        </a-row>
      </a-form>
    </div>
    <div>
      <a-table
        ref="TableInfo"
        :rowKey="record => record.id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        @change="handleTableChange"
      >
        <!-- 商户/球场 -->
        <!-- <span slot="companyname">商户名称</span> -->
        <span slot="logo" slot-scope="text, record">
          <img style="width: 200px; heigth: auto" :src="$restoreUrl(text)" />
        </span>
        <span slot="storestatus" slot-scope="storestatus">
          <a-tag
            v-for="tag in storestatus"
            :key="tag"
            :color="
              tag == 0
                ? 'red'
                : tag == 1
                ? 'orange'
                : tag == 2
                ? 'blue'
                : tag == 3
                ? 'green'
                : 'cyan'
            "
          >
            {{
              tag == 0
                ? "不营业"
                : tag == 1
                ? "关店"
                : tag == 2
                ? "休店"
                : tag == 3
                ? "开店"
                : "异常"
            }}
          </a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <a @click="showInfoModal(record)">
            查看
          </a>
          <a-divider type="vertical"></a-divider>
          <a @click="changeStadium(record)">
            编辑
          </a>
          <a-divider type="vertical"></a-divider>
          <a-popconfirm title="确认删除" @confirm="deleteCategory(record)">
            <a>删除</a>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <a-modal
      :visible="changeCommissionVisible"
      title="批量修改抽成"
      @ok="handleOk"
      @cancel="changeCommissionVisible = false"
    >
      <a-form>
        <a-form-item label="批量修改选中商户的抽成比例">
          <a-row>
            <a-col :span="16">
              <a-slider v-model="slider.value" :min="0" :max="99" />
            </a-col>
            <a-col :span="4" offset="2">
              <a-input-number
                v-model="slider.value"
                :min="0"
                :max="99"
                style="marginleft: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
    <stadium-info-modal
      :infoVisible="storeInfoVisible"
      :id="targetId"
      @close="storeInfoVisible = false"
    ></stadium-info-modal>
  </a-card>
</template>
<script>
const columns = [
  {
    title: "图片",
    dataIndex: "logo",
    align: "center",
    width: 200,
    scopedSlots: { customRender: "logo" }
  },
  {
    title: "商户名称",
    dataIndex: "companyname",
    width: 130,
    align: "center",
    slots: { title: "companyname" }
  },
  {
    title: "商户介绍",
    dataIndex: "detailedintroduction",
    width: 130,
    align: "center",
    slots: { title: "detailedintroduction" }
  },

  {
    title: "商户地址",
    width: 130,
    dataIndex: "address",
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
    title: "商户电话",
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
    title: "商户状态",
    dataIndex: "storestatus",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "storestatus" }
  },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  components: {
    StadiumInputTree: () => import("./components/StadiumInputTree.vue"),
    StadiumInfoModal: () => import("./components/StadiumInfoModal.vue")
  },
  data() {
    return {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      selectedRows: [],
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      advanced: false,
      loading: false,
      nextDisabled: false,
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      storeInfoVisible: false,
      targetId: 0,
      changeCommissionVisible: false,
      slider: {
        value: 20
      }
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    // 选择的列
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRows = selectedRows;
      this.selectedRowKeys = selectedRowKeys;
    },
    // 展开更多筛选
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    handleCategoryChange(value) {
      console.info(value);
      this.queryParams.category = value;
      if (value === undefined) {
        delete this.queryParams["category"];
      }
    },
    handleTagsChange(value) {
      this.queryParams.storestatus = value;
      if (value === undefined) {
        delete this.queryParams["storestatus"];
      }
    },
    handleStarsChange(value) {
      this.queryParams.stars = value;
      if (value === undefined) {
        delete this.queryParams["stars"];
      }
    },
    handleOpendaysChange(value) {
      this.queryParams.opendays = value;
      if (value === undefined) {
        delete this.queryParams["opendays"];
      }
    },
    handleLiveupdateChange(value) {
      this.queryParams.liveupdate = value;
      if (value === undefined) {
        delete this.queryParams["liveupdate"];
      }
    },
    handleConveniencestoresalesChange(value) {
      this.queryParams.conveniencestoresales = value;
      if (value === undefined) {
        delete this.queryParams["conveniencestoresales"];
      }
    },
    // 重置筛选条件
    reset() {
      // 取消选中
      this.selectedRowKeys = [];
      this.selectedRows = [];
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
      if (this.advanced) {
        this.$refs.categoryTree.reset();
        this.$refs.starsTree.reset();
        this.$refs.liveupdateTree.reset();
        this.$refs.conveniencestoresalesTree.reset();
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
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent;
      this.$refs.TableInfo.pagination.pageSize = this.pagination.defaultPageSize;
      params.pageSize = this.pagination.defaultPageSize;
      params.pageNum = this.pagination.defaultCurrent;
      const user = this.$db.get("USER");
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        //根据不同的角色请求旗下门店
        this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
          result => {
            if (result.data.data && result.data.code == 200) {
              return this.$get("/business/LantianStore/MapAllByStoreid", {
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
          ...params
        }).then(res => {
          let pagination = { ...this.pagination };
          pagination.total = res.data.data.total;
          this.dataSource = res.data.data.rows;
          this.pagination = pagination;
        });
      }
      this.loading = false;
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
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
    fetch(params = {}) {
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
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        //根据不同的角色请求旗下门店
        this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
          result => {
            if (result.data.data && result.data.code == 200) {
              return this.$get("/business/LantianStore/MapAllByStoreid", {
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
          ...params
        }).then(res => {
          let pagination = { ...this.pagination };
          pagination.total = res.data.data.total;
          this.dataSource = res.data.data.rows;
          this.pagination = pagination;
        });
      }
      this.loading = false;
    },
    exportExcel() {
      let total = 0;
      const params = {
        pageNum: 1,
        pageSize: 10
      };
      let user = this.$db.get("USER");
      // 甲方如果需要代理也能导表
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        //根据不同的角色请求旗下门店
        this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(
          result => {
            if (result.data.data && result.data.code == 200) {
              return this.$get("/business/LantianStore/MapAllByStoreid", {
                ...params,
                Parentid: result.data.data.id
              }).then(res => {
                if (res.data.data) {
                  total = res.data.data.total;
                }
              });
            }
          }
        );
      } else {
        this.$get("/business/LantianStore/MapAll", {
          ...params
        }).then(res => {
          total = res.data.data.total;
        });
      }
      window.location.href = `https://javabangbanghappy.lanfriend.cn/business/LantianStore/excel?pageNum=1&pageSize=${total}`;
    },
    // 删除商户
    deleteCategory(record) {
      this.dataSource = this.dataSource.filter(item => item.id != record.id);
      this.$message.success("删除成功");
      this.$delete(`/business/LantianStore/${record.id}`);
    },
    // 新增商户
    addStadium() {
      this.$router.push({ path: "/assistance/mall/set" });
    },
    multipleChangeCommission() {
      if (this.selectedRowKeys.length == 0) {
        this.$message.error("至少选择一项");
        retrun;
      }
      this.changeCommissionVisible = true;
    },
    // 批量修改商户抽成比例
    handleOk() {
      this.selectedRows.forEach(async item => {
        await this.$put("business/LantianStore", {
          id: item.id,
          spendpercent: this.slider.value + ""
        });
      });
      this.$message.success("批量修改抽成成功");
      this.changeCommissionVisible = false;
      this.fetch();
    },
    // 查看或更改商户
    changeStadium(record) {
      this.$router.push({
        path: "/assistance/mall/set",
        query: { id: record.id }
      });
    },
    // 查看门店信息
    showInfoModal(record) {
      this.storeInfoVisible = true;
      this.targetId = record.id;
    }
  }
};
</script>
