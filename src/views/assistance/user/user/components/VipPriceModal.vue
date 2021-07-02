<template>
  <div>
    <a-modal
      :visible="visible"
      title="会员缴费金额"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form>
        <a-form-item label="滑动修改会员缴费金额">
          <a-row>
            <a-col :span="20">
              <a-slider v-model="slider.value" :min="1" :max="500" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model="slider.value"
                :min="1"
                :max="99"
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
        value: 0,
      },
    };
  },
  props: {
    vipPriceVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.vipPriceVisible;
    },
  },
  mounted() {
    this.setData();
  },
  methods: {
    // 渲染数据
    async setData() {
      let res = await this.$get("/business/rootData");
      let arr = res.data.data.filter((item) => {
        return item.id == 9;
      });
      this.slider.value = `${arr[0].valuedata}`;
    },
    // 复选修改抽成比例方法
    handleOk() {
      this.$post("/business/rootData/update", {
        id: 9,
        valuedata: this.slider.value,
      });
      this.$message.success("修改成功");
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
