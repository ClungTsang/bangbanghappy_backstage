<template>
  <div>
    <div style="margin: 10px">
      <a-button type="primary" @click="addText">新增关键词</a-button>
    </div>
    <a-transfer
      :data-source="dataSource"
      :titles="['不启用敏感词', '启用敏感词']"
      :target-keys="targetKeys"
      :list-style="{
        width: '250px',
        height: '500px',
      }"
      :render="(item) => item.title"
      @change="handleChange"
      @selectChange="handleSelectChange"
      @scroll="handleScroll"
    >
      <a-button
        slot="footer"
        slot-scope="props"
        size="small"
        style="float: right; margin: 5px"
        @click="deleteText"
      >
        删除
      </a-button>
    </a-transfer>
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
      moveKeys: [],
      selectedKeys: [],
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
    handleSelectChange(sourceSelectedKeys, targetSelectedKeys) {
      // this.moveKeys = moveKeys;

      this.selectedKeys = [...sourceSelectedKeys, ...targetSelectedKeys];

      // console.log("sourceSelectedKeys: ", sourceSelectedKeys);
      // console.log("targetSelectedKeys: ", targetSelectedKeys);
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
    deleteText() {
      // console.log(this.selectedKeys);
      this.selectedKeys.forEach((item) => {
        this.$get("/helpSensitiveWord/delete", { id: item }).then(() => {});
      });
      this.$message.success("删除敏感词成功");
      setTimeout(() => {
        this.getTextSensitivityList();
      }, 500);
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
