<template>
  <div>
    <a-card
      title="校园社区服务分类"
      :bordered="false"
    >
      <a-button
        class="editable-add-btn"
        @click="handleAddInner"
      >新增校园社区服务分类</a-button>
      <a-table
        bordered
        :data-source="innerDataSource"
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
            @change="onCellChangeInner(record.key, 'service', $event)"
          />
        </template>
        <template
          slot="cost"
          slot-scope="text, record"
        >
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.key, 'cost', $event)"
          />
        </template>
        <template
          slot="suggestionTime"
          slot-scope="text, record"
        >
          <editable-cell
            :text="text"
            @change="onCellChangeInner(record.key, 'suggestionTime', $event)"
          />
        </template>
        <template
          slot="operation"
          slot-scope="text, record"
        >
          <a-popconfirm
            v-if="innerDataSource.length"
            title="确认删除?"
            @confirm="onDeleteInner(record.key)"
          >
            <a href="javascript:;">删除该分类</a>
          </a-popconfirm>
          <!-- <div class="editable-row-operations">
            <span v-if="record.editable">
              <a @click="save(record.key)">保存</a>
              <a-popconfirm
                title="确认删除？"
                @confirm="cancel(record.key)"
              >
                <a>取消</a>
              </a-popconfirm>
            </span>
            <span v-else>
              <a
                :disabled="editingKey !== ''"
                @click="edit(record.key)"
              >编辑</a>
            </span>
          </div> -->
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
      innerCount: 0,
      innerDataSource: [],
      columns: [
        {
          title: '分类名称',
          dataIndex: 'service',
          width: 300,
          align: 'center',
          scopedSlots: { customRender: 'service' },
        },
        {
          title: '服务费用（元）',
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
      editingKey: '',
    }
  },
  methods: {
    // 获取援助分类列表
    getAssistSort() {
      this.innerDataSource = []
      this.$get('aidServiceType').then((res) => {
        const data = res.data.data
        data.forEach((item) => {
          if (item.oncampus == 1) {
            this.innerDataSource.push({
              key: item.id,
              service: item.service,
              cost: item.cost,
              suggestionTime: item.suggestionTime,
            })
          }
        })
      })
    },
    onCellChangeInner(key, dataIndex, value) {
      const innerDataSource = [...this.innerDataSource]
      // console.log(innerDataSource.some((item) => item.service === value))
      if (innerDataSource.some((item) => item.service === value)) {
        this.$message.error('修改失败，存在相同分类名称！')
        this.getAssistSort()
        return
      } else if (innerDataSource.some((item) => item.service == 294)) {
        this.$message.error('该分类为必需分类，不能编辑命名！')
        this.getAssistSort()
        return
      } else {
        const target = innerDataSource.find((item) => item.key === key)
        if (target) {
          target[dataIndex] = value
          this.innerDataSource = innerDataSource
          this.onChangeInfo(key)
        }
      }
    },
    async onDeleteInner(key) {
      if (key == 294) {
        this.$message.error('该分类为必需分类，不能删除！')
        return
      }
      this.$message.success('删除成功')
      let innerDataSource = this.innerDataSource.filter((item) => {
        return item.key !== key
      })
      this.innerDataSource = innerDataSource
      await this.$get('/aidServiceType/delete', { id: key })
    },
    handleAddInner() {
      const newData = {
        service: `校园社区服务${this.innerCount}`,
        cost: 2,
        oncampus: 1,
        suggestionTime: 10,
      }
      this.$post('/aidServiceType', { ...newData })
        .then(
          () => {
            this.innerCount += 1
            return this.getAssistSort()
          },
          () => {
            this.$message.error('存在相同分类名称')
          }
        )
        .catch(() => {
          this.$message.error('存在相同分类名称')
        })
    },
    onChangeInfo(key) {
      if (key == 294) {
        this.$message.error('该分类为系统固定分类，不能编辑该分类名称！')
        this.getAssistSort()
        return
      }
      const innerDataSource = [...this.innerDataSource]
      const target = innerDataSource.find((item) => item.key === key)
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
    edit(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = key
      if (target) {
        target.editable = true
        this.data = newData
      }
    },
    save(key) {
      const newData = [...this.data]
      const newCacheData = [...this.cacheData]
      const target = newData.filter((item) => key === item.key)[0]
      const targetCache = newCacheData.filter((item) => key === item.key)[0]
      if (target && targetCache) {
        delete target.editable
        this.data = newData
        Object.assign(targetCache, target)
        this.cacheData = newCacheData
      }
      this.editingKey = ''
    },
    cancel(key) {
      const newData = [...this.data]
      const target = newData.filter((item) => key === item.key)[0]
      this.editingKey = ''
      if (target) {
        Object.assign(
          target,
          this.cacheData.filter((item) => key === item.key)[0]
        )
        delete target.editable
        this.data = newData
      }
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
