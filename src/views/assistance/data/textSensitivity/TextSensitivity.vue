<template>
  <div>
    <div style="margin: 10px">
      <a-button type="primary" @click="addText">新增关键词</a-button>
    </div>
    <a-transfer
      :data-source="dataSource"
      :titles="['不启用敏感词', '启用敏感词']"
      :target-keys="targetKeys"
      :render="(item) => item.title"
      @change="handleChange"
    />
    <text-sensitivity-add-modal
      :addTextVisible="addTextVisible"
      @close="closeAddModal"
    ></text-sensitivity-add-modal>
  </div>
</template>
<script>
import TextSensitivityAddModal from "./components/TextSensitivityAddModal.vue";
export default {
  components: { TextSensitivityAddModal },
  data() {
    return {
      dataSource: [],
      targetKeys: [],
      addTextVisible: false,
    };
  },
  created() {
    this.getTextSensitivityList();
  },
  methods: {
    handleChange(nextTargetKeys, direction, moveKeys) {
      this.targetKeys = nextTargetKeys;
      // console.log("moveKeys: ", moveKeys);
      // console.log("direction: ", direction);
      if (moveKeys.length > 1) {
        moveKeys.forEach((id) => {
          let params = {
            id: id,
            isDelete: direction == "right" ? 0 : 1,
          };
          this.$post("/helpSensitiveWord/update", { ...params });
        });
      } else {
        let params = {
          id: moveKeys[0],
          isDelete: direction == "right" ? 0 : 1,
        };
        this.$post("/helpSensitiveWord/update", { ...params });
      }
    },
    // 获取敏感词列表s
    async getTextSensitivityList() {
      this.dataSource = [];
      let res = await this.$get("/helpSensitiveWord");
      res.data.data.forEach((item) => {
        let params = {
          key: item.id,
          title: item.name,
        };
        if (item.isDelete == 0) {
          this.targetKeys.push(item.id);
        }
        this.dataSource.push(params);
      });
    },
    // 新增敏感词
    addText() {
      this.addTextVisible = true;
    },
    // 关闭modal
    closeAddModal(info) {
      this.addTextVisible = false;

      if (info == "ok") {
        this.getTextSensitivityList();
      }
    },
  },
};
</script>
