<template>
  <div>
    <a-modal :visible="visible" title="代理配置" @ok="confirm" @cancel="cancel">
      <a-form :form="form" layout="inline">
        <a-form-item label="代理人订单保护时间（分）">
          <a-input-number v-decorator="['agentTime']"></a-input-number>
        </a-form-item>
        <a-form-item label="代理人订单保护路程（米）">
          <a-input-number v-decorator="['agentDistance']"></a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: this.$form.createForm(this),
    };
  },
  props: {
    agentVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.agentVisible;
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    // 数据渲染
    async setData() {
      let res = await this.$get("/business/rootData");
      let arrtemp = res.data.data;
      let arr = arrtemp.filter((item) => {
        return item.id == 7 || item.id == 8;
      });
      this.form.getFieldDecorator("agentTime");
      this.form.getFieldDecorator("agentDistance");
      this.form.setFieldsValue({
        agentTime: `${arr[0].valuedata}`,
        agentDistance: `${arr[1].valuedata}`,
      });
    },
    confirm() {
      this.form.validateFields((err,values) => {
        this.$post("/business/rootData/update", {
          id: 7,
          valuedata: values.agentTime,
        });
        this.$post("/business/rootData/update", {
          id: 8,
          valuedata: values.agentDistance,
        });
        this.$message.success("修改成功");
        this.$emit("close");
        // this.form.resetFields();
      });
    },
    cancel() {
      this.$emit("close");
    },
  },
};
</script>
