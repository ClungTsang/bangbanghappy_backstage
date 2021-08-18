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
                  placeholder="用户姓名"
                  v-model="queryParams.realname"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="用户昵称"
                  v-model="queryParams.customername"
                />
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input
                  placeholder="用户联系方式"
                  v-model="queryParams.phonenum"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-space>
                <a-button type="primary" @click="search">查询</a-button>

                <a-button style="margin-left: 3px" @click="reset"
                  >重置</a-button
                >
                <!-- 升级会员金额 -->
    <!-- <a-button type="danger" ghost @click="openVipPriceModal">
      调整升级会员所需金额
      </a-button> -->
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
                <a @click="toggleAdvanced">
                  {{ advanced ? "收起" : "展开" }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a>
              </a-space>
            </a-col>
          </div>
        </a-row>
        <a-row>
          <template v-if="advanced">
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="wechatcustomerstatusChange"
                  ref="wechatcustomerstatusTree"
                  :treePlaceholder="'援助限制'"
                  :treeData="wechatcustomerstatusTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="needdepositChange"
                  ref="needdepositTree"
                  :treePlaceholder="'押金限制'"
                  :treeData="needdepositTree"
                ></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <default-input-tree
                  @change="agentChange"
                  ref="agentTree"
                  :treePlaceholder="'代理状态'"
                  :treeData="agentTree"
                ></default-input-tree>
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
        <span slot="headimgurl" slot-scope="text, record">
          <img style="width: 60px; heigth: 60px" :src="record.headimgurl" />
        </span>
         <span slot="viplevel" slot-scope="text, record">
           {{text == 0 ? '非会员' : '会员'}}
          </a-select>
        </span>
        <span slot="agent" slot-scope="text, record">
           {{text == 0 ? '非代理' : '代理'}}
          </a-select>
        </span>
        <span slot="wechatcustomerstatus" slot-scope="text, record">
          <a-select
            :defaultValue="text == 0 ? '不限制' : '限制'"
            style="width: 100px"
            @change="
              (e) => {
                onChangeStatus(e, record);
              }
            "
          >
            <a-select-option value="0">不限制</a-select-option>
            <a-select-option value="1">限制</a-select-option>
          </a-select>
        </span>

        <span slot="needdeposit" slot-scope="text, record">
          <a-select
            :defaultValue="text == 1 ? '需要' : '不需要'"
            style="width: 100px"
            @change="
              (e) => {
                onChangeMoney(e, record);
              }
            "
          >
            <a-select-option value="1">需要</a-select-option>
            <a-select-option value="0">不需要</a-select-option>
          </a-select>
        </span>
        <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该用户"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除用户</a>
        </a-popconfirm>
      </span>
      </a-table>
    </div>
    <vip-price-modal
      :vipPriceVisible="vipPriceVisible"
      @close="closeVipPriceModal"
    ></vip-price-modal>
  </a-card>


</template>
<script>
const wechatcustomerstatusTree = [
  { title: "不限制", value: 0 },
      { title: "限制", value: 1 },
];
const needdepositTree = [
  { title: "需要", value:1 },
      { title: "不需要", value: 0 },
];
const agentTree = [
  { title: "代理", value:1 },
      { title: "非代理", value: 0 },
];
const columns = [
  {
    title: "头像",
    dataIndex: "headimgurl",
    scopedSlots: { customRender: "headimgurl" },
    width: 100,
    align: "center",
  },
  {
    title: "用户姓名",
    dataIndex: "realname",
    width: 150,
    align: "center",
  },
  {
    title: "用户昵称",
    dataIndex: "customername",
    width: 150,
    align: "center",
  },
  {
    title: "性别",
    dataIndex: "sex",
    width: 100,
    align: "center",
  },
  {
    title: "电话号码",
    dataIndex: "phonenum",
    width: 200,
    align: "center",
  },
  {
    title: "会员等级",
    dataIndex: "viplevel",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "viplevel" },
  },
  {
    title: "代理状态",
    dataIndex: "agent",
    width: 100,
    align: "center",
    scopedSlots: { customRender: "agent" },
  },
  {
    title: "更新时间",
    dataIndex: "updatetime",
    width: 200,
    align: "center",
  },

  {
    title: "是否限制援助他人",
    dataIndex: "wechatcustomerstatus",
    align: "center",
    width: 160,
    scopedSlots: { customRender: "wechatcustomerstatus" },

  },
  {
    title: "是否需要交押金",
    dataIndex: "needdeposit",
    align: "center",
    width: 150,
    scopedSlots: { customRender: "needdeposit" },

  },
  {
    title: "操作",
    width: 100,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
import VipPriceModal from './components/VipPriceModal.vue';
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
export default {
  components:{
    DefaultInputTree,VipPriceModal
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
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      vipPriceVisible: false,
wechatcustomerstatusTree,
needdepositTree,
agentTree

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
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
    // 筛查援助限制方式
    wechatcustomerstatusChange(value) {
      this.queryParams.wechatcustomerstatus = value;
      if (value == undefined) {
        delete this.queryParams["wechatcustomerstatus"];
      }
    },
    // 筛查押金状态方式
    needdepositChange(value) {
      this.queryParams.needdeposit = value;
      if (value == undefined) {
        delete this.queryParams["needdeposit"];
      }
    },
// 筛查代理状态方式
    agentChange(value) {
      this.queryParams.agent = value;
      if (value == undefined) {
        delete this.queryParams["agent"];
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
      // 重置列过滤器规则
      this.filteredInfo = null;
      // 重置列排序规则
      this.sortedInfo = null;
      // 重置查询参数
      this.queryParams = {};
      if (this.advanced) {

        this.$refs.wechatcustomerstatusTree.reset();
        this.$refs.needdepositTree.reset();
        this.$refs.agentTree.reset();
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
      this.$get("/wechatcustomer/ListLike", {
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

      this.$get("/wechatcustomer/list", {
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        this.dataSource = res.data.data.rows;
        this.pagination = pagination;
        this.loading = false;
      });
    },
    // 导表
exportExcel() {
      const params = {
        pageNum: 1,
        pageSize: 10
      };
      this.$get("/wechatcustomer/excel", { ...params }).then(res => {
        const total = res.data.data.total;
        window.location.href = `https://javabangbanghappy.lanfriend.cn/wechatcustomer/excel?pageNum=1&pageSize=${total}`;
      });
    },
    // 切换交押金状态
    onChangeMoney(e, record) {
      console.log(e, record);
      const params = { needdeposit: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 切换用户援助状态
    onChangeStatus(e, record) {
      console.log(e, record);
      const params = { wechatcustomerstatus: e, id: record.id };
      this.$post("/wechatcustomer/update", { ...params }).then(() => {
        this.$message.success("切换成功");
      });
    },
    // 删除用户
    // 删除问题
    confirmDelete(record) {
      this.$get("/wechatcustomer/delete", { id: record.id }).then(() => {
        let dataSource = this.dataSource.filter((item) => {
          return item.id !== record.id;
        });
        this.$message.success("删除用户成功");
        this.dataSource = dataSource;
      });
    },
    // 调整会员费用
    openVipPriceModal() {
      this.vipPriceVisible = true;
    },
    closeVipPriceModal() {
      this.vipPriceVisible = false;
    },
  },
};
</script>
