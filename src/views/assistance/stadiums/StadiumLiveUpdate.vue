<template>
  <a-card :bordered="false">
    <a-row type="flex" justify="center">
      <a-col :span="18" offset="6">
        <div class="steps-content">
          <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>
              <!-- <a-form-item label="更新者名称">
                <a-input
                  placeholder="请输入更新者名称"
                  v-decorator="[
                    'title',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入更新者名称'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item> -->
              <a-form-item label="野球场场地">
                <a-select v-model="field" @change="changeMall(field)" style="width: 230px">
                  <a-select-option v-for="(item, index) in fieldList" :key="index" :value="item.id">{{ item.courtname }}</a-select-option>
                </a-select>
              </a-form-item>

              <!-- <a-form-item label="更新者实时更新者"> -->
              <!-- <a-select
                  mode="multiple"
                  :value="value"
                  :filter-option="false"
                  :not-found-content="fetching ? undefined : null"
                  label-in-value
                  placeholder="搜索用户"
                  style="width: 100%"
                  @search="search"
                >
                  <a-spin v-if="fetching" slot="notFoundContent" size="small" />
                  <a-select-option v-for="d in data" :key="d.value">
                    {{ d.wechatname }}
                  </a-select-option>
                </a-select> -->
              <!-- <a-input placeholder="该更新者未存在实时更新者" v-decorator="['liveupdateplayeropenid']"></a-input> -->
              <!-- </a-form-item> -->

              <a-form-item label="更新时间">
                {{ lastestupdate ? lastestupdate : '无更新时间' }}
              </a-form-item>
              <a-form-item label="该球场实时更新者">
                <div v-if="liveupdateplayeropenid.length > 0">
                  <div v-for="item in liveupdateplayeropenid">{{ item.split('-')[1] }}</div>
                </div>
                <div v-else>
                  {{ '未设定更新者' }}
                </div>
              </a-form-item>
              <a-form-item label="更换实时更新者">
                <a @click="$router.push('/yeqiu/user/center')">去选择</a>
              </a-form-item>
              <a-form-item label="实时更新状态">
                <a-radio-group
                  v-decorator="[
                    'liveupdate',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">否</a-radio>
                  <a-radio value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
              <!-- <a-form-item label="更新者图片" required>
                <image-uploader @upload_fileList="uploadFileList" :files="files" ref="picurl"></image-uploader>
              </a-form-item> -->
            </div>
          </a-form>
        </div>
      </a-col>
      <div style="margin-left:130px">
        <a-button type="primary" @click="modalVisible = true">
          <!-- {{ isAdd ? ' 完成，新增更新者' : '完成，保存更新者' }} -->
          {{ '完成，保存信息' }}
        </a-button>
      </div>
    </a-row>
    <a-modal :visible="modalVisible" title="提示" @cancel="modalVisible = false" @ok="confirmSetupMall">
      <!-- {{ isAdd ? '是否要创建该更新者' : '是否要保存编辑该更新者' }} -->
      {{ '是否保存该球场实时更新信息' }}
    </a-modal>
  </a-card>
</template>

<script>
const labelCol = {
  xl: { span: 6 },
  xs: { span: 24 },
  sm: { span: 5 }
}
const wrapperCol = {
  xl: { span: 18 },
  xs: { span: 24 },
  sm: { span: 12 }
}
import DefaultInputTree from '~/tool/DefaultInputTree.vue'
import ImageUploader from '~/tool/ImageUploader.vue'
import { debounce } from '@/utils/debounce.js'
export default {
  components: {
    ImageUploader,
    DefaultInputTree
  },
  data() {
    this.lastFetchId = 0
    return {
      form: this.$form.createForm(this),
      labelCol,
      wrapperCol,
      filesList: [],
      files: [],
      isAdd: true,
      modalVisible: false,
      changedInfo: null,
      field: 0,
      fieldList: [],
      liveupdateplayeropenid: [],
      data: [],
      value: [],
      fetching: false
    }
  },
  watch: {
    $route: {
      handler(to, from) {
        // 判断url路径中是否传参
        if (to.query && to.query.id) {
          // 有则修改更新者信息
          this.changeMall(to.query.id)
        } else {
          // 无则新增更新者信息
          this.addMall()
          this.getFieldList()
        }
      },
      immediate: true
    }
  },
  methods: {
    // 防抖操作
    search: debounce('fetchUser', 500, false),
    // 查询用户
    fetchUser(value) {
      this.data = []
      this.$get('/wechatcustomer/ListLike', { wechatname: value }).then(data => {
        this.data = data.data.data.rows
      })
    },
    handleChange(value) {
      Object.assign(this, {
        value,
        data: [],
        fetching: false
      })
    },
    // 选择球馆方式
    async getFieldList() {
      const res2 = await this.$get('/gymAndStadium')
      if (res2.data.data) {
        this.fieldList = res2.data.data.filter(item => item.category === '1')
      }
      this.fieldList.unshift({ id: 0, courtname: '未选定球场' })
    },
    // 获取更新者内容
    async changeMall(id) {
      this.getFieldList()
      this.isAdd = false
      const res = await this.$get('/gymAndStadiumById', { id: id })
      const result = res.data.data
      this.changedInfo = result
      this.field = this.changedInfo.id
      if (this.changedInfo.liveupdateplayeropenid && JSON.parse(this.changedInfo.liveupdateplayeropenid).length > 0) {
        this.liveupdateplayeropenid = JSON.parse(this.changedInfo.liveupdateplayeropenid)
      }
      this.lastestupdate = this.changedInfo.lastestupdate
      this.form.setFieldsValue({
        liveupdate: result.liveupdate
        // liveupdateplayeropenid: result.liveupdateplayeropenid
      })
    },
    // 新增并清除页面信息
    addMall() {
      this.isAdd = true
      this.files = []
      this.field = 0
      this.liveupdateplayeropenid = []
      this.lastestupdate = ''
      this.form.resetFields()
    },
    //从子组件中获取更新者的图片
    uploadFileList(record) {
      this.filesList = record
    },
    // 提交产品
    async confirmSetupMall() {
      this.form.validateFields(async (err, value) => {
        if (err) {
          this.$message.error('提交失败，检查参数')
          console.error('错误表单信息：', err)
          return
        }
        console.info('表单信息', value)
        const params = {
          ...value
        }
        // 判断是否是新增
        if (this.isAdd) {
          await this.$post('/gymAndStadium', { ...params })
          this.$message.success('提交成功')
        } else {
          params['id'] = this.changedInfo.id
          await this.$post('/gymAndStadium/update', { ...params })
          this.$message.success('保存成功')
        }
        this.filesList = []
        this.files = []
        this.field = 0
        this.liveupdateplayeropenid = []
        this.lastestupdate = ''
        this.form.resetFields()
        this.modalVisible = false
      })
    }
  }
}
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  width: 800px;
}

.steps-action {
  margin-top: 24px;
}
</style>
