<template>
  <div>
    <a-select style="width: 130px" v-model="category.text">
      <div slot="dropdownRender" slot-scope="menu">
        <v-nodes :vnodes="menu" />
        <a-divider style="margin: 4px 0" />
        <div
          style="padding: 4px 8px; cursor: pointer"
          @mousedown="(e) => e.preventDefault()"
          @click="addItem"
        >
          <a-icon type="plus" />添加分类
        </div>
      </div>
      <a-select-option v-for="item in items" :key="item.id" :value="item.text">
        {{ item.text }}
      </a-select-option>
    </a-select>
    <!-- 新增分类 -->
    <menu-category-add
      @close="onClose"
      @cancel="onCancel"
      :addVisible="menuCategoryVisible"
      :storeId="storeId"
    ></menu-category-add>
  </div>
</template>
<script>
import { mapMutations } from "vuex";

import event from "../../../../utils/event";
import MenuCategoryAdd from "./MenuCategoryAdd.vue";
export default {
  data() {
    return {
      category: {
        text: "切换菜单分类",
      },
      items: [],
      menuCategoryVisible: false,
      storeId: 0,
    };
  },
  watch: {
    async "category.text"(val) {
      // 传输门店id和选择的分类
      let res = {
        storeId: this.storeId,
        category: val,
      };
      event.$emit("transferCategory", res);
    },
  },
  components: {
    MenuCategoryAdd,
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  created() {
    this.getMenuCategoryInfo();
  },
  methods: {
    ...mapMutations({
      setUserInfo: "account/setUserInfo",
    }),
    // TODO:后续优化一个显示全部，用于默认显示和点击全部查看

    // 网络获取所有分类数据
    async getMenuCategoryInfo() {
      // 用我们门店信息中的 门店id=storeid
      const res = await this.getStoreInfo();
      if(res.data.data == null){
        // 如果没有菜单信息
        // 终止操作
        return
      }
      this.setUserInfo(res.data.data);
      this.storeId = res.data.data.id;
      const params = {
        // TODO:如果便携小程序 就传1
        // LantianDishmanagementstatus: 0,
        storeid: this.storeId,
      };
      //

      // 通过门店 storeid 全查菜品分类
      // this.$get(`/backend/business/LantianDishmanagement/MapAllByStoreId`, {
      this.$get(
        `/backend/business/LantianDishesclassificationtable/MapAllByStoreId`,
        {
          ...params,
        }
      ).then((res) => {
        return this.setMenuCategoryInfo(res.data.data);
      });
    },

    // 渲染数据到浏览器端
    setMenuCategoryInfo(category) {
      this.items = category;
    },
    // 获取当前我的门店信息
    getStoreInfo() {
      const user = this.$db.get("USER");
      return new Promise((resolve, reject) => {
        this.$get(`/business/LantianStore/getByPhone/${user.username}`).then(res=>{
          // 有门店，返回数据
          resolve(res)
        }).catch(err=>{
          // TODO: 无门店 返回错误信息
          reject(err)
        })
      });
    },
    // 新增分类回调
    addItem() {
      // console.log("addItem");
      this.menuCategoryVisible = true;
    },
    // 关闭分类
    onClose(categoryData) {
      console.log(`新增${categoryData.text}成功`);
      this.items.push(categoryData);
      this.menuCategoryVisible = false;
    },
    onCancel() {
      this.menuCategoryVisible = false;
    },
  },
};
</script>
<style>
</style>
