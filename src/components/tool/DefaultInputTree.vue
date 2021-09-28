<template>
  <a-tree-select
    v-model="value"
    allowClear
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
    },
    defaultValue: {
      type: Number,
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
      handler() {
        this.getTreeInfo();
      },
      immediate: true,
      deep: true
    },
    value: {
      handler(id) {
        this.$emit(
          "change",
          JSON.stringify({
            id: id,
            text: this.customTreeData.find(item => item.value === id).title
          })
        );
      },
      // immediate: true,
      deep: true
    },
    defaultValue: {
      handler(value) {
        this.value = value;
      }
    }
  },
  methods: {
    reset() {
      this.value = undefined;
    },
    // 加载分类列表
    async getTreeInfo() {
      switch (this.isLoadTree) {
        case "loadCategoryTree":
          this.$get("/tree", { pid: 0 }).then(res => {
            const result = res.data.data.productClassification;
            result.forEach(item => {
              if (item.isdisplay == 1) {
                let params = {
                  title: item.classificationname,
                  value: item.id,
                  children: []
                };
                if (item.childMenus) {
                  item.childMenus.forEach(firstChildMenu => {
                    if (firstChildMenu.isdisplay == 1) {
                      params.children.push({
                        title: firstChildMenu.classificationname,
                        value: firstChildMenu.id,
                        children: []
                      });
                      if (firstChildMenu.childMenus) {
                        firstChildMenu.childMenus.forEach(secondChildMenu => {
                          if (secondChildMenu.isdisplay == 1) {
                            params.children[0].children.push({
                              title: secondChildMenu.classificationname,
                              value: secondChildMenu.id,
                              children: []
                            });
                          }
                        });
                      }
                    }
                  });
                }
                this.customTreeData.push(params);
              }
            });
          });
          this.customTreeData.push({
            title: "无上级分类",
            value: 0
          });
          break;
        case "loadCategoryTree2":
          console.info("loadCategoryTree");
          const user = this.$db.get("USER");
          const userRes = await this.$get(
            `/business/LantianStore/getByPhone/${user.username}`
          );
          this.$get(
            "/backend/business/LantianDishesclassificationtable/MapAllByStoreId",
            {
              storeid: userRes.data.data.id
            }
          ).then(res => {
            this.customTreeData = res.data.data.map(item => ({
              title: item.text,
              value: item.id
            }));
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
