<template>
  <a-modal title="添加球场日程" :width="1200" :destroyOnClose="true" :maskClosable="false" :visible="visible" @ok="handleOk" @cancel="$emit('close')">
    <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
      <a-form-item label="可预约日期">
        <a-date-picker v-model="startDay" />
      </a-form-item>
      <a-form-item label="快捷操作">
        设定时间间隔：
        <a-input-number v-decorator="[`timeGap`]" :step="1" :min="0" :max="99999999999" style="margin:0 10px" />
        设定预约价格：
        <a-input-number v-decorator="[`moneyGap`]" :step="1" :min="0" :max="99999999999" style="margin:0 10px" />
        设定拼单人数：
        <a-input-number v-decorator="[`groupGap`]" :step="1" :min="0" :max="99999999999" style="margin:0 10px" />
        <a-button type="dashed" style="width: 200px" @click="add">
          <a-icon type="plus" />
          增加时段
        </a-button>
      </a-form-item>
      <a-form-item label="可预约时间段" v-for="(k, index) in form.getFieldValue('keys')" :key="k">
        <a-space>
          <a-time-picker v-decorator="[`startTime[${k}]`]" format="HH:mm" />
          ~
          <a-time-picker v-decorator="[`endTime[${k}]`]" format="HH:mm" style="margin-right: 20px" />
          全场预约价格：
          <a-input-number
            :step="1"
            v-decorator="[
              `bookableprice[${k}]`,
              {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '请设置全场预约价格'
                  }
                ]
              }
            ]"
            :min="1"
            :max="99999999999"
          />
          最大拼单人数：
          <a-input-number
            :step="1"
            v-decorator="[
              `teambuyingmax[${k}]`,
              {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '请设置支持最大拼单人数'
                  }
                ]
              }
            ]"
            :min="1"
            :max="99999999999"
          />
        </a-space>
        <a-icon
          style="margin:0 10px"
          v-if="form.getFieldValue('keys').length > 1"
          class="dynamic-delete-button"
          type="minus-circle-o"
          :disabled="form.getFieldValue('keys').length === 1"
          @click="() => remove(k)"
        />
      </a-form-item>

      <!-- <a-form-item label="可预约球场文本颜色">
        <colorPicker v-model="textColor" />
      </a-form-item>
      <a-form-item label="可预约球场背景颜色">
        <colorPicker v-model="backgroundColor" />
      </a-form-item>
      <a-form-item label="可预约球场边框颜色">
        <colorPicker v-model="borderColor" />
      </a-form-item> -->
    </a-form>
  </a-modal>
</template>
<script>
const labelCol = {
  xl: { span: 3 }
}
const wrapperCol = {
  xl: { span: 21 }
}
const formItemLayoutWithOutLabel = {
  wrapperCol: {
    xl: { span: 12, offset: 10 },
    xs: { span: 12, offset: 10 },
    sm: { span: 20, offset: 4 }
  }
}
let id = 0
import { mapState } from 'vuex'
import dayjs from 'dayjs'
export default {
  props: {
    addFieldVisible: {
      type: Boolean,
      default: false
    },
    targetSchedule: {
      type: Object,
      default: () => {}
    },
    insertInfo: {
      type: Object,
      default: () => {}
    },
    isRapid: {
      // 点击或多选操作
      type: Boolean,
      default: false
    }
  },
  computed: {
    visible() {
      return this.addFieldVisible
    },
    ...mapState({
      user: state => state.account.user
    })
  },
  watch: {
    targetSchedule(payload) {
      this.showTargetInfo(payload)
    },
    insertInfo(payload) {
      this.setDefaultInfo(payload)
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.form.getFieldDecorator('keys', { initialValue: [], preserve: true })
  },
  data() {
    return {
      wrapperCol,
      labelCol,
      formItemLayoutWithOutLabel,
      // textColor: '#ff0000',
      // backgroundColor: '#ff0000',
      // borderColor: '#ff0000',
      startDay: '',
      startTime: '',
      endDay: '',
      endTime: '',
      targetInfo: null,
      defaultInfo: null
    }
  },
  methods: {
    // 提交表单
    handleOk() {
      this.form.validateFields(async (err, value) => {
        if (!err) {
          const params = { ...value }
          params.gymcourtid = this.targetInfo.id
          params.gymandstadiumid = this.targetInfo.gymandstadiumid
          // 是否通过滑动或点击选择
          if (this.isRapid) {
            params['openHourTime'] = this.defaultInfo.startTime.split(' ')[1]
            params['endHour'] = this.defaultInfo.endTime.split(' ')[1]
            params['bookabletime'] = this.defaultInfo.bookablehour
          } else {
            params['bookabletime'] = dayjs(this.startDay)
            params['openHourTime'] = dayjs(this.startTime).format('HH:mm')
            params['endHour'] = dayjs(this.endTime).format('HH:mm')
          }
          await this.$post('/bookableOrderInformation', { ...params })
          this.$emit('addDone', params)
          this.$message.success('添加成功')
        } else {
          this.$message.error('检查参数')
          return false
        }
      })
    },
    // 重置表单内容
    resetForm() {
      this.$refs.ruleForm.resetFields()
    },
    // 设定表单初始化值
    setDefaultInfo(defaultInfo) {
      console.log(defaultInfo)
      this.defaultInfo = defaultInfo
    },
    // 动态增减表单项
    remove(k) {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      // We need at least one passenger
      if (keys.length === 1) {
        return
      }

      // can use data-binding to set
      form.setFieldsValue({
        keys: keys.filter(key => key !== k)
      })
    },
    // 动态增减表单项
    add() {
      const { form } = this
      // can use data-binding to get
      const keys = form.getFieldValue('keys')
      const nextKeys = keys.concat(id++)
      // can use data-binding to set
      // important! notify form to detect changes
      form.setFieldsValue({
        keys: nextKeys
      })
    },
    // 查看点击事件内容
    showTargetInfo(targetSchedule) {
      this.targetInfo = targetSchedule
      console.log(this.targetInfo)
      // this.form.setFieldsValue({
      //   teambuyingmax: targetSchedule.teambuyingmax,
      //   bookableprice: targetSchedule.bookableprice
      // })
      // if (targetSchedule.endStr.format('YYYY-MM-DD HH:mm:ss').includes(' ')) {
      //   this.form.endDay = end.split(' ')[0]
      //   this.form.endTime = end.split(' ')[1]
      // } else {
      //   this.form.endDay = targetSchedule.endStr
      // }
      // if (targetSchedule.startStr.format('YYYY-MM-DD HH:mm:ss').includes(' ')) {
      //   this.form.startDay = start.split(' ')[0]
      //   this.form.startTime = start.split(' ')[1]
      // } else {
      //   this.form.startDay = targetSchedule.startStr
      // }
    },
    // 格式化日期时间
    formatDate(day) {
      return dayjs(day).format('YYYY-MM-DD HH:mm:ss')
    },
    // 格式化时间
    formatHours(startTime, endTime) {
      return dayjs(startTime).format('HH:mm:ss') + '-' + dayjs(endTime).format('HH:mm:ss')
    }
  }
}
</script>
<style>
.dynamic-delete-button {
  cursor: pointer;
  position: relative;
  top: 4px;
  font-size: 24px;
  color: #999;
  transition: all 0.3s;
}
.dynamic-delete-button:hover {
  color: #777;
}
.dynamic-delete-button[disabled] {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>
