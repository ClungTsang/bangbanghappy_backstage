<template>
  <div>
    <a-card
      title="自定义区服务分类"
      :bordered="false"
    >
      <a-button
        class="editable-add-btn"
        @click="handleAddOuter"
      >新增自定义区服务分类</a-button>
      <a-table
        bordered
        :data-source="outerDataSource"
        :defaultExpandAllRows="true"
        :pagination="false"
        :columns="columns"
      >
        <template
          slot="service"
          slot-scope="text, record"
        >
          <editable-cell
            :text="text"
            @change="onCellChangeOuter(record.key, 'service', $event)"
          />
        </template>
        <template
          slot="cost"
          slot-scope="text, record"
        >
          <editable-cell
            :text="text"
            @change="onCellChangeOuter(record.key, 'cost', $event)"
          />
        </template>
        <template
          slot="suggestionTime"
          slot-scope="text, record"
        >
          <editable-cell
            :text="text"
            @change="onCellChangeOuter(record.key, 'suggestionTime', $event)"
          />
        </template>
        <template
          slot="operation"
          slot-scope="text, record"
        >
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
import EditableCell from '@/components/editablecell/EditableCell'
export default {
  components: {
    EditableCell,
  },
  created() {
    this.getAssistSort()
  },
  data() {
    return {
      outerCount: 0,
      outerDataSource: [],
      columns: [
        {
          title: '分类名称',
          dataIndex: 'service',
          width: 300,
          align: 'center',
          scopedSlots: { customRender: 'service' },
        },
        {
          title: '建议服务费用（元）',
          dataIndex: 'cost',
          align: 'center',
          width: 170,
          scopedSlots: { customRender: 'cost' },
        },
        {
          title: '建议服务时间（分钟）',
          dataIndex: 'suggestionTime',
          align: 'center',
          width: 130,
          scopedSlots: { customRender: 'suggestionTime' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          align: 'center',
          width: 130,
          scopedSlots: { customRender: 'operation' },
        },
      ],
    }
  },
  methods: {
    // 获取援助分类列表
    getAssistSort() {
      this.outerDataSource = []
      this.$get('aidServiceType').then((res) => {
        const data = res.data.data
        data.forEach((item) => {
          if (item.oncampus == 0) {
            this.outerDataSource.push({
              key: item.id,
              service: item.service,
              cost: item.cost,
              suggestionTime: item.suggestionTime,
            })
          }
        })
      })
    },

    onCellChangeOuter(key, dataIndex, value) {
      const outerDataSource = [...this.outerDataSource]
      if (outerDataSource.some((item) => item.service === value)) {
        this.$message.error('修改失败，存在相同分类名称！')
        this.getAssistSort()
        return
      } else {
        const target = outerDataSource.find((item) => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.outerDataSource = outerDataSource
          this.onChangeInfo(key)
        }
      }
    },
    onDeleteOuter(key) {
      this.$get('/aidServiceType/delete', { id: key }).then(() => {
        this.$message.success('删除成功')
        const outerDataSource = [...this.outerDataSource]
        this.outerDataSource = outerDataSource.filter(
          (item) => item.key !== key
        )
      })
    },
    handleAddOuter() {
      const newData = {
        service: `自定义区服务${this.outerCount}`,
        cost: 2,
        oncampus: 0,
        suggestionTime: 10,
      }
      this.$post('/aidServiceType', { ...newData }).then(
        () => {
          this.outerCount += 1
          return this.getAssistSort()
        },
        () => {
          this.$message.error('存在相同分类名称')
        }
      )
    },
    onChangeInfo(key) {
      const outerDataSource = [...this.outerDataSource]
      const target = outerDataSource.find((item) => item.key === key)
      this.$post('/aidServiceType/update', {
        id: target.key,
        service: target.service,
        cost: target.cost,
        suggestionTime: target.suggestionTime,
      }).then(() => {
        this.$message.success('更新成功')
        this.getAssistSort()
      })
    },
  },
}
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
