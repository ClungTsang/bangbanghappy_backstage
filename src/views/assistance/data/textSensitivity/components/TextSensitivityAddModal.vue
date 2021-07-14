<template>
  <div>
    <a-modal
      :visible="visible"
      title="添加敏感词"
      :maskClosable="false"
      @ok="confirm"
      @cancel="cancel"
    >
      <a-input placeholder="添加敏感词" v-model="text"></a-input>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      text: "",
    };
  },
  props: {
    addTextVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.addTextVisible;
    },
  },
  methods: {
    // 确定回调
    confirm() {
      const params = {
        name: this.text,
        isDelele: 1,
      };
      this.$post("/helpSensitiveWord", {
        ...params,
      }).then(() => {
        this.$message.success("增加敏感词成功");
        this.$emit("close", "ok");
        this.text = "";
      });
    },
    cancel() {
      this.$emit("close", "cancel");
    },
  },
};
</script>
<style>
</style>
