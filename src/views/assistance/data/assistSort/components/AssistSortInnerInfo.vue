<template>
  <div>
    <a-card title="校内分类" :bordered="false" style="width: 800px">
      <a-button class="editable-add-btn" @click="handleAddInner"
        >新增校内服务分类</a-button
      >
      <a-table bordered :data-source="innerDataSource" :columns="columns">
        <template slot="sort" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.key, 'sort', $event)"
          />
        </template>
        <template slot="fee" slot-scope="text, record">
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.key, 'fee', $event)"
          />
        </template>
        <template slot="operation" slot-scope="text, record">
          <a-popconfirm
            v-if="innerDataSource.length"
            title="确认删除?"
            @confirm="() => onDeleteInner(record.key)"
          >
            <a href="javascript:;">删除该分类</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-card>
  </div>
</template>
<script>
import EditableCell from '../../../../../components/editablecell/EditableCell';
export default {
  components: {
    EditableCell,
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
          dataIndex: "sort",
          scopedSlots: { customRender: "sort" },
        },
        {
          title: "服务费用",
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
    onCellChangeInner(key, dataIndex, value) {
      const innerDataSource = [...this.innerDataSource];
      const target = innerDataSource.find((item) => item.key === key);
      if (target) {
        target[dataIndex] = value;
        this.innerDataSource = innerDataSource;
      }
    },
    onDeleteInner(key) {
      const innerDataSource = [...this.innerDataSource];
      this.innerDataSource = innerDataSource.filter((item) => item.key !== key);
    },
    handleAddInner() {
      const { innerCount, innerDataSource } = this;
      const newData = {
        key: innerCount,
        sort: `校内服务`,
        fee: 2,
      };
      this.innerDataSource = [...innerDataSource, newData];
      this.innerCount = innerCount + 1;
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
