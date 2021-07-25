<template>
  <a-card :bordered="bordered">
    <div>
      <a-row type="flex" style="margin-bottom: 10px">
        <a-col>
          <a-button type="primary" @click="onOpen"> 新增菜品 </a-button>
        </a-col>

        <!-- TODO:后续多选上下架迭代 -->
        <!-- <a-col style="margin-left: 10px">
          <a-button ghost type="primary" @click="onOpen"> 多选下架 </a-button>
        </a-col> -->
        <a-col style="margin-left: 10px">
          <menu-category-change></menu-category-change>
        </a-col>
      </a-row>
      <menu-add
        :addVisible="menuAddVisible"
        @close="onClose"
        @cancel="onCancel"
      ></menu-add>
      <!-- 展示分类信息 -->
      <menu-category-info></menu-category-info>
    </div>
  </a-card>
</template>
<script>
import { mapMutations } from "vuex";
import MenuAdd from "./components/MenuDishAdd.vue";
import MenuCategoryAdd from "./components/MenuCategoryAdd.vue";
import MenuCategoryChange from "./components/MenuCategoryChange.vue";
import MenuCategoryInfo from "./components/MenuCategoryInfo.vue";
export default {
  components: {
    MenuCategoryInfo,
    MenuCategoryAdd,
    MenuCategoryChange,
    MenuAdd,
  },
  data() {
    return {
      menuCategoryVisible: false,
      bordered: false,
      menuAddVisible: false,
    };
  },

  created() {
    this.getStoreInfo();
  },
  methods: {
    ...mapMutations({
      setUserInfo: "account/setUserInfo",
    }),
    // 获取当前我的门店信息
    async getStoreInfo() {
      const user = this.$db.get("USER");
      let res = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      // console.log(res.data.data);
      this.setUserInfo(res.data.data);
    },
    onCancel() {
      this.menuAddVisible = false;
    },
    onClose() {
      this.menuAddVisible = false;
    },
    onOpen() {
      this.menuAddVisible = true;
    },
  },
};
</script>
<style>
</style>
