<template>
  <div>
    <a-modal
      :visible="visible"
      title="增加菜单分类"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="分类名称">
          <a-input
            v-decorator="[
              'text',
              { rules: [{ required: true, message: '请输入分类名称' }] }
            ]"
            placeholder="请输入分类名称"
          ></a-input>
        </a-form-item>
        <!-- <a-form-item label="排序">
          <a-input-number
            v-decorator="['sort']"
            placeholder="排序"
            :min="1"
            :max="10"
          />
        </a-form-item>
        <a-form-item label="是否显示">
          <a-radio-group v-model="menu.isShow">
            <a-radio value="1">显示</a-radio>
            <a-radio value="2">不显示</a-radio>
          </a-radio-group>
        </a-form-item> -->
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import event from "@/utils/event";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      menu: {
        name: "",
        rank: 1,
        isShow: 1
      },
      form: this.$form.createForm(this),
      storeInfo: null
    };
  },
  props: {
    addVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible() {
      return this.addVisible;
    }
    // ...mapState({
    //   storeInfo: state => state.account.storeInfo
    // })
  },
  created() {
    this.getStoreInfo();
  },
  methods: {
    // ...mapMutations({
    //   setUserInfo: "account/setUserInfo"
    // }),
    async getStoreInfo() {
      const user = this.$db.get("USER");
      let res = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      this.storeInfo = res.data.data;
    },
    handleOk() {
      this.form.validateFields((err, fieldValue) => {
        if (err) {
          return;
        }
        const value = {
          ...fieldValue
          // show: this.menu.isShow
          // 用 this.form.getFieldValue 获取 被v-decorator修饰的标签
          // text: this.form.getFieldValue("text"),
        };
        this.onAddMenu(value);
      });
    },
    handleCancel() {
      this.$emit("cancel");
    },

    onAddMenu(menuInfo) {
      // console.log(menuInfo);
      // 获取当前用户信息
      // const user = this.$db.get("USER");
      const params = {
        // id: user.userId,
        storeid: this.storeInfo.id,
        text: menuInfo.text
      };
      this.$post("backend/business/LantianDishesclassificationtable", {
        ...params
      }).then(res => {
        // 通知关闭并将分类名称返回给父类
        this.$emit("close", res.data.data);
        event.$emit("addCategroyOk");
        this.form.resetFields();

        // this.$message.success("新增分类成功");
      });
    }
  }
};
</script>
<style></style>
