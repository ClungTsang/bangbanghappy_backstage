<template>
  <a-card :bordered="false">
    <div :class="advanced ? 'search' : null">
      <a-row>
        <a-col>
          <a-form layout="inline">
            <a-form-item>
              预约日期：
              <a-date-picker v-model="form.initDate" style="margin:0 10px" />
              预约时间：
              <a-time-picker v-model="form.initOpenTime" format="HH:mm" style="margin:0 10px" />
              预约时长：
              <a-select v-model="form.initService" style="width: 100px">
                <a-select-option v-for="(item, index) in courtCategoryList" :key="index" :value="item.value">{{ item.title }}</a-select-option>
              </a-select>
              <!-- <a-input-number v-model="form.initService" :step="1" :min="0" :max="1440" style="margin:0 10px" /> -->
              场地间隔：
              <a-input-number v-model="form.initscheduleGap" :step="1" :min="0" :max="1440" style="margin:0 10px" />
              预约价格：
              <a-input-number v-model="form.initPrice" :step="1" :min="0" :max="9999999" style="margin:0 10px" />
              拼单人数：
              <a-input-number v-model="form.initGroup" :step="1" :min="0" :max="100" style="margin:0 10px" />
              <a-space>
                <a-button type="primary" ghost @click="handleAddCell">添加预约时段</a-button>
                <a-button type="danger" @click="resetDefaultGap">重置预约信息</a-button>
              </a-space>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
      <a-row>
        <div :class="advanced ? null : 'fold'">
          <a-col :span="24">
            <a-space>
              <a-select v-model="field" @change="changeField" style="width: 200px">
                <a-select-option v-for="(item, index) in fieldList" :key="index" :value="item.value">{{ item.title }}</a-select-option>
              </a-select>
              <!-- <a-button type="primary" @click="showAllSchedule">查看所有</a-button>
              <a-button type="primary" @click="showMonthSchedule">查看今月</a-button>
              <a-button type="primary" @click="showTodaySchedule">查看今日</a-button> -->
              <!-- <a-button type="primary" @click="multiDelete">多选删除</a-button> -->
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
      <a-row style="margin-bottom:20px">
        <a-form :label-col="labelCol">
          <template v-if="advanced">
            <a-col :span="8">
              <a-form-item label="筛选日期" :wrapper-col="{ span: 18 }">
                <a-range-picker :show-time="{ format: 'HH:mm' }" format="YYYY-MM-DD HH:mm" :placeholder="['开始时间', '结束时间']" @ok="handleTimeChange" />
              </a-form-item>
            </a-col>
            <a-col :span="8">
              <a-form-item label="预约状态" :wrapper-col="{ span: 14 }">
                <default-input-tree ref="status" @change="handleStatusChange" :treePlaceholder="'筛选预约状态'" :isLoadTree="'loadScheduleStatusTree'"></default-input-tree>
              </a-form-item>
            </a-col>
            <a-col :span="4">
              <a-space>
                <a-button type="primary" @click="search">查询</a-button>
                <a-button @click="reset">重置</a-button>
              </a-space>
            </a-col>
          </template>
        </a-form>
      </a-row>
    </div>
    <a-table
      ref="TableInfo"
      :columns="columns"
      :data-source="currentSchedule"
      :rowKey="record => record.id"
      :pagination="pagination"
      :loading="loading"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange
      }"
      @change="handleTableChange"
    >
      <span slot="bookablestatus" slot-scope="text, record">
        {{ bookablestatusList[text].title }}
        <!-- <a-tag v-for="tag in bookablestatus" :key="tag" :color="tag === 0 ? 'red' : 'green'"> -->
        <!-- {{ tag == 0 ? '锁定' : tag == 1 ? '开启' : tag == 2 ? '拼满' : '包场' }} -->
        <!-- {{ tag }}
          {{ tag == 0 ? '锁定' : '开启' }}
        </a-tag> -->
      </span>
      <span slot="courtname" slot-scope="text, record">
        {{ getName(record) }}
      </span>
      <template slot="bookabletime" slot-scope="text, record, index">
        {{ text.split(' ')[0] }}
      </template>
      <template slot="openingHour" slot-scope="text, record, index">
        {{ record.openHourTime + '-' + record.endHour }}
      </template>
      <template slot="bookableprice" slot-scope="text, record">
        <span v-if="record.bookablestatus == 1">
          <editable-cell :text="text" @change="onCellChange(record.id, 'bookableprice', $event)" />
        </span>
        <span v-else>
          {{ text }}
        </span>
      </template>
      <template slot="teambuyingmax" slot-scope="text, record">
        <span v-if="record.bookablestatus == 1">
          <editable-cell :text="text" @change="onCellChange(record.id, 'teambuyingmax', $event)" />
        </span>
        <span v-else>
          {{ text }}
        </span>
      </template>
      <template slot="operation" slot-scope="text, record">
        <span v-if="record.bookablestatus == 1">
          <a @click="changeBookableStatus(record)">设为锁定</a>
          <a-divider type="vertical"></a-divider>
          <a @click="changedTarget(record)">编辑</a>
        </span>
        <!-- <a-popconfirm title="确认删除?" @confirm="() => onDelete(record.id)">
          <a-divider type="vertical"></a-divider>
          <a style="color:red" href="javascript:;">删除</a>
        </a-popconfirm> -->
      </template>
    </a-table>
    <a-modal :visible="rangeDateVisible" title="改变预约场地的日期和时间" :destroyOnClose="true" :maskClosable="false" :width="550" :footer="null" @cancel="cancalRangeDateVisible">
      <a-form-item label="选择日期和时间" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
        <a-range-picker
          :allowClear="false"
          :default-value="defaultTargetRange"
          :show-time="{ format: 'HH:mm' }"
          format="YYYY-MM-DD HH:mm"
          :placeholder="['开始时间', '结束时间']"
          @ok="changeRangeDone"
        />
      </a-form-item>
    </a-modal>
  </a-card>
</template>
<script>
const labelCol = {
  xl: { span: 4 },
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol = {
  xl: { span: 20 },
  xs: { span: 24 },
  sm: { span: 12 }
}
const bookablestatusList = [
  { title: '结束', value: 0 },
  { title: '开启', value: 1 },
  { title: '拼满', value: 2 },
  { title: '包场', value: 3 }
]
import moment from 'moment'
import dayjs from 'dayjs'
import { mapState } from 'vuex'
export default {
  components: {
    EditableCell: () => import('@/components/editablecell/EditableCell'),
    DefaultInputTree: () => import('~/tool/DefaultInputTree')
  },
  created() {
    this.fetch()
    this.getFieldList()
  },
  data() {
    return {
      labelCol,
      wrapperCol,
      form: {
        // 初始化常量
        initDate: '',
        initOpenTime: '',
        initService: 30,
        initPrice: 0,
        initGroup: 0,
        initscheduleGap: 0
      },
      rangeDateVisible: false, // 改变场地日程日期弹窗
      changedTargetInfo: null, // 改变场地日程信息
      defaultTargetRange: null, // 需要被改变的日程时间
      fieldList: [], // 场地列表
      field: 0, // 场地标识
      currentSchedule: [], // 当前日程列表
      allSchedule: [], // 全部日程列表
      advanced: false,
      loading: false,
      selectedRowKeys: [],
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      courtCategoryList: [
        { title: '30分钟', value: 30 },
        { title: '60分钟', value: 60 },
        { title: '2小时', value: 120 }
      ],
      bookablestatusList,
      courtcategory: 30,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      columns: [
        {
          title: '球场名称',
          dataIndex: 'courtname',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'courtname' }
        },
        {
          title: '预约价格',
          dataIndex: 'bookableprice',
          align: 'center',
          width: 100,
          scopedSlots: { customRender: 'bookableprice' }
        },
        {
          title: '拼单人数',
          dataIndex: 'teambuyingmax',
          align: 'center',
          width: 130,
          scopedSlots: { customRender: 'teambuyingmax' }
        },
        {
          title: '开放日期',
          dataIndex: 'bookabletime',
          width: 150,
          align: 'center',
          scopedSlots: { customRender: 'bookabletime' }
        },
        {
          title: '开放时间',
          dataIndex: 'openingHour',
          width: 200,
          align: 'center',
          scopedSlots: { customRender: 'openingHour' }
        },

        {
          title: '当前拼单人数',
          dataIndex: 'currentbuying',
          align: 'center',
          width: 130,
          scopedSlots: { customRender: 'currentbuying' }
        },
        {
          title: '预约状态',
          dataIndex: 'bookablestatus',
          align: 'center',
          width: 150,
          scopedSlots: { customRender: 'bookablestatus' }
        },
        // {
        //   title: '创建时间',
        //   dataIndex: 'createtime',
        //   align: 'center',
        //   width: 200,
        //   scopedSlots: { customRender: 'createtime' }
        // },
        // {
        //   title: '更新时间',
        //   dataIndex: 'updatetime',
        //   align: 'center',
        //   width: 200,
        //   scopedSlots: { customRender: 'updatetime' }
        // },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 230,
          scopedSlots: { customRender: 'operation' }
        }
      ]
    }
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    })
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.query && to.query.type) {
          if (to.query.type === 'all') {
            this.showTodaySchedule()
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    // 根据时间筛选
    handleTimeChange(value) {
      if (value) {
        this.queryParams.bookabletime = dayjs(value[0]).format('YYYY-MM-DD')
        this.queryParams.openHourTime = dayjs(value[0]).format('HH:mm')
        this.queryParams.endHour = dayjs(value[1]).format('HH:mm')
      }
    },
    // 根据预约状态筛选
    handleStatusChange(value) {
      this.queryParams.bookablestatus = value
      if (value == undefined || value === -1) {
        delete this.queryParams['bookablestatus']
      }
    },

    // 展开更多
    toggleAdvanced() {
      this.advanced = !this.advanced
      if (!this.advanced) {
        this.queryParams.bookabletime = ''
        this.queryParams.openHourTime = ''
        this.queryParams.endHour = ''
      }
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
    // 重置搜索
    reset() {
      // 取消选中
      this.selectedRowKeys = []
      // 重置分页
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      if (this.paginationInfo) {
        this.paginationInfo.current = this.pagination.defaultCurrent
        this.paginationInfo.pageSize = this.pagination.defaultPageSize
      }
      this.filteredInfo = null
      this.sortedInfo = null
      this.queryParams = {}
      if (this.advanced) {
        this.$refs.status.reset()
      }
      this.fetch()
    },
    // 多选
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 多选删除
    async multiDelete() {
      if (this.selectedRowKeys.length > 0) {
        this.selectedRowKeys.forEach(id => {
          this.currentSchedule = this.currentSchedule.filter(item => item.id !== id)
          this.allSchedule = this.allSchedule.filter(item => item.id !== id)
        })
        const Ids = this.selectedRowKeys.length === 1 ? this.selectedRowKeys[0] : this.selectedRowKeys.join(',')
        this.selectedRowKeys = []
        await this.$delete(`/bookableOrderInformation/deletebyIDS/${Ids}`)
        this.$message.success('删除成功')
        this.fetch()
      } else {
        this.$message.error('至少选择一项进行删除')
      }
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      // 将这三个参数赋值给Vue data，用于后续使用
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
    // 获取全部
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
      this.$get(`/bookableOrderInformation/list`, {
        ...params,
        gymandstadiumid: this.user.email
      }).then(async res => {
        let pagination = { ...this.pagination }
        pagination.total = res.data.data.total
        this.pagination = pagination
        let dataSource = []
        if (res.data.data.rows) {
          console.log(res.data.data.rows)
          // const rows = res.data.data.rows
          // let arr = []
          // rows.forEach(item => {
          //   const openHoursTemp = `${dayjs(item.bookabletime).format('YYYY-MM-DD')} ${item.openHourTime}:00`
          //   const openHours = dayjs(openHoursTemp)
          //   const params = {
          //     ...item,
          //     bookablestatus: item.bookablestatus == 0 ? 0 : dayjs().isBefore(dayjs(openHours)) ? 1 : 0
          //   }
          //   arr.push(params)
          // })
          dataSource = res.data.data.rows
        }
        this.currentSchedule = dataSource
      })
      this.loading = false
    },
    selectData(params = {}) {
      this.loading = true
      // 如果分页信息为空，则设置为默认值
      this.$refs.TableInfo.pagination.current = this.pagination.defaultCurrent
      this.$refs.TableInfo.pagination.pageSize = this.pagination.defaultPageSize
      params.pageSize = this.pagination.defaultPageSize
      params.pageNum = this.pagination.defaultCurrent
      this.$get('/bookableOrderInformation/ListLike', {
        ...params,
        gymandstadiumid: this.user.email
      }).then(res => {
        let dataSource = []
        pagination.total = res.data.data.total
        if (res.data.data.rows) {
          const pagination = { ...this.pagination }
          dataSource = res.data.data.rows
          this.pagination = pagination
        }
        this.dataSource = dataSource
      })
      this.loading = false
    },
    // 获取所有预约信息
    async getFieldList() {
      const stadiumField = await this.$get('/gymCourt/list', {
        gymandstadiumid: this.user.email
      })
      if (stadiumField.data.data.rows) {
        this.fieldList = stadiumField.data.data.rows.map(item => ({ title: item.courtname, value: item.id }))
      }
      this.fieldList.unshift({ title: '全部', value: 0 })
    },
    // 筛选这个场地
    showAllSchedule() {
      this.currentSchedule = this.field === 0 ? this.allSchedule : this.allSchedule.filter(item => item.gymcourtid === this.field)
    },
    // 筛选这个月
    showMonthSchedule() {
      this.currentSchedule = this.allSchedule.filter(item => {
        if (this.field === 0) {
          return item
        } else {
          return item.gymcourtid === this.field && dayjs().format('YYYY-MM') === dayjs(item.bookabletime).format('YYYY-MM')
        }
      })
    },
    // 筛选今天
    showTodaySchedule() {
      this.currentSchedule = this.allSchedule.filter(item => {
        if (this.field === 0) {
          return dayjs().format('YYYY-MM-DD') === dayjs(item.bookabletime).format('YYYY-MM-DD')
        } else {
          return item.gymcourtid === this.field && dayjs().format('YYYY-MM-DD') === dayjs(item.bookabletime).format('YYYY-MM-DD')
        }
      })
      this.pagination.total = this.currentSchedule.length
    },
    // 重置初始化常量
    resetDefaultGap() {
      this.form = Object.assign({}, { initDate: '', initOpenTime: '', initService: 30, initPrice: 0, initGroup: 0, initscheduleGap: 0 })
    },
    onCellChange(id, dataIndex, value) {
      const currentSchedule = [...this.currentSchedule]
      const target = this.currentSchedule.find(item => item.id === id)
      if (target) {
        target[dataIndex] = parseInt(value)
        this.currentSchedule = currentSchedule
        this.onChange(id)
      }
    },
    // 单选删除
    async onDelete(id) {
      this.currentSchedule = this.currentSchedule.filter(item => item.id !== id)
      this.allSchedule = this.allSchedule.filter(item => item.id !== id)
      this.$delete(`/bookableOrderInformation/deletebyIDS/${id}`)
    },
    // 添加预约时段
    async handleAddCell() {
      if (this.field === 0) {
        this.$message.error('未选择场地')
        return
      }
      if (this.form.initPrice === 0) {
        this.$message.error('未设定预约价格')
        return
      }
      if (this.form.initGroup === 0) {
        this.$message.error('未设定拼单人数')
        return
      }
      if (this.form.initOpenTime == '' || this.form.initDate == '') {
        this.$message.error('未选择预约日期或时间')
        return
      }
      let params = {
        bookableprice: this.form.initPrice,
        teambuyingmax: this.form.initGroup,
        gymcourtid: this.field,
        gymandstadiumid: this.user.email
      }
      params['openHourTime'] = dayjs(this.form.initOpenTime).format('HH:mm')
      params['endHour'] = dayjs(this.form.initOpenTime)
        .add(this.form.initService, 'minute')
        .format('HH:mm')
      params['bookabletime'] = dayjs(this.form.initDate)
      await this.$post('/bookableOrderInformation', { ...params })
      this.form.initOpenTime = dayjs(this.form.initOpenTime)
        .add(this.form.initService, 'minute')
        .add(this.form.initscheduleGap, 'minute')
      this.queryParams.gymcourtid = this.field
      this.fetch({ ...this.queryParams })
      this.$message.success('添加成功')
    },
    // 更新单元格内容
    onChange(id) {
      const target = this.currentSchedule.find(item => item.id === id)
      this.$post('/bookableOrderInformation/update', {
        id: target.id,
        teambuyingmax: target.teambuyingmax,
        bookableprice: target.bookableprice
      }).then(() => {
        this.$message.success('更新成功')
      })
    },
    // 更换预约日期
    changedTarget(record) {
      this.changedTargetInfo = record
      this.rangeDateVisible = true
      // element的日期要求用moment.js来包装 比较傻逼，个人推荐使用dayjs
      const open = moment(`${record.bookabletime.split(' ')[0]} ${record.openHourTime}`, 'YYYY-MM-DD HH:mm')
      const end = moment(`${record.bookabletime.split(' ')[0]} ${record.endHour}`, 'YYYY-MM-DD HH:mm')
      this.defaultTargetRange = [open, end]
    },
    // 快速切换预约状态
    async changeBookableStatus(record) {
      await this.$post('/bookableOrderInformation/update', {
        id: record.id,
        bookablestatus: 2
      })
      this.$message.success('已设定该场地的预约状态为拼满状态')
      this.fetch()
    },
    cancalRangeDateVisible() {
      this.rangeDateVisible = false
    },
    // 获取场地名字
    getName(record) {
      // 不要在模板语法中使用异步请求
      // this.$get('/gymCourtById', { id: record.gymcourtid }).then(res => {
      //   return res.data.data.courtname
      // })
      const field = this.fieldList.find(item => item.value === record.gymcourtid)
      return field.title
    },
    // 更新预约信息日期
    async changeRangeDone(dates) {
      await this.$post('/bookableOrderInformation/update', {
        id: this.changedTargetInfo.id,
        bookabletime: new Date(moment(dates[0]).format('YYYY-MM-DD HH:mm:ss')),
        openHourTime: moment(dates[0]).format('HH:mm'),
        endHour: moment(dates[1]).format('HH:mm')
      })
      this.changedTargetInfo = null
      this.defaultTargetRange = []
      this.rangeDateVisible = false
      this.$message.success('更新成功')
      this.fetch()
    },
    // 切换查看不同场地内容
    async changeField(value, option) {
      console.log(value)
      if (value !== 0) {
        this.queryParams.gymcourtid = value
        this.fetch(value === 0 ? {} : this.queryParams)
      } else {
        this.queryParams.gymcourtid = ''
        this.fetch()
      }
    }
  }
}
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 10px;
}
</style>
