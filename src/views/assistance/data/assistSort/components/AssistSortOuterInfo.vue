<template>
  <div>
    <a-card title="校外分类" :bordered="false" style="width: 800px">
      <a-button class="editable-add-btn" @click="handleAddOuter"
        >新增校外服务分类</a-button
      >
      <a-table bordered :data-source="outerDataSource" :columns="columns">
        <template slot="sort" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeOuter(record.key, 'sort', $event)"
          />
        </template>
        <template slot="fee" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeOuter(record.key, 'fee', $event)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="outerDataSource.length"
            title="确认删除?"
            @confirm="() => onDeleteOuter(record.key)"
          >
            <a href="javascript:;">删除该分类</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import EditableCell from "../../../../../components/editablecell/EditableCell";
export default {
  components: {
    EditableCell,
  },
  created() {
    this.getAssistSort();
  },
  data() {
    return {
      outerCount: 0,
      outerDataSource: [],
      columns: [
        {
          title: "分类名称",
          dataIndex: "sort",
          scopedSlots: { customRender: "sort" },
        },
        {
          title: "建议服务费用",
          dataIndex: "fee",
          scopedSlots: { customRender: "sort" },
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
        },
      ],
    };
  },
  methods: {
    // 获取援助分类列表
    getAssistSort() {
      let token = this.$db.get("USER_TOKEN");

      this.$get("aidOrder", {
        Authentication: token,
      }).then((r) => console.log(r));
    },

    onCellChangeOuter(key, dataIndex, value) {
      const outerDataSource = [...this.outerDataSource];
      const target = outerDataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.outerDataSource = outerDataSource;
      }
    },
    onDeleteOuter(key) {
      const outerDataSource = [...this.outerDataSource];
      this.outerDataSource = outerDataSource.filter((item) => item.key !== key);
    },
    handleAddOuter() {
      const { outerCount, outerDataSource } = this;
      const newData = {
        key: outerCount,
        sort: `校外服务`,
        fee: 3,
      };
      this.outerDataSource = [...outerDataSource, newData];
      this.outerCount = outerCount + 1;
    },
  },
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
