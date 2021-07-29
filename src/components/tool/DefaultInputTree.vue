<template>
  <a-tree-select
    v-model="value"
    :allowClear="true"
    :dropdownStyle="{ maxHeight: '220px', overflow: 'auto' }"
    :treeData="tree"
    :placeholder="placeholder"
  ></a-tree-select>
</template>

<script>
export default {
  data() {
    return {
      value: undefined,
      isLoad: null,
      customTreeData: []
    };
  },
  props: {
    treeData: {
      type: Array,
      required: false,
      default: () => []
    },
    treePlaceholder: {
      type: String,
      default: null
    },
    isLoadTree: {
      type: String,
      default: null
    }
  },
  computed: {
    tree() {
      if (this.treeData.length > 0) {
        return this.treeData;
      } else {
        return this.customTreeData;
      }
    },
    placeholder() {
      return this.treePlaceholder;
    }
  },
  watch: {
    // 自定义加载tree
    isLoadTree: {
      handler(value) {
        console.warn("watch", value);
        this.getTreeInfo();
      },
      immediate: true
    },
    value: {
      handler(value) {
        this.$emit("change", value);
      },
      immediate: true
    }
  },
  methods: {
    reset() {
      this.value = undefined;
    },
    // 加载分类列表
    async getTreeInfo() {
      switch (this.isLoadTree) {
        case "loadAgentArea":
          this.$get("/agentInformation/list").then(res => {
            const result = res.data.data.rows;
            result.forEach(item => {
              let params = {
                title: item.agentinformationdescription,
                value: item.id
              };
              this.customTreeData.push(params);
            });
          });

          break;
        case "coupon":
          console.warn("coupon");
          break;
        default:
          console.info("不需要加载tree");
      }
    }
  }
};
</script>
