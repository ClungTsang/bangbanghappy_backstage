<template>
  <a-card :bordered="false">
    <!-- 信息展示 -->
    <agent-center-info></agent-center-info>
  </a-card>
</template>
<script>
import AgentCenterInfo from "./components/AgentCenterInfo.vue";
export default {
  components: { AgentCenterInfo },
};
</script>
