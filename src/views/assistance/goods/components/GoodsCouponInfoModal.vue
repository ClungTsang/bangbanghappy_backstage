<template>
  <div>
    <a-modal
      :width="1300"
      :destroyOnClose="true"
      :maskClosable="false"
      :visible="visible"
      title="查看提货表信息"
      okText="保存为草稿"
      @ok="handleCouponOk"
      cancelText="返回"
      @cancel="() => $emit('close')"
    >
      <div style="margin:20px">
        <a-row type="flex" justify="space-between">
          <a-col>
            <a-space>
              <span style="margin-right:30px">
                提货卡名字：
                {{ couponInfo.giftname }}
              </span>
              <span>
                总价格：
                {{ countTotalPrice }}元
              </span>
            </a-space>
          </a-col>
          <a-col>
            <a-button type="primary" @click="createGiftKey">创建兑换卡</a-button>
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
          <span slot="imgurl" slot-scope="text, record">
            <img style="width: 100px; heigth: auto" :src="record.imgurl" />
          </span>
          <span slot="price" slot-scope="text, record">￥{{ parseFloat(text).toFixed(2) }}</span>
          <span slot="subtotal" slot-scope="text, record">￥{{ parseFloat(parseFloat(record.price) * parseInt(record.count)).toFixed(2) }}</span>
          <span slot="count" slot-scope="text, record">
            <editable-cell :text="text" @change="onCellChange(record.id, 'count', $event)" />
          </span>
          <span slot="action" slot-scope="text, record">
            <a @click="deleteCouponGoods(record)">删除商品</a>
            <!-- <a>修改商品</a> -->
            <!-- <a-button type="primary" @click="copyAttribute(record)">
            复刻
          </a-button>
          <a-popconfirm title="确认删除该提货卡属性" @confirm="deleteAttribute(record)">
            <a-button type="danger">
              删除
            </a-button>
          </a-popconfirm> -->
          </span>
        </a-table>
      </a-card>
    </a-modal>
    <a-modal :visible="createGiftKeyVisible" okText="确认创建" :loading="giftLoading" @cancel="createGiftKeyVisible = false" @ok="handleCreateGift" title="创建提货卡">
      <a-form>
        <a-form-item label="提货卡数量" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">{{ giftNum }}个</a-form-item>
        <a-form-item label="滑动设定数量" :labelCol="{ span: 6 }" :wrapperCol="{ span: 16 }">
          <a-row>
            <a-col :span="16">
              <a-slider v-model="giftNum" :min="1" :max="99999" />
            </a-col>
            <a-col :span="4" offset="2">
              <a-input-number v-model="giftNum" :min="1" :max="99999" />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import event from '@/utils/event.js'
import { mapMutations, mapState } from 'vuex'
import { restoreUrl } from '@/utils/urlTool'
const columns = [
  {
    title: '图片',
    width: 100,
    dataIndex: 'imgurl',
    align: 'center',
    scopedSlots: { customRender: 'imgurl' }
  },
  {
    title: '名称',
    width: 100,
    dataIndex: 'name',
    align: 'center',
    ellipsis: true
  },
  {
    title: '单价',
    width: 100,
    dataIndex: 'price',
    align: 'center',
    ellipsis: true,
    scopedSlots: { customRender: 'price' }
  },
  {
    title: '数量',
    width: 100,
    dataIndex: 'count',
    align: 'center',
    scopedSlots: { customRender: 'count' }
  },

  {
    title: '小计',
    width: 100,
    dataIndex: 'subtotal',
    align: 'center',
    scopedSlots: { customRender: 'subtotal' }
  },
  {
    title: '操作',
    width: 150,
    dataIndex: 'action',
    align: 'center',
    scopedSlots: { customRender: 'action' }
  }
]
export default {
  components: {
    EditableCell: () => import('@/components/editablecell/EditableCell')
  },
  props: {
    couponVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible() {
      return this.couponVisible
    },
    // 总价格计算
    countTotalPrice() {
      let totalCount = 0
      this.targetCoupon.productinformation.forEach(item => {
        totalCount += parseFloat(item.count) * parseFloat(item.product.originalprice)
      })
      return totalCount
    },
    ...mapState({
      coupon: state => state.account.coupon,
      targetCoupon: state => state.account.targetCoupon
    })
  },
  watch: {
    visible: {
      async handler() {
        this.dataSource = []
        // 判断缓存中是否存在指定提货表
        if (this.targetCoupon == null) {
          return
        }
        this.couponInfo = this.targetCoupon
        let coupon = this.coupon.find(item => item.id == this.targetCoupon.id)
        coupon.productinformation.forEach(item => {
          // 属性商品
          if (item.productAttribute != null) {
            this.dataSource.push({
              id: item.productAttribute.id,
              imgurl: restoreUrl(JSON.parse(item.productAttribute.attributeimgurl)),
              name: item.productAttribute.attributesname,
              price: item.productAttribute.price,
              isproduct: false,
              count: item.count
            })
          } else {
            this.dataSource.push({
              id: item.product.id,
              imgurl: restoreUrl(JSON.parse(item.product.productionimgurl)),
              name: item.product.productname,
              price: item.product.originalprice,
              isproduct: true,
              count: item.count
            })
          }
        })
      }
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
      couponInfo: { giftname: null },
      createGiftKeyVisible: false,
      giftLoading: false,
      giftNum: 1,
      target: this.targetCoupon
    }
  },
  methods: {
    ...mapMutations({ setCoupon: 'account/setCoupon' }),
    // 选择列
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
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
          let data = result.filter(item => item.productid == this.goodsAttribute.id)
          dataSource = data.map(item => ({ ...item, attributeimgurl: restoreUrl(JSON.parse(item.attributeimgurl)) }))
          this.dataSource = dataSource
        }
      })
      this.loading = false
    },
    // 删除提货信息中的商品
    deleteCouponGoods(record) {
      let dataSource = []
      let targetCoupon = this.targetCoupon
      let productinformationArr = []
      // 当前提货新信息
      let coupon = this.coupon.filter(item => item.id == targetCoupon.id)
      // 其余提货信息
      let anotherCoupon = this.coupon.filter(item => item.id !== targetCoupon.id)
      // 判断是否是商品还是商品属性
      if (record.isproduct) {
        productinformationArr = coupon[0].productinformation.filter(item => item.product.id != record.id)
      } else {
        // 拿到没有属性的全部内容
        let productinformationArrTemp1 = coupon[0].productinformation.filter(item => item.productAttribute == null)
        // 筛选出有属性的内容
        let productinformationArrTemp2 = coupon[0].productinformation.filter(item => {
          if (item.productAttribute !== null) {
            return item.productAttribute.id != record.id
          }
        })
        productinformationArr = [...productinformationArrTemp1, ...productinformationArrTemp2]
      }
      const params = {
        id: targetCoupon.id,
        giftkeystatus: 0,
        giftkey: targetCoupon.giftkey,
        giftname: targetCoupon.giftname,
        productinformation: productinformationArr
      }
      this.setCoupon([...anotherCoupon, params])
      this.$message.success('删除成功')
      productinformationArr.forEach(item => {
        // 属性商品
        if (item.productAttribute != null) {
          dataSource.push({
            id: item.productAttribute.id,
            imgurl: restoreUrl(JSON.parse(item.productAttribute.attributeimgurl)),
            name: item.productAttribute.attributesname,
            price: item.productAttribute.price,
            isproduct: false,
            count: item.count
          })
        } else {
          dataSource.push({
            id: item.product.id,
            imgurl: restoreUrl(JSON.parse(item.product.productionimgurl)),
            name: item.product.productname,
            price: item.product.originalprice,
            isproduct: true,
            count: item.count
          })
        }
      })
      this.dataSource = dataSource
    },
    // 保存礼品卡商品信息
    async handleCouponOk() {
      // 当前提货新信息
      let coupon = this.coupon.filter(item => item.id == this.targetCoupon.id)
      const parmas = {
        id: this.targetCoupon.id,
        productinformation: JSON.stringify(coupon[0].productinformation)
      }
      await this.$post('/giftkey/update', { ...parmas })
      this.$message.success('保存成功')
      event.$emit('couponAddDone')
    },
    // 创建提货卡
    createGiftKey() {
      let coupon = this.coupon.filter(item => item.id == this.targetCoupon.id)
      if (coupon[0].productinformation.length == 0) {
        this.$message.error('提货表不存在商品')
        return
      }
      this.createGiftKeyVisible = true
    },
    // 创建提货卡
    async handleCreateGift() {
      let coupon = this.coupon.filter(item => item.id == this.targetCoupon.id)
      if (coupon[0].productinformation.length == 0) {
        this.$message.error('提货表不存在商品')
        return
      }
      this.giftLoading = true
      const params = {
        giftkeyid: this.targetCoupon.id,
        count: this.giftNum
      }
      await this.$post('/giftkeyDetail', { ...params })
      this.fetch()
      await this.$post('/giftkey/update', { id: this.targetCoupon.id, giftkeystatus: 1 })
      event.$emit('couponAddDone')
      this.giftLoading = false
      this.$message.success('创建成功')
      this.createGiftKeyVisible = false
    },
    // 修改单元格内容
    onCellChange(id, dataIndex, value) {
      const dataSource = [...this.dataSource]
      const target = this.dataSource.find(item => item.id === id)
      if (target) {
        target[dataIndex] = parseInt(value)
        this.dataSource = dataSource
        this.onChange(id, target)
      }
    },
    // 更新单元格内容
    onChange(id, target) {
      // 在缓存中找到这个已经被更改的对象的源对象
      const targetItem = this.targetCoupon.productinformation.find(item => item.product.id === id)
      // 合并两个对象，相同属性则用新对象属性覆盖源对象的属性
      const newTargetItem = Object.assign(targetItem, target)
      // 得到其他不需要被更改的对象
      const unTargetItemArr = this.targetCoupon.productinformation.filter(item => item.product.id !== id)
      // 获取提货表中存放商品信息的对象数组
      const beChangedCoupon = {
        ...this.targetCoupon,
        productinformation: [...unTargetItemArr, newTargetItem]
      }
      // 缓存中其他不需要被更改的提货表
      const unBeChangedCoupon = this.coupon.filter(item => item.id !== this.targetCoupon.id)
      this.setCoupon([...unBeChangedCoupon, beChangedCoupon])
      this.$message.success('调整成功')
    }
  }
}
</script>
