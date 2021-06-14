<template>
  <div>
    <a-select
      style="width: 130px"
      v-model="category.text"
      placeholder="请选择分类"
    >
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
    <a-button type="primary" ghost @click="onOpenDelete"> 删除分类 </a-button>

    <!-- 新增分类 -->
    <menu-category-add
      @close="onClose"
      @cancel="onCancel"
      :addVisible="menuCategoryVisible"
      :storeId="storeId"
    ></menu-category-add>
    <!-- 删除分类 -->
    <a-modal
      :visible="deleteVisibel"
      title="删除分类"
      @ok="onDeleteOk"
      @cancel="onCancel"
    >
      <a-radio-group button-style="solid" v-model="category.item">
        <a-radio-button
          style="margin: 5px"
          v-for="item in items"
          :key="item.id"
          :value="item.text"
        >
          {{ item.text }}
        </a-radio-button>
      </a-radio-group>
    </a-modal>
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
      deleteVisibel: false,
      storeId: 0,
      category: {
        item: "",
      },
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
      if (res.data.data == null) {
        // 如果没有菜单信息
        // 终止操作
        return;
      }
      this.setUserInfo(res.data.data);
      this.storeId = res.data.data.id;
      const params = {
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
        this.$get(`/business/LantianStore/getByPhone/${user.username}`)
          .then((res) => {
            // 有门店，返回数据
            resolve(res);
          })
          .catch((err) => {
            // TODO: 无门店 返回错误信息
            reject(err);
          });
      });
    },
    // 新增分类
    addItem() {
      // console.log("addItem");
      this.menuCategoryVisible = true;
    },
    // 关闭新增分类
    onClose(categoryData) {
      this.$message.success(`新增${categoryData.text}成功`);
      this.items.push(categoryData);
      this.menuCategoryVisible = false;
    },
    // 删除分类
    onOpenDelete() {
      // console.log("addItem");
      this.deleteVisibel = true;
    },
    // 关闭删除分类
    async onDeleteOk() {
      console.log(this.category);
      let selectItem = this.items.filter((item) => {
        return item.text == this.category.item;
      });
      console.log(selectItem);
      await this.$delete(
        `/backend/business/LantianDishesclassificationtable/${selectItem[0].id}`
      ).then((res) => {
        if (res.data.message == "仍有以下菜品存在该分类") {
          this.$message.error(`仍有菜品存在该分类`);
        } else if (res.data.code == 200) {
          this.$message.success(`删除${this.category.item}成功`);
          let items = this.items.filter((item) => {
            return item.text != this.category.item;
          });
          event.$emit("addCategroyOk");
          this.items = items;
        }else{
          this.$message.error('删除失败');
        }
        this.deleteVisibel = false;
      });
    },
    onCancel() {
      this.menuCategoryVisible = false;
      this.deleteVisibel = false;
    },
  },
};
</script>
<style>
</style>
