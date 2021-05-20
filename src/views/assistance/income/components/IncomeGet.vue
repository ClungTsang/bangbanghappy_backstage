<template>
  <div>
    <a-modal
      :visible="visible"
      title="提取金额"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirm-loading="confirmLoading"
    >
      <a-form>
        <a-form-item label="滑动或者输入你想要提取的金额">
          <a-row>
            <a-col :span="20">
              <a-slider v-model="slider.value" :min="1" :max="2000" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model="slider.value"
                :min="1"
                :max="2000"
                style="marginleft: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      slider: {
        value: 1,
      },
      rowList: null,
      confirmLoading: false,
    };
  },
  props: {
    getVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.getVisible;
    },
  },
  methods: {
    // 复选修改抽成比例方法
    handleOk() {
      this.confirmLoading = true;
      setTimeout(() => {
        this.$emit("close");
        this.$message.success(`提取现金 ${this.slider.value}元 成功`);
        this.confirmLoading = false;
      }, 1000);
    },
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
<style>
</style>
