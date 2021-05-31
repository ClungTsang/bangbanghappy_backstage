<template>
  <div>
    <a-modal
      :visible="visible"
      title="新增问题"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="问题标题">
          <a-input v-decorator="['title']"></a-input>
        </a-form-item>
        <a-form-item label="问题解答">
          <a-textarea v-decorator="['detail']"></a-textarea>
        </a-form-item>
        <a-form-item label="是否显示">
          <a-radio-group v-decorator="['isDelete']">
            <a-radio value="0">显示</a-radio>
            <a-radio value="1">不显示</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import event from "@/utils/event";
export default {
  data() {
    return {
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
    };
  },
  props: {
    addVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.addVisible;
    },
  },
  methods: {
    handleOk() {
      // TODO: 添加一个loading状态
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$post("/question", { ...values }).then(() => {
            this.$emit("close");
            event.$emit("addCompleted");
            this.form.resetFields()
          });
        }
      });
    },
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
<style>
</style>
