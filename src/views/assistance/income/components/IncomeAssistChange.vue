<template>
  <div>
    <a-modal
      :visible="visible"
      title="全局援助抽成比例"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form>
        <a-form-item label="滑动或者输入你想要对援助的抽成比例">
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
  watch: {
    visible: {
      handler() {
        this.getTotallyIncome();
      },
      immediate: true,
    },
  },
  methods: {
    // 复选修改抽成比例方法
    handleOk() {
      const params = { id: 4, valuedata: this.slider.value };
      this.$post("/business/rootData/update", { ...params }).then(() => {
        this.$message.success(`抽取援助比例更改为 ${this.slider.value}%`);
      });
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
    // 获取最新全局抽成
    getTotallyIncome() {
      this.$get("/business/rootData").then((res) => {
        this.slider.value = res.data.data[3].valuedata;
      });
    },
  },
};
</script>
<style>
</style>
