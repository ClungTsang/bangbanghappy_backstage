<template>
  <div>
    <a-modal
      title="代理配置"
      :visible="visible"
      :width="500"
      :destroyOnClose="true"
      :maskClosable="false"
      @ok="confirm"
      @cancel="
        () => {
          $emit('close');
        }
      "
    >
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="代理人订单保护时间（分钟）">
          <a-input-number v-decorator="['agentTime']"></a-input-number>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
const labelCol = {
  xl: { span: 10 },
  xs: { span: 24 },
  sm: { span: 10 }
};
const wrapperCol = {
  xl: { span: 14 },
  xs: { span: 24 },
  sm: { span: 14 }
};
export default {
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol,
      wrapperCol
    };
  },
  props: {
    agentVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible() {
      return this.agentVisible;
    }
  },
  mounted() {
    this.setData();
  },
  methods: {
    // 数据渲染
    async setData() {
      let res = await this.$get("/business/rootData");
      let arr = res.data.data.filter(item => {
        return item.id == 7;
      });
      this.form.getFieldDecorator("agentTime");
      this.form.setFieldsValue({
        agentTime: `${arr[0].valuedata}`
      });
    },
    confirm() {
      this.form.validateFields((err, values) => {
        this.$post("/business/rootData/update", {
          id: 7,
          valuedata: values.agentTime
        });
        this.$message.success("修改成功");
        this.$emit("close");
        // this.form.resetFields();
      });
    }
  }
};
</script>
