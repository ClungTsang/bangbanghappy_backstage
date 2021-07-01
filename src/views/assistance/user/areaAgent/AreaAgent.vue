<template>
  <a-card :bordered="false">
    <!-- 信息展示 -->
    <area-agent-info></area-agent-info>
  </a-card>
</template>
<script>
import AreaAgentInfo from "./components/AreaAgentInfo.vue";
export default {
  components: { AreaAgentInfo },
};
</script>
