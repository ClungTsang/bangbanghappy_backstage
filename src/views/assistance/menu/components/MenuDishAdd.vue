<template>
  <div>
    <a-modal
      :visible="visible"
      title="新增菜品"
      :destroyOnClose="true"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="菜品名称">
          <a-input
            v-decorator="[
              'dishname',
              { rules: [{ required: true, message: '菜品名称不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="菜品描述">
          <a-textarea
            v-decorator="[
              'description',
              { rules: [{ required: true, message: '菜品描述不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="商品价格">
          <a-input-number
            :min="1"
            v-decorator="[
              'dishprice',
              { rules: [{ required: true, message: '价格不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="会员价格">
          <a-input-number
            :min="1"
            v-decorator="[
              'memberprice',
              { rules: [{ required: true, message: '会员价格不能为空' }] },
            ]"
          />
        </a-form-item>
        <a-form-item label="限购数量">
          <a-input-number :min="1" v-decorator="['purchaselimit']" />
        </a-form-item>
        <a-form-item label="添加菜品图片">
          <menu-dish-upload>上传菜品图片</menu-dish-upload>
        </a-form-item>
        <a-form-item label="分类选择" style="margin-bottom: 2rem">
          <a-radio-group button-style="solid" v-model="category.item">
            <a-radio-button
              style="margin: 5px"
              v-for="item in items"
              :key="item.id"
              :value="item"
            >
              {{ item.text }}
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="提示"
      :visible="priceNoticeVisible"
      @ok="priceNoticeOk"
      @cancel="priceNoticeOk"
      :width=240
    >
      <p>会员价格不能超过商品价格</p>
    </a-modal>
  </div>
</template>
<script>
import MenuDishUpload from "./MenuDishUpload.vue";
import { mapState } from "vuex";
import event from "@/utils/event";
export default {
  components: {
    MenuDishUpload,
  },
  data() {
    return {
      form: this.$form.createForm(this),
      menu: {},
      category: {
        item: "",
      },
      items: [],
      // 菜品照片
      dishUrl: "",
      // 会员价格限制弹窗
      priceNoticeVisible: false,
    };
  },
  props: {
    addVisible: {
      type: Boolean,
      default: false,
    },
    storeId: {
      type: Number,
      default: 0,
    },
  },
  created() {
    // event.$on("addCategroyOk", () => {
    //   console.log("created:addCategroyOk");
    //   this.getMenuCategoryInfo();
    // });
  },
  mounted() {
    event.$on("addCategroyOk", () => {
      console.log("mounted:addCategroyOk");

      this.getMenuCategoryInfo();
    });
    event.$on("dishUrl", (res) => {
      let list = [];
      res.forEach((item) => {
        list.push(item.url);
      });
      // console.log(1, list);
      this.dishUrl = JSON.stringify(list);
    });
    event.$on("addUserInfoDone", () => {
      console.log("mounted:addUserInfoDone");
      this.getMenuCategoryInfo();
    });
  },
  computed: {
    visible() {
      return this.addVisible;
    },
    ...mapState({
      userInfo: (state) => state.account.userInfo,
    }),
  },
  methods: {
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

    // 确定回调
    handleOk() {
      this.form.validateFields(["dishprice", "memberprice"], (err, value) => {
        if (err) {
          return;
        }
        if (parseFloat(value.memberprice) > parseFloat(value.dishprice)) {
          this.priceNoticeVisible = true
          return;
        }
        this.setMenuFields();
        let params = this.menu;
        this.$post("/backend/business/LantianDishmanagement", {
          ...params,
          dishurl: this.dishUrl,
          storeid: this.category.item.storeid,
          dishclassificationid: this.category.item.id,
          dishclassificationname: this.category.item.text,
          // dishstatus:parseInt(0)
        }).then(() => {
          this.$message.success("增加成功");
          this.$emit("close");
          this.form.resetFields();
        });
      });
    },
    // 取消回调
    handleCancel() {
      // this.$message.error("取消增加");
      //TODO:取消新增菜品 则要清除cos的图片
      // this.$refs.UploadImage.remove();

      this.$emit("cancel");
      this.form.resetFields();
    },
    // 上传图片到后台数据库
    uploadImage() {
      // 调用节点方法，上传图片至数据库
      this.$refs.UploadImage.afterUpload();
    },
    // 获取表单内容
    setMenuFields() {
      let values = this.form.getFieldsValue([
        "dishname",
        "description",
        "dishprice",
        "purchaselimit",
        "memberprice",
      ]);
      if (typeof values !== "undefined") {
        Object.keys(values).forEach((_key) => {
          this.menu[_key] = values[_key];
        });
      }
      console.log(this.menu);
    },
    priceNoticeOk() {
      this.priceNoticeVisible = false;
    },
  },
};
</script>
<style>
</style>
