<template>
  <a-tree-select :allowClear="true" :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }" :treeData="orderTree[status]" v-model="value" :placeholder="orderPlaceHolder[status]"></a-tree-select>
</template>

<script>
const orderPlaceHolder = ['订单状态', '订单类型', '订单配送方式']
const orderTree = [
  [
    { title: '已关闭', value: 0 },
    { title: '未付款', value: 1 },
    { title: '已付款', value: 2 },
    { title: '待收货', value: 3 },
    { title: '已签收', value: 4 },
    { title: '已取消', value: 5 }
  ],
  [
    { title: '商城订单', value: 0 },
    { title: '提货卡订单', value: 1 }
  ],
  [
    { title: '自提', value: 1 },
    { title: '顺丰', value: 2 }
  ]
]
export default {
  data() {
    return {
      orderTree,
      orderPlaceHolder,
      value: undefined
    }
  },
  props: {
    orderStatus: {
      type: Number,
      default: 0
    }
  },
  computed: {
    status() {
      return this.orderStatus
    }
  },
  methods: {
    reset() {
      this.value = undefined
    }
  },
  watch: {
    value(value) {
      this.$emit('change', value)
    }
  }
}
</script>
