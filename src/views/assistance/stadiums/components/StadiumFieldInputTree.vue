<template>
  <a-tree-select
    :allowClear="true"
    :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
    :treeData="orderTree[status]"
    v-model="value"
    :placeholder="orderPlaceHolder[status]"
  ></a-tree-select>
</template>

<script>
import { mapState } from 'vuex'
const orderPlaceHolder = ['球场类型', '开放状态', '球场等级', '评价星级']
export default {
  data() {
    return {
      orderTree: [],
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
    },
    ...mapState({
      user: (state) => state.account.user
    })
  },
  async created() {
    const res = await this.$get('/gymCourt', { gymandstadiumid: this.user.email })
    const court = res.data.data.map((item) => ({ title: item.courtcategory, value: item.id }))
    this.orderTree = [
      [...court],
      [
        { title: '不激活', value: 0 },
        { title: '激活', value: 1 }
      ],
      [
        { title: '1星', value: 1 },
        { title: '2星', value: 2 },
        { title: '3星', value: 3 },
        { title: '4星', value: 4 },
        { title: '5星', value: 5 }
      ],
      [
        { title: '1星', value: 1 },
        { title: '2星', value: 2 },
        { title: '3星', value: 3 },
        { title: '4星', value: 4 },
        { title: '5星', value: 5 }
      ]
    ]
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
