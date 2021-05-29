<template>
  <div>
    <question-add></question-add>
    <question-info></question-info>
  </div>
</template>
<script>
import questionAdd from "./components/questionAdd.vue";
import QuestionInfo from "./components/questionInfo.vue";
export default {
  components: { questionAdd, QuestionInfo },
};
</script>
<style>
</style>
