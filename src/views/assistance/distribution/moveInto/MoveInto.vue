<template>
  <a-card :bordered="false">
    <move-into-info></move-into-info>
  </a-card>
</template>
<script>
import MoveIntoInfo from "./components/MoveIntoInfo.vue";
export default {
  components: { MoveIntoInfo },
};
</script>
<style>
</style>
