<template>
  <div style="width:100%">
    <a-row type="flex" justify="center">
      <a-col :span="14">
        <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
          <a-form-item label="球场类别" required>
            <a-select v-model="courtcategory" style="width: 230px">
              <a-select-option
                v-for="(item, index) in courtCategoryList"
                :key="index"
                :value="item"
                >{{ item }}</a-select-option
              >
            </a-select>
          </a-form-item>
          <a-form-item label="球场范围">
            <a-radio-group
              v-decorator="[
                'place',
                {
                  initialValue: '0'
                }
              ]"
            >
              <a-radio value="0">全场</a-radio>
              <a-radio value="1">半场</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="球场名称" required>
            <a-input
              placeholder="请输入球场名称"
              v-decorator="[
                'courtname',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入球场名称'
                    }
                  ]
                }
              ]"
            ></a-input>
          </a-form-item>
          <a-form-item label="球场简介" required>
            <a-textarea
              :auto-size="{ minRows: 7 }"
              placeholder="请输入球场简介"
              v-decorator="[
                'introduction',
                {
                  rules: [
                    {
                      required: true,
                      message: '请输入球场简介'
                    }
                  ]
                }
              ]"
            ></a-textarea>
          </a-form-item>
          <a-form-item label="开放状态">
            <a-radio-group
              v-decorator="[
                'openstatus',
                {
                  initialValue: '0'
                }
              ]"
            >
              <a-radio value="0">不激活</a-radio>
              <a-radio value="1">激活</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-form-item label="球场标签" required>
            <template v-for="tag in tags">
              <a-checkable-tag
                :key="tag"
                :checked="selectedTags.indexOf(tag) > -1"
                @change="checked => handleChange(tag, checked)"
              >
                {{ tag }}
              </a-checkable-tag>
            </template>
          </a-form-item>
          <a-form-item label="球场图片" required>
            <image-uploader
              :files="fileList"
              ref="stadiumFieldLogo"
              @upload_fileList="getUploadFileList"
            ></image-uploader>
          </a-form-item>
          <a-form-item label="球场等级" required>
            <a-rate v-model="grade" allow-half />
          </a-form-item>
          <!-- <a-form-item label="建议消费金额（元）">
            <a-input-number
              :step="1"
              v-decorator="[
                'averageprice',
                {
                  initialValue: '1',
                  rules: [
                    {
                      required: true,
                      message: '请设置建议消费金额'
                    }
                  ]
                }
              ]"
              :min="1"
              :max="99999999999"
            />
          </a-form-item> -->
        </a-form>
      </a-col>
      <a-col :span="14" offset="2">
        <a-button type="primary" @click="modalVisible = true">
          {{ isAdd ? "完成，创建球场" : "完成，保存球场" }}
        </a-button>
      </a-col>
    </a-row>
    <a-modal
      :visible="modalVisible"
      title="提示"
      @cancel="modalVisible = false"
      @ok="confirmSetStadiumField"
    >
      {{ isAdd ? "是否要创建该球场" : "是否要保存编辑该球场" }}
    </a-modal>
  </div>
</template>

<script>
const labelCol = {
  xl: { span: 4 },
  xs: { span: 24 },
  sm: { span: 5 }
};
const wrapperCol = {
  xl: { span: 20 },
  xs: { span: 24 },
  sm: { span: 12 }
};
// import { formatUrl, restoreFiles } from '@/utils/urlTool'
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
import ImageUploader from "~/tool/ImageUploader.vue";
import MapSelector from "@/components/tool/MapSelector.vue";
import { mapState } from "vuex";
export default {
  components: {
    ImageUploader,
    DefaultInputTree,
    MapSelector
  },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol,
      wrapperCol,
      stadiumFieldLogoFiles: [],
      modalVisible: false,
      coverphotos: [],
      fileList: [],
      isAdd: true,
      changedStadiumFieldInfo: null,
      grade: 2.5,
      tags: [],
      selectedTags: [],
      courtCategoryList: [],
      courtcategory: "请选择球场"
    };
  },
  computed: {
    ...mapState({
      user: state => state.account.user
    })
  },
  watch: {
    $route: {
      handler(to, from) {
        // 判断url路径中是否传参
        if (to.query && to.query.id) {
          // 有则修改商品
          this.changeStadiumField(to.query.id);
        } else {
          // 无则新增商品
          this.addStadiumField();
        }
      },
      immediate: true
    }
  },
  mounted() {
    // 获取全局球场可选标签
    this.getTagsList();
    // 获取球场类别列表
    this.getCourtCategoryList();
    //改变上传轮播图数量
    this.$refs.stadiumFieldLogo.changeNum(10);
    //取消限制多选上传轮播图
    this.$refs.stadiumFieldLogo.changeMultiple();
    // 设定文件夹路径
    this.$refs.stadiumFieldLogo.setFolderName("stadium/field");
  },
  methods: {
    //从子组件中获取球场logo
    getUploadFileList(record) {
      this.stadiumFieldLogoFiles = record;
    },
    // 获取标签信息
    async getTagsList() {
      const res = await this.$get("/rootDataById", { id: 14 });
      this.tags = res.data.data.valuedata.split(",").map(item => item);
    },
    // 提交产品
    confirmSetStadiumField() {
      this.form.validateFields(async (err, value) => {
        this.modalVisible = false;
        if (err) {
          this.$message.error("提交失败，检查参数");
          return;
        }
        if (this.courtcategory === "请选择球场") {
          this.$message.error("未选择球场分类");
          return;
        }
        if (this.selectedTags.length == 0) {
          this.$message.error("未选择球场标签");
          return;
        }
        if (this.stadiumFieldLogoFiles.length == 0) {
          this.$message.error("未上传球场图");
          return;
        }

        const params = {
          ...value,
          coverphotos: formatUrl(this.stadiumFieldLogoFiles),
          courtcategory: this.courtcategory,
          grade: parseFloat(this.grade).toFixed(1),
          gymandstadiumid: this.user.email,
          tags: this.selectedTags.join(",")
        };
        // 判断是否是新增
        if (this.isAdd) {
          await this.$post("/gymCourt", { ...params });
          this.$message.success("提交成功");
        } else {
          params["id"] = this.changedStadiumFieldInfo.id;
          await this.$post("/gymCourt/update", { ...params });
          this.$message.success("保存成功");
        }
      });
    },
    // 根据id获取球场
    async changeStadiumField(id) {
      this.isAdd = false;
      let res = await this.$get("/gymCourtById", { id: id });
      const result = res.data.data;
      this.changedStadiumFieldInfo = result;
      this.fileList = this.$restoreFiles(result.coverphotos);
      let tagsArr = [];
      result.tags.split(",").forEach(item => {
        tagsArr.push(item);
      });
      this.selectedTags = tagsArr;
      this.grade = parseFloat(result.grade);
      this.courtcategory = result.courtcategory;
      this.form.setFieldsValue({
        courtname: result.courtname,
        introduction: result.introduction,
        place: result.place
      });
    },
    // 新增并清除页面信息
    addStadiumField() {
      this.isAdd = true;
      this.selectedTags = [];
      this.grade = 2.5;
      this.stadiumFieldLogoFiles = [];
      this.fileList = [];
      this.form.resetFields();
    },
    // 选择标签
    handleChange(tag, checked) {
      const { selectedTags } = this;
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t !== tag);
      this.selectedTags = nextSelectedTags;
    },
    // 获取全部场地类型
    async getCourtCategoryList() {
      let res = await this.$get("/rootDataById", { id: 13 });
      this.courtCategoryList = res.data.data.valuedata
        .split(",")
        .map(item => item);
    }
  }
};
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
