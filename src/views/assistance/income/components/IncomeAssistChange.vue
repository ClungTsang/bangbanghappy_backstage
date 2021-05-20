<template>
  <div>
    <a-modal
      :visible="visible"
      title="援助抽成比例"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form>
        <a-form-item label="滑动或者输入你想要抽取的援助金额比例">
          <a-row>
            <a-col :span="20">
              <a-slider v-model="slider.value" :min="1" :max="100" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model="slider.value"
                :min="1"
                :max="100"
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
    };
  },
  props: {
    assistVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.assistVisible;
    },
  },
  methods: {
    // 复选修改抽成比例方法
    handleOk() {
      this.$message.success(`抽取援助比例更改为 ${this.slider.value}%`);
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
  },
};
</script>
<style>
</style>
