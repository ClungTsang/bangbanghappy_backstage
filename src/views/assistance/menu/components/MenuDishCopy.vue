<template>
  <div>
    <a-modal
      :visible="visible"
      title="复制菜品详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form" :layout="formLayout">
        <a-form-item label="菜品名称"
          ><a-input v-model="menu.dishname"></a-input>
        </a-form-item>

        <a-form-item label="菜品介绍"
          ><a-textarea v-model="menu.description"></a-textarea
        ></a-form-item>
        <!-- <a-form-item label="活动价格"
          ><a-input v-model="menu.activityprice"></a-input
        ></a-form-item> -->
        <a-form-item label="菜品价格"
          ><a-input-number v-model="menu.dishprice"></a-input-number
        ></a-form-item>
        <a-form-item label="会员价格"
          ><a-input-number v-model="menu.memberprice"></a-input-number
        ></a-form-item>
        <a-form-item label="限购数量"
          ><a-input-number v-model="menu.purchaselimit"></a-input-number
        ></a-form-item>
        <a-form-item label="所属分类">
          <a-select
            @select="select"
            style="width: 100%"
            v-model="menu.dishclassificationname"
          >
            <a-select-option v-for="item in items" :key="item.id">
              {{ item.text }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import { mapState } from "vuex";
import event from "@/utils/event";
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
  props: {
    copyVisible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: null,
    },
  },
  created() {
    event.$on("addUserInfoDone", () => {
      this.getMenuCategoryInfo();
    });
  },
  computed: {
    visible() {
      return this.copyVisible;
    },
    ...mapState({
      userInfo: (state) => state.account.userInfo,
    }),
  },
  watch: {
    data(val) {
      // console.log(val);
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
    handleOk() {
      this.form.validateFields((err) => {
        if (err) {
          return;
        }
        let params = this.menu;
        console.log(params);

        this.$post("/backend/business/LantianDishmanagement", {
          ...params,
          // dishurl: this.dishUrl,
          // storeid: this.category.item.storeid,
          // dishclassificationid: this.category.item.id,
          // dishclassificationname: this.category.item.text,
        }).then(() => {
          this.$message.success("复制成功");
          this.$emit("close");
          this.form.resetFields();
        });
      });
    },
    handleCancel() {
      // 清除表单
      // this.form.resetFields();
      this.$emit("cancel");
    },
    select(e) {
      let dishclass = this.items.filter((item) => {
        return item.id == e;
      });
      this.menu.dishclassificationid = dishclass[0].id;
      this.menu.dishclassificationname = dishclass[0].text;
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
        // console.log(this.items);
      });
    },
  },
};
</script>
<style>
</style>
