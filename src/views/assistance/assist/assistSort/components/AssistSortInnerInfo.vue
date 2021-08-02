<template>
  <div>
    <a-card title="校园社区服务分类" :bordered="false">
      <a-button class="editable-add-btn" @click="handleAddInner"
        >新增校园社区服务分类</a-button
      >
      <a-table
        bordered
        :data-source="innerDataSource"
        :defaultExpandAllRows="true"
        :pagination="false"
        :columns="columns"
      >
        <template slot="service" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.id, 'service', $event)"
          />
        </template>
        <template slot="cost" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.id, 'cost', $event)"
          />
        </template>
        <template slot="suggestionTime" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.id, 'suggestionTime', $event)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="innerDataSource.length"
            title="确认删除?"
            @confirm="() => onDeleteInner(record.id)"
          >
            <a href="javascript:;">删除该分类</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import EditableCell from "@/components/editablecell/EditableCell";
export default {
  components: {
    EditableCell
  },
  created() {
    this.getAssistSort();
  },
  data() {
    return {
      innerCount: 0,
      innerDataSource: [],
      columns: [
        {
          title: "分类名称",
          dataIndex: "service",
          width: 300,
          align: "center",
          scopedSlots: { customRender: "service" }
        },
        {
          title: "服务费用（元）",
          dataIndex: "cost",
          align: "center",
          width: 170,
          scopedSlots: { customRender: "cost" }
        },
        {
          title: "建议服务时间（分钟）",
          dataIndex: "suggestionTime",
          align: "center",
          width: 130,
          scopedSlots: { customRender: "suggestionTime" }
        },
        {
          title: "操作",
          dataIndex: "operation",
          align: "center",
          width: 130,
          scopedSlots: { customRender: "operation" }
        }
      ]
    };
  },
  methods: {
    // 获取援助分类列表
    getAssistSort() {
      this.innerDataSource = [];
      this.$get("aidServiceType").then(res => {
        const data = res.data.data;
        data.forEach(item => {
          if (item.oncampus == 1) {
            this.innerDataSource.push({
              id: item.id,
              service: item.service,
              cost: item.cost,
              suggestionTime: item.suggestionTime
            });
          }
        });
      });
    },
    onCellChangeInner(id, dataIndex, value) {
      const innerDataSource = [...this.innerDataSource];
      const target = innerDataSource.find(item => item.id === id);

      if (target) {
        target[dataIndex] = value;
        this.innerDataSource = innerDataSource;
        this.onChangeInfo(id);
      }
    },
    onDeleteInner(id) {
      if (id == 294) {
        this.$message.error("该分类为必需分类，不能删除！");
        return;
      }
      this.$get("/aidServiceType/delete", { id: id }).then(() => {
        const innerDataSource = [...this.innerDataSource];
        this.innerDataSource = innerDataSource.filter(item => item.id !== id);
      });
    },
    handleAddInner() {
      const newData = {
        service: `校园社区服务${this.innerCount}`,
        cost: 2,
        oncampus: 1,
        suggestionTime: 10
      };
      this.$post("/aidServiceType", { ...newData }).then(
        () => {
          this.innerCount += 1;
          return this.getAssistSort();
        },
        () => {
          this.$message.error("存在相同分类名称");
        }
      );
    },
    onChangeInfo(id) {
      if (id == 294) {
        this.$message.error("该分类为系统固定分类，不能编辑该分类名称！");
        this.getAssistSort();
        return;
      }
      const innerDataSource = [...this.innerDataSource];
      const target = innerDataSource.find(item => item.id === id);
      this.$post("/aidServiceType/update", {
        id: target.id,
        service: target.service,
        cost: target.cost,
        suggestionTime: target.suggestionTime
      }).then(() => {
        this.$message.success("更新成功");
      });
    }
  }
};
</script>
<style>
.editable-cell {
  position: relative;
}

.editable-cell-input-wrapper,
.editable-cell-text-wrapper {
  padding-right: 24px;
}

.editable-cell-text-wrapper {
  padding: 5px 24px 5px 5px;
}

.editable-cell-icon,
.editable-cell-icon-check {
  position: absolute;
  right: 0;
  width: 20px;
  cursor: pointer;
}

.editable-cell-icon {
  line-height: 18px;
  display: none;
}

.editable-cell-icon-check {
  line-height: 28px;
}

.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}

.editable-cell-icon:hover,
.editable-cell-icon-check:hover {
  color: #108ee9;
}

.editable-add-btn {
  margin-bottom: 8px;
}
</style>
