<template>
  <a-tree-select :allowClear="true" :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }" :treeData="orderTree[status]" v-model="value" :placeholder="orderPlaceHolder[status]"></a-tree-select>
</template>

<script>
const orderPlaceHolder = ['球场类型', '标签类型', '星级评价', '开放日期', '实时更新状态', '小卖部']
const orderTree = [
  [
    { title: '室内球馆', value: 0 },
    { title: '野球场', value: 1 }
  ],
  [],
  [
    { title: '1星', value: 1 },
    { title: '2星', value: 2 },
    { title: '3星', value: 3 },
    { title: '4星', value: 4 },
    { title: '5星', value: 5 }
  ],
  [
    { title: '周一', value: 1 },
    { title: '周二', value: 2 },
    { title: '周三', value: 3 },
    { title: '周四', value: 4 },
    { title: '周五', value: 5 },
    { title: '周六', value: 6 },
    { title: '周日', value: 7 }
  ],
  [
    { title: '不激活', value: 0 },
    { title: '激活', value: 1 }
  ],
  [
    { title: '不激活', value: 0 },
    { title: '激活', value: 1 }
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
