<template>
  <div>
    <a-button
      type="success"
      @click="onOpenQuestion"
      v-hasPermission="['question:add']"
      >新增答疑
    </a-button>
    <question-add :addVisible="addVisible" @close="onClose"></question-add>
    <question-info></question-info>
  </div>
</template>
<script>
import questionAdd from "./components/QuestionAdd";
import questionInfo from "./components/QuestionInfo";
export default {
  components: { questionAdd, questionInfo },
  data() {
    return {
      addVisible: false,
    };
  },
  methods: {
    // 打开新增答疑弹窗
    onOpenQuestion() {
      this.addVisible = true;
    },
    // 关闭新增答疑弹窗
    onClose() {
      this.addVisible = false;
    },
  },
};
</script>
<style>
</style>
