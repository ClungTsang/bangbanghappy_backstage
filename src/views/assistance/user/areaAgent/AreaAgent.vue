<template>
  <div>
    <a-table
      :columns="columns"
      :pagination="pagination"
      :data-source="dataSource"
      :loading="loading"
      @change="handleTableChange"
    >
      <span
        slot="action"
        slot-scope="text, record"
      >
        <a-popconfirm
          title="确定删除该申请"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除申请</a>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>
        <a @click="showPicModal(record)">查看图片</a>
        <a-divider type="vertical"></a-divider>
        <a @click="openDesModal(record)">申请通过</a>
      </span>
    </a-table>
    <a-modal
      title="查看图片"
      :destroyOnClose="true"
      :maskClosable="false"
      :visible="showPic"
      @ok="closePicModal"
      @cancel="closePicModal"
    >
      <div
        v-for="(item, index) in JSON.parse(picList)"
        :key="index"
      >
        <img
          style="width: 450px; heigth: auto; margin-bottom: 20px"
          :src="item"
        />
      </div>
    </a-modal>
    <a-modal
      title="提示"
      :visible="showDescription"
      :destroyOnClose="true"
      :maskClosable="false"
      @ok="confirmDesModal"
      @cancel="closeDesModal"
    >
      <a-form>
        <a-form-item
          label="区域代理列表"
          required
        >
          <a-select
            mode="multiple"
            placeholder="请选择"
            @change="handleAreaChange"
          >
            <a-select-option
              v-for="option in selectOptions"
              :key="option.value"
            >
              {{ option.title }}
            </a-select-option>
          </a-select>
          <!-- <default-input-tree
            @change="handleAreaChange"
            ref="agentAreaTree"
            :treePlaceholder="'请选择'"
            :isLoadTree="'loadAgentArea'"
          ></default-input-tree> -->
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  // { title: "id", dataIndex: "id" },
  {
    title: '申请人',
    width: 120,
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '联系方式',
    width: 130,
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '申请理由',
    width: 200,
    dataIndex: 'apply',
    align: 'center',

    ellipsis: true,
  },
  {
    title: '申请区域',
    width: 200,
    dataIndex: 'address',
    align: 'center',

    ellipsis: true,
  },
  { title: '申请时间', width: 200, dataIndex: 'createtime', align: 'center' },
  {
    title: '操作',
    width: 300,
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' },
  },
]
import DefaultInputTree from '~/tool/DefaultInputTree.vue'

export default {
  components: {
    DefaultInputTree,
  },
  data() {
    return {
      columns,
      dataSource: [],

      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`,
      },
      loading: false,
      form: this.$form.createForm(this),
      question: null,
      showPic: false,
      showDescription: false,
      // 当前图片
      picList: null,
      // 区域信息
      agentdescription: '',
      // 当前用户
      currentData: null,
      selectOptions: [],
      selectedOptionsIds: [],
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current,
      })
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true
      this.dataSource = []
      this.$get('/backend/notice/selectAllByNoticeStatus', {
        // Authentication: token,
        pageSize: 10,
        noticestatus: 3,
        ...params,
      }).then((res) => {
        let pagination = { ...this.pagination }
        pagination.total = res.data.data.total
        this.loading = false
        // 遍历数组
        let dataSource = res.data.data.rows
        dataSource.forEach((item) => {
          let content = JSON.parse(item.content)
          let title = item.title.split(' ')
          item.apply = content[0]
          item.address = content[1]
          item.name = title[0]
          item.phone = title[1]
          this.dataSource.push(item)
        })
        this.pagination = pagination
      })
    },
    // 删除代理申请
    confirmDelete(record) {
      this.$delete('/backend/notice', { id: record.id }).then(() => {
        const dataSource = [...this.dataSource]
        this.dataSource = dataSource.filter((item) => item.id !== record.id)
        this.$message.success('删除成功')
      })
    },
    // 查看图片
    showPicModal(record) {
      console.log(record)
      this.picList = record.picUrl
      this.showPic = true
    },
    // 关闭图片
    closePicModal() {
      this.showPic = false
      this.picList = null
    },
    // 打开modal
    openDesModal(record) {
      this.getSelectOptions()
      this.showDescription = true
      this.currentData = record
    },
    // 通过申请
    async confirmDesModal() {
      let arr = this.currentData.title.split(' ')
      const agentdescription = []

      // this.selectOptions.forEach(options => {
      //   this.selectedOptionsIds.forEach(selectedId => {
      //     if (options.id == selectedId) {
      //       console.log(options);

      //       agentdescription.push(options);
      //     }
      //   });
      // });

      const params = {
        id: arr[2],
        agent: 1,
        agentdescription: JSON.stringify(this.selectedOptionsIds),
      }
      await this.$post('/wechatcustomer/update', { ...params })
      this.$message.success('申请通过')

      this.$delete('/backend/notice', { id: this.currentData.id })
      // const dataSource = [...this.dataSource];
      let dataSource = this.dataSource.filter(
        (item) => item.id !== this.currentData.id
      )
      this.showDescription = false
      this.currentData = null
      this.dataSource = dataSource
    },
    // 关闭申请
    closeDesModal() {
      this.showDescription = false
      this.currentData = null
    },
    // 分类方式
    handleAreaChange(value) {
      console.log(`选择了：`, value)
      this.selectedOptionsIds = value
    },
    // 获取区域列表
    getSelectOptions() {
      this.$get('/agentInformation/list').then((res) => {
        const result = res.data.data.rows
        result.forEach((item) => {
          let params = {
            title: item.agentinformationdescription,
            value: item.id,
          }
          this.selectOptions.push(params)
        })
      })
    },
  },
}
</script>
<style></style>
