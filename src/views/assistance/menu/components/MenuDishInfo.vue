<template>
  <div>
    <a-modal
      :visible="visible"
      title="查看菜品详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
      :width="700"
    >
      <a-descriptions title="" bordered>
        <a-descriptions-item label="菜品名称">
          {{ menu.dishname }}
        </a-descriptions-item>
        <a-descriptions-item label="所属分类">
          {{ menu.dishclassificationname }}
        </a-descriptions-item>
        <a-descriptions-item label="商品状态">
          <a-badge
            status="warning"
            text="已下架"
            v-if="this.menu.dishstatus == 0"
          />
          <a-badge
            status="success"
            text="已上架"
            v-else="this.menu.dishstatus == 1"
          />
        </a-descriptions-item>
        <a-descriptions-item label="菜品价格">
          {{ menu.dishprice }}
        </a-descriptions-item>
        <a-descriptions-item label="活动价格">
          {{ menu.activityprice }}
        </a-descriptions-item>
        <a-descriptions-item label="会员价格">
          {{ menu.memberprice }}
        </a-descriptions-item>
        <a-descriptions-item label="限购数量">
          {{ menu.purchaselimit }}
        </a-descriptions-item>
        <a-descriptions-item label="菜品介绍" :span="3">
          {{ menu.description }}
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formLayout: "horizontal",
      menu: {},
    };
  },
  props: {
    showVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: {},
    },
  },
  computed: {
    visible() {
      return this.showVisible;
    },
  },
  watch: {
    data(val) {
      this.menu = val;
    },
  },
  methods: {
    handleOk() {
      this.$emit("cancel");
    },
    handleCancel() {
      this.$emit("cancel");
    },
  },
};
</script>
<style>
</style>
