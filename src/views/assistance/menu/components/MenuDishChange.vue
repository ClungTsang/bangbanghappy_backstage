<template>
  <div>
    <a-modal
      :visible="visible"
      title="修改菜品详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :layout="formLayout">
        <a-form-item label="菜品名称"
          ><a-input v-model="menu.dishname"></a-input>
        </a-form-item>
        <a-form-item label="菜品价格"
          ><a-input v-model="menu.dishprice"></a-input
        ></a-form-item>
        <a-form-item label="菜品介绍"
          ><a-textarea v-model="menu.description"></a-textarea
        ></a-form-item>
        <a-form-item label="活动价格"
          ><a-input v-model="menu.activityprice"></a-input
        ></a-form-item>
        <a-form-item label="会员价格"
          ><a-input v-model="menu.memberprice"></a-input
        ></a-form-item>
        <a-form-item label="限购数量"
          ><a-input v-model="menu.purchaselimit"></a-input
        ></a-form-item>
        <!-- <a-form-item label="所属分类"
          ><a-select style="width: 100%" v-model="menu.dishclassificationname">
            <a-select-option
              v-for="item in items"
              :key="item.id"
              :value="item.text"
            >
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      formLayout: "horizontal",
      menu: {},
      category: {
        text: "切换菜单分类",
      },
      items: [],
      form: this.$form.createForm(this),
    };
  },
  created() {
    // this.getMenuCategoryInfo();
  },
  props: {
    changeVisible: {
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
      return this.changeVisible;
    },
    ...mapState({
      userInfo: (state) => state.account.userInfo,
    }),
  },
  watch: {
    data(val) {
      this.menu = val;
    },
    menu: {
      deep: true,
      handle(val) {
        console.log(val);
      },
    },
  },
  methods: {
    // TODO:切换分类的时候出现id和名字不一致的问题
    handleOk() {
      this.form.validateFields((err) => {
        if (err) {
          return;
        }
        let params = this.menu;
        console.log(params);
        this.$put(`/backend/business/LantianDishmanagement`, {
          ...params,
        }).then(() => {
          this.$emit("close");
          this.$message.success("修改成功");
        });
      });
    },
    handleCancel() {
      // 清除表单
      // this.form.resetFields();
      this.$emit("cancel");
    },
    // 获取表单内容
    // setMenuFields() {
    //   let values = this.form.getFieldsValue([
    //     "dishname",
    //     "description",
    //     "dishprice",
    //   ]);
    //   if (typeof values !== "undefined") {
    //     Object.keys(values).forEach((_key) => {
    //       this.menu[_key] = values[_key];
    //     });
    //   }
    //   console.log(this.menu);
    // },
    // 网络获取所有分类数据
    async getMenuCategoryInfo() {
      const params = {
        storeid: this.userInfo.id,
      };
      this.$get(
        `/backend/business/LantianDishesclassificationtable/MapAllByStoreId`,
        {
          ...params,
        }
      ).then((res) => {
        this.items = res.data.data;
      });
    },
  },
};
</script>
<style>
</style>
