<template>
  <div>
    <a-modal
      title="编辑商品属性信息"
      :footer="null"
      :visible="visible"
      :width="1300"
      :destroyOnClose="true"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
      @cancel="() => $emit('close')"
    >
      <div style="margin:20px">
        <a-row type="flex" justify="space-between">
          <a-col :span="10">
            <span>
              商品属性开关显示：
              <a-switch v-model="isattributes" :loading="switchLoading" @change="changeIsattributes" />
            </span>
          </a-col>
          <a-col>
            <a @click="() => (addAttributeVisible = true)">添加商品属性</a>
          </a-col>
        </a-row>
      </div>
      <a-card>
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
          <span slot="attributeimgurl" slot-scope="text, record">
            <img style="width: 100px; heigth: auto" :src="record.attributeimgurl" />
          </span>
          <span slot="appendfreight" slot-scope="text, record">{{ text }}元</span>
          <span slot="price" slot-scope="text, record">{{ text }}元</span>
          <span slot="isdisplayAction" slot-scope="text, record">
            <span>
              <a-switch
                v-model="record.isdisplay == 1 ? true : false"
                :loading="switchAttributeDisplayLoading"
                @change="
                  checked => {
                    onChangeDisplay(checked, record)
                  }
                "
              />
            </span>
          </span>
          <span slot="action" slot-scope="text, record">
            <a-button type="primary" @click="addCoupon(record)">加入提货表</a-button>

            <a-button type="primary" @click="copyAttribute(record)">
              复刻
            </a-button>
            <a-popconfirm title="确认删除该商品属性" @confirm="deleteAttribute(record)">
              <a-button type="danger">
                删除
              </a-button>
            </a-popconfirm>
          </span>
        </a-table>
      </a-card>
    </a-modal>
    <a-modal
      title="添加商品属性"
      :visible="addAttributeVisible"
      :width="500"
      :destroyOnClose="true"
      :maskClosable="false"
      :confirm-loading="addConfirmLoading"
      @ok="addAttribute"
      @cancel="
        () => {
          addAttributeVisible = false
          copyTarget = null
        }
      "
    >
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="属性图标" required>
          <image-uploader @upload_fileList="getUploadFileList" :files="files"></image-uploader>
        </a-form-item>
        <a-form-item label="属性名">
          <a-input
            placeholder="请输入属性名称"
            v-decorator="[
              'attributesname',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入属性名称'
                  }
                ]
              }
            ]"
          ></a-input>
        </a-form-item>

        <a-form-item label="价格">
          <a-input-number
            :step="0.01"
            v-decorator="[
              'price',
              {
                initialValue: '0.01',

                rules: [
                  {
                    required: true,
                    message: '请选择'
                  }
                ]
              }
            ]"
            :min="0.01"
            :max="99999999"
          />
        </a-form-item>
        <a-form-item label="追加运费">
          <a-input-number
            :step="0.01"
            v-decorator="[
              'appendfreight',
              {
                initialValue: '0.01'
              }
            ]"
            :min="0.01"
            :max="99999999"
          />
        </a-form-item>
        <a-form-item label="是否显示">
          <a-radio-group
            v-decorator="[
              'isdisplay',
              {
                initialValue: '1'
              }
            ]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const labelCol = {
  xl: { span: 5 },
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol = {
  xl: { span: 19 },
  xs: { span: 24 },
  sm: { span: 12 }
}
const columns = [
  {
    title: '属性图',
    width: 100,
    dataIndex: 'attributeimgurl',
    align: 'center',
    scopedSlots: { customRender: 'attributeimgurl' }
  },
  {
    title: '属性名',
    width: 100,
    dataIndex: 'attributesname',
    align: 'center',
    ellipsis: true
  },
  {
    title: '追加运费',
    width: 100,
    dataIndex: 'appendfreight',
    align: 'center',
    ellipsis: true,
    scopedSlots: { customRender: 'appendfreight' }
  },
  {
    title: '价格',
    width: 100,
    dataIndex: 'price',
    align: 'center',
    scopedSlots: { customRender: 'price' }
  },

  {
    title: '显示控制',
    width: 100,
    dataIndex: 'isdisplayAction',
    align: 'center',
    scopedSlots: { customRender: 'isdisplayAction' }
  },
  {
    title: '操作',
    width: 200,
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
import { mapMutations, mapState } from 'vuex'
import { restoreUrl, formatUrl } from '@/utils/urlTool'
import DefaultInputTree from '~/tool/DefaultInputTree.vue'
import ImageUploader from '~/tool/ImageUploader.vue'
export default {
  components: {
    DefaultInputTree,
    ImageUploader
  },
  props: {
    attributesVisible: {
      type: Boolean,
      default: false
    },
    targetAttributesId: {
      type: Number,
      default: 0
    }
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
      targetGoodInfo: null,
      pagination: {
        pageSizeOptions: ['10', '20', '30', '40', '100'],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) => `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },

      switchLoading: false,
      switchAttributeDisplayLoading: false,
      labelCol,
      wrapperCol,
      form: this.$form.createForm(this),
      confirmLoading: false,
      addConfirmLoading: false,
      isattributes: 0,
      goodsAttribute: null,
      addAttributeVisible: false,
      urlFiles: [],
      files: [],
      copyTarget: null
    }
  },
  computed: {
    ...mapState({
      coupon: state => state.account.coupon,
      targetCoupon: state => state.account.targetCoupon
    }),
    visible() {
      return this.attributesVisible
    }
  },
  watch: {
    targetAttributesId: {
      async handler(id) {
        console.info('需要编辑查看的商品属性id：', id)
        await this.getProductById(id)
        await this.fetch()
      },
      // immediate: true,
      deep: true
    }
  },
  methods: {
    ...mapMutations({ setCoupon: 'account/setCoupon', setTargetCoupon: 'account/setTargetCoupon' }),

    // 选择列
    onSelectChange(selectedRowKeys) {
      console.info('选择了: ', selectedRowKeys)
      this.selectedRowKeys = selectedRowKeys
    },
    // 控制开关
    handleOk() {
      this.form.validateFields((err, values) => {
        if (err) {
          console.warn('检查错误信息', err)
          return
        }
        const params = {
          id: targetAttributesId,
          ...values
        }
        console.info('更新商品属性信息：', params)
        this.$post('/giftkey/update', { ...params }).then(() => {
          this.$message.success('更新成功')
          this.$emit('close')
        })
      })
    },
    // 判断是否开启
    async getProductById(id) {
      let res = await this.$get('/productById', { id: id })
      if (res.data.data) {
        const result = res.data.data
        this.goodsAttribute = res.data.data
        this.isattributes = result.isattributes == 1 ? true : false
      }
    },
    //控制属性展示
    async changeIsattributes(judgeIsattributes) {
      const params = {
        id: this.goodsAttribute.id,
        isattributes: judgeIsattributes ? 1 : 0
      }
      try {
        await this.$post('/product/update', { ...params })
        this.$message.success('切换显示属性状态成功')
      } catch (error) {
        this.$message.error('切换显示属性状态失败')
      }
    },
    //切换属性的显示控制
    async onChangeDisplay(checked, record) {
      this.switchAttributeDisplayLoading = true
      const params = {
        id: record.id,
        isdisplay: checked ? 1 : 0
      }
      await this.$post('/productAttribute/update', { ...params })
      this.$message.success('修改成功')
      this.fetch()
      this.switchAttributeDisplayLoading = false
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

      this.$get('/productAttribute/list', {
        ...params
      }).then(res => {
        const pagination = { ...this.pagination }
        pagination.total = res.data.data.total
        this.pagination = pagination
        let dataSource = []
        if (res.data.data.rows) {
          let result = res.data.data.rows
          let data = result.filter(item => {
            return item.productid == this.goodsAttribute.id
          })
          dataSource = data.map(item => ({ ...item, attributeimgurl: restoreUrl(JSON.parse(item.attributeimgurl))[0] }))
          // for (let i = 0; i < data.length; i++) {
          //   let item = data[i]
          //   item['attributeimgurl'] = restoreUrl(JSON.parse(item.attributeimgurl))[0]
          //   dataSource.push(item)
          // }
        }
        this.dataSource = dataSource
      })
      this.loading = false
    },
    async addAttribute() {
      this.form.validateFields((err, values) => {
        if (err) {
          console.warn('检查错误信息', err)
          return
        }
        if (this.urlFiles.length == 0) {
          console.warn('未上传属性图片')
          this.$message.error('未上传属性图片')
          return
        }
        const params = {
          ...values,
          attributeimgurl: JSON.stringify(formatUrl(this.urlFiles)),
          productid: this.goodsAttribute.id
        }
        console.info('新增属性信息：', params)
        this.$post('/productAttribute', { ...params }).then(() => {
          this.fetch()
          this.$message.success('新增成功')
          this.addAttributeVisible = false
        })
      })
    },
    // 导出excel表
    // exportExcel() {
    //   const params = {
    //     pageNum: 1,
    //     pageSize: 10
    //   }
    //   this.$get('/product/excel', { ...params }).then(res => {
    //     const total = res.data.data.total
    //     window.location.href = `https://javabangbanghappy.lanfriend.cn/product/excel?pageNum=1&pageSize=${total}`
    //   })
    // },
    // 删除商品
    deleteGood(record) {
      let dataSource = this.dataSource.filter(item => {
        return item.id !== record.id
      })
      this.dataSource = dataSource
      this.$message.success('删除成功')
      this.$get('/product/deletebyID', { id: record.id })
    },
    //从子组件中获取图片信息
    getUploadFileList(record) {
      this.urlFiles = record
    },
    // 加入提货卡
    async addCoupon(record) {
      if (this.targetCoupon == null) {
        this.$message.error('未指定提货表')
        return
      }
      // 当前选中提货表
      let targetCoupon = this.targetCoupon
      // 缓存中所有提货表
      let localStorageCoupon = [...this.coupon]
      // 缓存中当前需要被更改的提货表
      let beChangedTargetCoupon = localStorageCoupon.filter(item => item.id == targetCoupon.id)

      // 判断缓存中是否存在同一个商品属性
      let sameTargetProductAttribute = beChangedTargetCoupon[0].productinformation.filter(item => {
        if (item.productAttribute != null) {
          return item.productAttribute.id == record.id
        }
      })
      // 获取提货表中存放商品信息的对象数组
      const params = {
        id: targetCoupon.id,
        giftkeystatus: 0,
        giftkey: targetCoupon.giftkey,
        giftname: targetCoupon.giftname
      }

      // 缓存中存在同一个商品 则对数量进行+1处理
      if (sameTargetProductAttribute.length > 0) {
        // 对商品数量进行 +1 处理
        let targetProductAttribute = sameTargetProductAttribute[0]
        targetProductAttribute['count'] += 1
        // 缓存中的其他商品属性
        let unSameProductAttribute = beChangedTargetCoupon[0].productinformation.filter(item => {
          if (item.productAttribute != null) {
            return item.productAttribute.id !== record.id
          } else {
            return item
          }
        })

        console.info('unSameProductAttribute', unSameProductAttribute)
        params['productinformation'] = [...unSameProductAttribute, targetProductAttribute]
      } else {
        // 查询父级商品
        let productInfoRes = await this.$get('/productById', { id: record.productid })
        let productinformationArr = {
          product: { ...productInfoRes.data.data, productionimgurl: JSON.stringify(formatUrl([{ url: productInfoRes.data.data.productionimgurl }])) },
          productAttribute: { ...record, attributeimgurl: JSON.stringify(formatUrl([{ url: record.attributeimgurl }])) },
          count: 1
        }
        params['productinformation'] = [...beChangedTargetCoupon[0].productinformation, productinformationArr]
      }
      // 缓存中其他不需要被更改的提货表
      let unBeChangedCoupon = localStorageCoupon.filter(item => item.id !== targetCoupon.id)
      this.setCoupon([...unBeChangedCoupon, params])
      this.setTargetCoupon(params)
      this.$message.success('添加进提货表成功')
    },
    // 复刻商品属性
    copyAttribute(record) {
      this.addAttributeVisible = true
      this.files = [
        {
          uid: record.id,
          name: `${record.id}.png`,
          status: 'done',
          url: record.attributeimgurl
        }
      ]
      this.$nextTick(() => {
        this.form.setFieldsValue({
          attributesname: record.attributesname,
          price: record.price,
          appendfreight: record.appendfreight,
          isdisplay: record.isdisplay
        })
      })
    },
    // 删除商品属性
    deleteAttribute(record) {
      let dataSource = this.dataSource.filter(item => item.id !== record.id)
      this.dataSource = dataSource
      this.$message.success('删除成功')
      this.$get('/productAttribute/deletebyID', { id: record.id })
    }
  }
}
</script>
