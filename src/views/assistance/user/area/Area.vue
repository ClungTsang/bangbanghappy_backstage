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
                  placeholder="代理区域名称"
                  v-model="queryParams.agentinformationdescription"
                />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-space>
                <a-button type="primary" @click="search">查询</a-button>

                <a-button type="primary" @click="() => (areaAddVisible = true)"
                  >新增区域代理</a-button
                >
                <a-button style="margin-left: 3px" @click="reset"
                  >重置</a-button
                >
                <!-- <a-dropdown>
                  <a-menu slot="overlay">
                    <a-menu-item key="export-data" @click="exportExcel"
                      >导出Excel</a-menu-item
                    >
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
                  @change="handleAreaChange"
                  ref="areaTree"
                  :treePlaceholder="'候补'"
                  :treeData="areaTree"
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
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        @change="handleTableChange"
      >
        <!-- 半径  -->
        <span slot="radius" slot-scope="text, record"> {{ text }}米 </span>
        <!-- 操作 -->
        <span slot="action" slot-scope="text, record">
          <a-button
            type="primary"
            @click="
              () => {
                areaVisible = true;
                targetAreaId = record.id;
              }
            "
          >
            编辑
          </a-button>
          <a-popconfirm
            title="确认删除该代理区域"
            @confirm="deleteArea(record)"
          >
            <a-button type="danger">删除代理区域</a-button>
          </a-popconfirm>
        </span>
      </a-table>
    </div>
    <!-- 编辑代理区域 -->
    <area-setting-modal
      :areaVisible="areaVisible"
      :targetAreaId="targetAreaId"
      @close="() => (areaVisible = false)"
      @changeDone="
        () => {
          fetch();
          areaVisible = false;
        }
      "
    ></area-setting-modal>
    <!-- 新增代理区域 -->
    <area-add-modal
      :areaAddVisible="areaAddVisible"
      @addDone="
        () => {
          fetch();
          areaAddVisible = false;
        }
      "
      @close="() => (areaAddVisible = false)"
    ></area-add-modal>
  </a-card>
</template>
<script>
const areaTree = [
  { title: "候补1", value: 0 },
  { title: "候补2", value: 1 }
];
const columns = [
  {
    title: "id",
    dataIndex: "id",
    width: 50,
    align: "center",
    ellipsis: true
  },
  {
    title: "代理区域名称描述",
    width: 300,
    dataIndex: "agentinformationdescription",
    align: "center",
    ellipsis: true
  },
  {
    title: "半径",
    width: 100,
    dataIndex: "radius",
    align: "center",
    scopedSlots: { customRender: "radius" }
  },
  {
    title: "创建时间",
    width: 130,
    dataIndex: "createtime",
    align: "center",
    ellipsis: true
  },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];
import AreaSettingModal from "./components/AreaSettingModal.vue";
import AreaAddModal from "./components/AreaAddModal.vue";
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
export default {
  components: { AreaSettingModal, AreaAddModal, DefaultInputTree },
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
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      areaVisible: false,
      areaAddVisible: false,
      targetAreaId: 0,
      // 筛选
      areaTree
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    // 选择列
    onSelectChange(selectedRowKeys) {
      console.info("选择了: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 展开更多筛选
    // toggleAdvanced() {
    //   this.advanced = !this.advanced;
    // },
    // 筛查方式
    handleAreaChange(value) {
      this.queryParams.isattributes = value;
      if (value == undefined) {
        delete this.queryParams["isattributes"];
      }
    },
    // 筛查推荐方式
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
      // this.$refs.areaTree.reset();
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
      this.$get("/agentInformation/list", {
        ...params
      }).then(res => {
        const pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.dataSource = res.data.data.rows;
        this.pagination = pagination;
        this.loading = false;
      });
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

      this.$get("/agentInformation/list", {
        ...params
      }).then(res => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.dataSource = res.data.data.rows;
        this.loading = false;
      });
    },
    //TODO: 接口未完善导出excel表
    exportExcel() {
      const params = {
        pageNum: 1,
        pageSize: 10
      };
      this.$get("/agentInformation/excel", { ...params }).then(res => {
        const total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/agentInformation/excel?pageNum=1&pageSize=${total}`;
      });
    },
    // 删除代理区域
    deleteArea(record) {
      let dataSource = this.dataSource.filter(item => {
        return item.id !== record.id;
      });
      this.dataSource = dataSource;
      this.$message.success("删除成功");
      this.$get("/agentInformation/deletebyID", { id: record.id });
    }
  }
};
</script>
