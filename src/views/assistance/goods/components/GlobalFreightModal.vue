<template>
  <div>
    <a-modal title="全局运费设置" :visible="visible" :destroyOnClose="true" :maskClosable="false" @ok="handleOk" @cancel="handleCancel">
      <a-form>
        <a-form-item label="运费金额（元）">
          <a-row>
            <a-col :span="16">
              <a-slider v-model="slider.value" :min="0" :max="500" />
            </a-col>
            <a-col :span="4" offset="2">
              <a-input-number v-model="slider.value" :min="0" :max="500" />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      slider: {
        value: 0
      }
    }
  },
  props: {
    freightVisible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible() {
      return this.freightVisible
    }
  },
  mounted() {
    this.setData()
  },
  methods: {
    // 渲染数据
    async setData() {
      let res = await this.$get('/rootData')
      let arr = res.data.data.filter(item => {
        return item.id == 4
      })
      this.slider.value = `${arr[0].valuedata}`
    },
    // 复选修改抽成比例方法
    async handleOk() {
      await this.$post('/rootData/update', {
        id: 4,
        valuedata: this.slider.value
      })
      this.$message.success('修改成功')
      this.$emit('close')
    },
    handleCancel() {
      this.$emit('close')
    }
  }
}
</script>
<style></style>
