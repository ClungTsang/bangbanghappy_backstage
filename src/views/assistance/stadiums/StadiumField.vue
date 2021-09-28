<template>
  <a-card :bordered="false">
    <div :class="advanced ? 'search' : null">
      <!-- 搜索区域 -->
      <a-form>
        <a-row>
          <div :class="advanced ? null : 'fold'">
            <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <a-input placeholder="球场名称" v-model="queryParams.courtname" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-space>
                <a-button type="primary" @click="addStadium">
                  新增球场
                </a-button>
                <a-button type="primary" @click="search">查询</a-button>
                <a-button style="margin-left: 3px" @click="reset">重置</a-button>
                <!-- <a-dropdown>
                  <a-menu slot="overlay">
                    <a-menu-item key="export-data" @click="exportExcel"
                      >导出Excel</a-menu-item
                    >
                  </a-menu>
                  <a-button> 更多操作 <a-icon type="down" /> </a-button>
                </a-dropdown> -->
                <!-- <a @click="toggleAdvanced">
                  {{ advanced ? '收起' : '展开' }}
                  <a-icon :type="advanced ? 'up' : 'down'" />
                </a> -->
              </a-space>
            </a-col>
          </div>
        </a-row>
        <a-row>
          <template v-if="advanced">
            <!-- 球场类型筛选 -->
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-field-input-tree
                  @change="handleCourtCategoryChange"
                  ref="courtCategoryTree"
                  :orderStatus="0"
                ></stadium-field-input-tree>
              </a-form-item>
            </a-col> -->
            <!-- 开放状态筛选 -->
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-field-input-tree
                  @change="handleOpenStatusChange"
                  ref="openStatusTree"
                  :orderStatus="1"
                ></stadium-field-input-tree>
              </a-form-item>
            </a-col> -->
            <!-- 球场等级筛选 -->
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-field-input-tree
                  @change="handleGradeChange"
                  ref="gradeTree"
                  :orderStatus="2"
                ></stadium-field-input-tree>
              </a-form-item>
            </a-col> -->
            <!-- 评价星级筛选 -->
            <!-- <a-col :span="4">
              <a-form-item :wrapperCol="{ span: 20 }">
                <stadium-field-input-tree
                  @change="handleStarsChange"
                  ref="starsTree"
                  :orderStatus="3"
                ></stadium-field-input-tree>
              </a-form-item>
            </a-col> -->
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
        <span slot="coverphotos" slot-scope="text, record">
          <img style="width: 140px; heigth: auto" :src="text" />
        </span>
        <!-- <span
          slot="courtcategory"
          slot-scope="courtcategory"
        >
          <a-tag
            v-for="tag in courtcategory"
            :key="tag"
            :color="tag == 0 ? 'cyan' : 'purple'"
          >
            {{ tag == 0 ? '室内球场' : '野球场' }}
          </a-tag>
        </span> -->
        <span slot="grade" slot-scope="text, record">{{ text }}</span>
        <!-- <span slot="setting" slot-scope="text, record">
          <a-button type="primary" @click="manageStadium(record)">管理该球场</a-button>
        </span> -->
        <span slot="openstatus" slot-scope="text, record">
          <a-tag v-for="tag in text" :key="tag">
            {{ tag == 0 ? '不激活' : '激活' }}
          </a-tag>
        </span>
        <!-- <span
          slot="opendays"
          slot-scope="text, record"
        >
          <a-tag
            v-for="day in text"
            :key="day"
          >
            {{ day }}
          </a-tag>
        </span> -->
        <span slot="action" slot-scope="text, record">
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
  </a-card>
</template>
<script>
const columns = [
  {
    title: '类型',
    width: 100,
    dataIndex: 'courtcategory',
    align: 'center',
    scopedSlots: { customRender: 'courtcategory' }
  },
  {
    title: '图片',
    dataIndex: 'coverphotos',
    align: 'center',
    width: 300,
    scopedSlots: { customRender: 'coverphotos' }
  },
  {
    title: '名称',
    dataIndex: 'courtname',
    width: 100,
    align: 'center',
    slots: { title: 'courtname' }
  },

  {
    title: '简介',
    width: 300,
    dataIndex: 'introduction',
    align: 'center'
  },
  {
    title: '开放状态',
    width: 100,
    dataIndex: 'openstatus',
    align: 'center',
    scopedSlots: { customRender: 'openstatus' }
  },
  // {
  //   title: '等级',
  //   width: 100,
  //   dataIndex: 'grade',
  //   align: 'center',
  //   scopedSlots: { customRender: 'grade' }
  // },
  // {
  //   title: '评价',
  //   width: 100,
  //   dataIndex: 'stars',
  //   align: 'center',
  //   // ellipsis: true,
  //   scopedSlots: { customRender: 'stars' }
  // },
  // {
  //   title: '标签',
  //   width: 100,
  //   dataIndex: 'tags',
  //   align: 'center',
  //   // ellipsis: true,
  //   scopedSlots: { customRender: 'tags' }
  // },
  // {
  //   title: '建议消费金额',
  //   width: 80,
  //   dataIndex: 'averageprice',
  //   align: 'center',
  //   scopedSlots: { customRender: 'averageprice' }
  // },
  // {
  //   title: '管理',
  //   width: 80,
  //   dataIndex: 'setting',
  //   align: 'center',
  //   scopedSlots: { customRender: 'setting' }
  // },
  {
    title: '操作',
    width: 200,
    dataIndex: 'action',
    align: 'center',
    fiexd: 'right',
    scopedSlots: { customRender: 'action' }
  }
]
import { mapState } from 'vuex'
import { restoreUrl } from '@/utils/urlTool'
export default {
  components: {
    StadiumFieldInputTree: () => import('./components/StadiumFieldInputTree.vue')
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
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      }
    }
  },

  mounted() {
    this.fetch()
    // this.getCourtcategory()
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    })
  },
  methods: {
    // 选择列
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 展开更多筛选
    toggleAdvanced() {
      this.advanced = !this.advanced
    },
    handleCourtCategoryChange(value) {
      this.queryParams.courtcategory = value
      if (value === undefined) {
        delete this.queryParams['courtcategory']
      }
    },
    handleOpenStatusChange(value) {
      this.queryParams.courtcategory = value
      if (value === undefined) {
        delete this.queryParams['openstatus']
      }
    },
    handleGradeChange(value) {
      this.queryParams.grade = value
      if (value === undefined) {
        delete this.queryParams['grade']
      }
    },
    handleStarsChange(value) {
      this.queryParams.stars = value
      if (value === undefined) {
        delete this.queryParams['stars']
      }
    },
    // 重置筛选条件
    reset() {
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      // 重置列过滤器规则
      this.filteredInfo = null
      // 重置列排序规则
      this.sortedInfo = null
      // 重置查询参数
      this.queryParams = {}
      if (this.advanced) {
        this.$refs.courtCategoryTree.reset()
        this.$refs.openStatusTree.reset()
        // this.$refs.gradeTree.reset()
        // this.$refs.starsTree.reset()
      }

      this.fetch()
    },
    // 搜索
    search() {
      let { sortedInfo, filteredInfo } = this
      let sortField, sortOrder
      // 获取当前列的排序和列的过滤规则
      if (sortedInfo) {
        sortField = sortedInfo.field
        sortOrder = sortedInfo.order
      }
      this.selectData({
        sortField: sortField,
        sortOrder: sortOrder,
        ...this.queryParams,
        ...filteredInfo
      })
    },
    // 搜索接口
    selectData(params = {}) {
      this.loading = true
      // 如果分页信息为空，则设置为默认值
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      this.$refs.TableInfo.pagination.pageSize = this.pagination.defaultPageSize
      params.pageSize = this.pagination.defaultPageSize
      params.pageNum = this.pagination.defaultCurrent
      this.$get('/gymCourt/ListLike', {
        ...params,
        gymandstadiumid: this.user.email
      }).then(res => {
        const pagination = { ...this.pagination }
        pagination.total = res.data.data.total
        let dataSource = []
        if (res.data.data.rows) {
          dataSource = res.data.data.rows.map(item => ({ ...item, coverphotos: restoreUrl(item.coverphotos) }))
        }
        // let result = res.data.data.rows
        // for (let i = 0; i < result.length; i++) {
        //   let item = result[i]
        //   // let tagsArr = []
        //   // item.openstatus.split(',').forEach((tag) => {
        //   //   tagsArr.push(tag)
        //   // })
        //   // item['openstatus'] = tagsArr

        //   // let opendaysArr = []
        //   // item.opendays.split(',').forEach((day) => {
        //   //   opendaysArr.push(day)
        //   // })
        //   // item['opendays'] = opendaysArr
        //   item['coverphotos'] = restoreUrl(result[i].coverphotos)
        //   dataSource.push(item)
        // }

        this.pagination = pagination
        this.dataSource = dataSource
      })
      this.loading = false
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      this.paginationInfo = pagination
      this.filteredInfo = filters
      this.sortedInfo = sorter
      this.fetch({
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...this.queryParams,
        ...filters
      })
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true
      if (this.paginationInfo) {
        // 如果分页信息不为空，则设置表格当前第几页，每页条数，并设置查询分页参数
        this.$refs.TableInfo.pagination.current = this.paginationInfo.current
        this.$refs.TableInfo.pagination.pageSize = this.paginationInfo.pageSize
        params.pageSize = this.paginationInfo.pageSize
        params.pageNum = this.paginationInfo.current
      } else {
        // 如果分页信息为空，则设置为默认值
        params.pageSize = this.pagination.defaultPageSize
        params.pageNum = this.pagination.defaultCurrent
      }

      this.$get('/gymCourt/list', {
        ...params,
        gymandstadiumid: this.user.email
      }).then(res => {
        const pagination = { ...this.pagination }
        pagination.total = res.data.data.total
        let dataSource = []
        if (res.data.data.rows) {
          dataSource = res.data.data.rows.map(item => ({ ...item, coverphotos: restoreUrl(item.coverphotos) }))
        }
        this.pagination = pagination
        this.dataSource = dataSource
      })
      this.loading = false
    },
    exportExcel() {
      const params = {
        pageNum: 1,
        pageSize: 10
      }
      this.$get('/gymCourt/excel', { ...params }).then(res => {
        const total = res.data.data.total
        window.location.href = `https://javabangbanghappy.lanfriend.cn/gymCourt/excel?pageNum=1&pageSize=${total}`
      })
    },
    // 删除球场
    deleteCategory(record) {
      let dataSource = this.dataSource.filter(item => {
        return item.id != record.id
      })
      this.dataSource = dataSource
      this.$message.success('删除成功')
      this.$get('/gymCourt/deletebyID', { id: record.id })
    },
    // 新增球场
    addStadium() {
      this.$router.push({ path: '/yeqiu/stadiums/field/add' })
    },
    // 查看或更改该球场信息
    changeStadium(record) {
      this.$router.push({ path: '/yeqiu/stadiums/field/add', query: { id: record.id } })
    },
    // 管理指定球场日程
    manageStadium(record) {
      this.$router.push({ path: '/yeqiu/stadiums/field/setting', query: { id: record.id } })
    }
  }
}
</script>
