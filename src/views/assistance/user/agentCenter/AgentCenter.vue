<template>
  <a-card :bordered="false">
    <!-- 修改代理全局内容 -->
    <a-button button type="primary" @click="openChangeAgentSetting">代理配置信息</a-button>
    <!-- 信息展示 -->
    <agent-center-info></agent-center-info>
    <agent-setting-modal
      :agentVisible="agentSettingChangeVisible"
      @close="closeAgentSettingModal"
    ></agent-setting-modal>
  </a-card>
</template>
<script>
import AgentCenterInfo from "./components/AgentCenterInfo.vue";
import AgentSettingModal from "./components/AgentSettingModal.vue";
export default {
  components: { AgentCenterInfo, AgentSettingModal },
  data() {
    return {
      agentSettingChangeVisible: false,
    };
  },
  methods: {
    openChangeAgentSetting() {
      this.agentSettingChangeVisible = true;
    },
    closeAgentSettingModal() {
      this.agentSettingChangeVisible = false;
    },
  },
};
</script>
