<template>
  <div>
    <a-row type="flex" justify="space-around" align="top">
      <a-col :span="12">
        <assist-sort-inner-info></assist-sort-inner-info>
      </a-col>
      <a-col :span="12">
        <assist-sort-outer-info></assist-sort-outer-info>
      </a-col>
    </a-row>
  </div>
</template>
<script>
import AssistSortInnerInfo from "./components/AssistSortInnerInfo.vue";
import AssistSortOuterInfo from "./components/AssistSortOuterInfo.vue";
export default {
  components: { AssistSortInnerInfo, AssistSortOuterInfo },
};
</script>
<style>
</style>
