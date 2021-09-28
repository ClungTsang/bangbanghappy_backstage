<template>
  <div>
    <a-modal title="设置商品信息" :visible="visible" :width="500" :destroyOnClose="true" :confirm-loading="confirmLoading" :maskClosable="false" @ok="handleOk" @cancel="() => $emit('addClose')">
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="">
          <a-input
            placeholder="请输入提货卡名称"
            v-decorator="[
              'giftname',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入提货卡名称'
                  }
                ]
              }
            ]"
          ></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
const labelCol = {
  xl: { span: 4 },
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol = {
  xl: { span: 20 },
  xs: { span: 24 },
  sm: { span: 12 }
}
export default {
  props: {
    goodChangeVisible: {
      type: Boolean,
      default: false
    },
    targetGoodInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol,
      wrapperCol,
      form: this.$form.createForm(this, { name: 'coupon_change_form' }),
      confirmLoading: false,
      coupon: null
    }
  },
  computed: {
    visible() {
      return this.goodChangeVisible
    }
  },
  watch: {
    targetGoodInfo: {
      handler(coupon) {
        this.coupon = coupon
        this.form.setFieldsValue({
          classificationname: coupon.classificationname,
          ordernum: coupon.ordernum,
          isdisplay: coupon.isdisplay
        })
        console.info('需要变更的分类信息：', coupon)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    // 控制开关
    handleOk() {
      this.form.validateFields((err, values) => {
        if (err) {
          console.warn('检查错误信息', err)
          return
        }
        const params = {
          id: this.coupon.id,
          ...values
        }
        console.info('更新分类信息：', params)
        this.$post('/product/update', { ...params }).then(() => {
          this.$message.success('更新成功')
          this.$emit('changeDone')
        })
      })
    }
  }
}
</script>
