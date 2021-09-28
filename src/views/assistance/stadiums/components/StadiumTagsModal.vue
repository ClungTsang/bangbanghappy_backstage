<template>
  <a-modal title="编辑标签属性信息" :visible="visible" :width="300" :destroyOnClose="true" :maskClosable="false" :footer="null" @cancel="() => $emit('close')">
    <template v-for="(tag, index) in tags">
      <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
        <a-tag :key="tag" :closable="index !== 1 && index !== 0" @close="() => handleClose(tag)">
          {{ `${tag.slice(0, 20)}...` }}
        </a-tag>
      </a-tooltip>
      <a-tag v-else :key="tag" :closable="index !== 1 && index !== 0" @close="() => handleClose(tag)">
        {{ tag }}
      </a-tag>
    </template>

    <div style="margin-top:10px">
      <a-input v-if="inputVisible" ref="input" type="text" size="small" :style="{ width: '78px' }" :value="inputValue" @change="handleInputChange" @keyup.enter="handleInputConfirm" />
      <a-tag v-else style="background: #fff; borderStyle: dashed;" @click="showInput">
        <a-icon type="plus" />
        添加标签
      </a-tag>
    </div>
  </a-modal>
</template>

<script>
export default {
  props: {
    tagsVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tags: [],
      inputVisible: false,
      inputValue: ''
    }
  },
  created() {
    this.getTagsList()
  },
  computed: {
    visible() {
      return this.tagsVisible
    }
  },
  methods: {
    async getTagsList() {
      let res = await this.$get('/rootDataById', { id: 12 })
      let resArr = res.data.data.valuedata.split(',')
      console.info(resArr)
      let tagsList = []
      resArr.forEach(item => {
        tagsList.push(item)
      })
      this.tags = tagsList
    },
    async handleClose(removedTag) {
      const tags = this.tags.filter(tag => tag !== removedTag)
      this.tags = tags
      let params = {
        valuedata: tags.join(','),
        id: 12
      }
      await this.$post('/rootData/update', { ...params })
      this.$message.success('删除标签成功')
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick(function() {
        this.$refs.input.focus()
      })
    },

    handleInputChange(e) {
      this.inputValue = e.target.value
    },

    async handleInputConfirm() {
      const inputValue = this.inputValue
      let tags = this.tags
      if (inputValue && tags.indexOf(inputValue) === -1) {
        tags = [...tags, inputValue]
      }
      const params = {
        id: 12,
        valuedata: tags.join(',')
      }
      await this.$post('/rootData/update', { ...params })
      this.$message.success('新增标签成功')
      Object.assign(this, {
        tags,
        inputVisible: false,
        inputValue: ''
      })
    }
  }
}
</script>
