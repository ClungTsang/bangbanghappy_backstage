<template>
  <div>
    <a-modal
      :visible="visible"
      title="新增模拟订单"
      :destroyOnClose="true"
      @ok="confirm"
      @cancel="cancel"
    >
      <a-form :form="form">
        <a-form-item label="已存在数据" v-model="fakeOrderTotal">
          已存在{{ fakeOrderTotal }}条模拟订单数据
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="clearAllFake">
            清除所有模拟数据
          </a-button>
        </a-form-item>
        <a-form-item label="输入模拟姓名">
          <a-input v-decorator="['fakename']"></a-input>
        </a-form-item>
        <a-form-item label="输入模拟金额">
          <a-input-number v-decorator="['fakeprice']"></a-input-number>
        </a-form-item>
        <a-form-item label="是否全局使用模拟订单数据">
          <a-switch
            :defaultChecked="fakeToAll"
            @change="isAllMockData"
          ></a-switch>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      fakename: "",
      fakeprice: 0,
      fakeOrderTotal: 0,
      fakeToAll: false,
      form: this.$form.createForm(this),
    };
  },
  props: {
    mockVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.mockVisible;
    },
  },
  mounted() {
    this.getFakeOrder();
    this.getMockAll();
  },
  methods: {
    // 已存在模拟数据数量
    getFakeOrder() {
      this.$get("/backend/notice/selectAllByNoticeStatus", {
        noticestatus: 2,
      }).then((res) => {
        // console.log(res.data.data.total);
        this.fakeOrderTotal = res.data.data.total;
      });
    },
    // 查询是否全局启用
    getMockAll() {
      this.$get("/business/rootData").then((res) => {
        let result = res.data.data.filter((item) => {
          return item.id == 6;
        });
        this.fakeToAll = result[0].valuedata == 1 ? true : false;
      });
    },
    confirm() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$post("/backend/notice", {
            title: values.fakename,
            content: values.fakeprice,
            noticestatus: 2,
          })
            .then(() => {
              this.$message.success("添加成功");
              this.$emit("close");
              this.getFakeOrder();
              this.form.resetFields();
            })
            .catch(() => {
              this.$message.error("未添加任何数据");
              this.$emit("close");
            });
        }
      });
    },
    cancel() {
      this.$emit("close");
    },
    // 切换全局模拟订单数据
    isAllMockData(checked) {
      this.fakeToAll = checked;
      const params = {
        id: 6,
        valuedata: this.fakeToAll ? 1 : 0,
      };
      this.$post("/business/rootData/update", { ...params }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("切换成功");
          this.$emit("close");
        }
      });
    },
    // 清除所有模拟订单数据
    clearAllFake() {
      this.$delete("/backend/notice/deleteall").then(() => {
        this.fakeOrderTotal = 0;
        this.$message.success("全部清除成功");
        this.$emit("close");
      });
    },
  },
};
</script>
<style>
</style>
