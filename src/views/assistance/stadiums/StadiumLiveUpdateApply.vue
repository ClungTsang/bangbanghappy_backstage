<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource" :pagination="pagination" :loading="loading" @change="handleTableChange">
      <span slot="action" slot-scope="text, record">
        <a-popconfirm title="确定删除该申请" ok-text="确定" cancel-text="取消" @confirm="confirmDelete(record)">
          <a>删除申请</a>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>
        <a @click="apply(record)">申请通过</a>
      </span>
    </a-table>
    <!-- <a-modal :visible="showPic" title="查看图片" @ok="closePicModal" @cancel="closePicModal" :footer="null">
      <div v-for="(item, index) in JSON.parse(picList)" :key="index">
        <img style="width: 450px; heigth: auto; margin-bottom: 20px" :src="item" />
      </div>
    </a-modal> -->
    <a-modal :visible="applyVisible" title="选择分配球场" :width="500" :destroyOnClose="true" :maskClosable="false" okText="完成，分配球馆给该用户" @ok="confirmApply" @cancel="applyVisible = false">
      <a-form :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <a-form-item label="野球场名称" required>
          <default-input-tree
            ref="categoryTree"
            @change="handleCategoryChange"
            :defaultValue="defaultValue"
            :treePlaceholder="'请选择野球场'"
            :isLoadTree="'loadOuterStadiumTree'"
          ></default-input-tree>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  {
    title: '申请人',
    width: 120,
    dataIndex: 'realname',
    align: 'center'
  },
  {
    title: '联系方式',
    width: 130,
    dataIndex: 'phonenum',
    align: 'center'
  },
  {
    title: '申请理由',
    width: 200,
    dataIndex: 'title',
    align: 'center',
    ellipsis: true
  },
  {
    title: '申请球场',
    width: 300,
    dataIndex: 'field',
    align: 'center',
    ellipsis: true
  },
  { title: '申请时间', width: 200, dataIndex: 'createtime', align: 'center' },
  {
    title: '操作',
    width: 200,
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    DefaultInputTree: () => import('~/tool/DefaultInputTree.vue')
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
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      loading: false,
      form: this.$form.createForm(this),
      question: null,
      showPic: false,
      picList: null,
      selectOuterStadium: null,
      applyVisible: false,
      targetOuterStadium: null
    }
  },
  mounted() {
    this.fetch()
  },
  methods: {
    // 选择球馆方式
    handleCategoryChange(value) {
      this.selectOuterStadium = value
    },
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination }
      pager.current = pagination.current
      this.pagination = pager
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current
      })
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true
      this.$get('/notice/list', {
        noticestatus: 2,
        ...params
      }).then(res => {
        let pagination = { ...this.pagination }
        pagination.total = res.data.data.total
        // 遍历数组
        let dataSource = []
        if (res.data.data.rows) {
          res.data.data.rows.forEach(item => {
            let content = {}
            let data = JSON.parse(item.content)
            for (const key in data) {
              content[key] = data[key]
            }
            dataSource.push(Object.assign(item, content))
          })
        }
        this.pagination = pagination
        this.dataSource = dataSource
      })
      this.loading = false
    },

    // 删除入驻申请
    async confirmDelete(record) {
      const dataSource = this.dataSource
      this.dataSource = dataSource.filter(item => item.id !== record.id)
      this.$get(`/notice/deletebyID/`, { id: record.id })
      this.$message.success('删除成功')
    },
    async confirmApply() {
      if (this.selectOuterStadium < 0) {
        this.$message.error('未选择球场')
        return
      }
      const res = await this.$get('/gymAndStadium/list', { category: 1 })
      const field = res.data.data.rows.find(item => item.courtname == this.targetOuterStadium.field)
      let originOpenids = []
      if (field.liveupdateplayeropenid && JSON.parse(field.liveupdateplayeropenid).length > 0) {
        originOpenids = JSON.parse(field.liveupdateplayeropenid)
        let judgeOpenids = originOpenids.map(item => item.split('-')[0])
        // 判断是否重复添加
        if (judgeOpenids.some(item => item == record.openid)) {
          this.$message.error('该用户已经是该球场的实时更新者')
          return
        }
      }
      await this.$post('/gymAndStadium/update', { id: field.id, liveupdateplayeropenid: JSON.stringify([...originOpenids, this.targetOuterStadium.openid]) })
      this.$message.success('绑定球场商家成功')
      const dataSource = this.dataSource
      this.dataSource = dataSource.filter(item => item.id !== this.targetOuterStadium.id)
      this.$get(`/notice/deletebyID/`, { id: this.targetOuterStadium.id })
      this.applyVisible = false
    },
    // 申请通过
    apply(record) {
      this.targetOuterStadium = record
      this.applyVisible = true
    },
    // 关闭图片
    closePicModal() {
      this.showPic = false
      this.picList = null
    }
  }
}
</script>
<style></style>
