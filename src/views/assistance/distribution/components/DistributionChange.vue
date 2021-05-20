<template>
  <div>
    <a-modal
      :visible="visible"
      title="批量修改抽成"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-form>
        <a-form-item label="滑动批量修改门店的抽成比例">
          <a-row>
            <a-col :span="20">
              <a-slider v-model="slider.value" :min="1" :max="99" />
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
import event from "@/utils/event.js";
export default {
  data() {
    return {
      slider: {
        value: 20,
      },
      rowList: null,
    };
  },
  props: {
    changeVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.changeVisible;
    },
  },
  mounted() {
    // 接收到兄弟组件传值
    event.$on("selectedRowKeys", (res) => {
      this.rowList = res;
    });
  },
  methods: {
    // 复选修改抽成比例方法
    handleOk() {
      const rowList = this.rowList;
      rowList.forEach((item) => {
        this.$put("business/LantianStore", {
          id: item,
          spendpercent: this.slider.value + "",
        });
      });
      event.$emit("cleanSelectedRow");
      this.$emit("close");
      this.$message.success("修改抽成成功");
    },
    handleCancel() {
      console.log("cancel");
      this.$emit("close");
    },
  },
};
</script>
<style>
</style>
