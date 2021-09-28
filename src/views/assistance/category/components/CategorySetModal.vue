<template>
  <div>
    <a-modal
      :title="title"
      :visible="visible"
      :width="500"
      :confirm-loading="confirmLoading"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="() => $emit('close')"
    >
      <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
        <!-- <a-form-item label="上级分类" required>
          <default-input-tree @change="handleCategoryChange" ref="categoryTree" :treePlaceholder="'选择上级分类'" :isLoadTree="'loadCategoryTree'"></default-input-tree>
        </a-form-item> -->
        <a-form-item label="分类名称">
          <a-input placeholder="请输入分类名称" v-model="form.text"></a-input>
        </a-form-item>

        <!-- <a-form-item label="顺序号">
          <a-input-number
            v-decorator="[
              'ordernum',
              {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '请选择'
                  }
                ]
              }
            ]"
            :min="0"
            :max="20"
          />
        </a-form-item> -->
        <!-- <a-form-item label="是否显示">
          <a-radio-group
            v-decorator="[
              'isdisplay',
              {
                initialValue: '1',
                rules: [
                  {
                    required: true,
                    message: '请选择'
                  }
                ]
              }
            ]"
          >
            <a-radio value="1">是</a-radio>
            <a-radio value="0">否</a-radio>
          </a-radio-group>
        </a-form-item> -->
        <!-- <a-form-item label="分类图标" required>
          <image-uploader
            @upload_fileList="getUploadFileList"
            ref="iconurl"
            :files="files"
          ></image-uploader>
        </a-form-item> -->
      </a-form>
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
import uuid from "@/utils/uuid";
// import { formatUrl, restoreUrl } from "@/utils/urlTool2";
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
import ImageUploader from "~/tool/ImageUploader.vue";
export default {
  components: {
    ImageUploader,
    DefaultInputTree,
    targetCategoryInfo: null
  },
  props: {
    categorySetVisible: {
      type: Boolean,
      default: false
    },
    targetCategory: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      labelCol,
      wrapperCol,
      form: this.$form.createForm(this),
      urlFiles: [],
      confirmLoading: false,
      files: [],
      pid: 0,
      isAdd: true,
      myStoreInfo: null,
      form: {
        text: ""
      }
    };
  },
  computed: {
    visible() {
      return this.categorySetVisible;
    },
    title() {
      return this.isAdd ? "新增分类信息" : "编辑分类信息";
    }
  },
  watch: {
    visible: {
      handler(visible) {
        if (visible) {
          console.info("需要变更的分类信息：", this.targetCategory);
          this.getMyStoreInfo();
          // this.getCategoryById(this.targetCategory);
          this.setCategoryInfo(this.targetCategory);
        }
      },
      immediate: true
    }
  },
  methods: {
    // 分类方式
    handleCategoryChange(value) {
      console.info("选择的父亲id：", value);
      this.pid = value;
    },
    // 确定俺妞妞
    async handleOk() {
      if (this.form.text == "") {
        this.$message.error("未填写分类名");
        return;
      }
      // if (this.urlFiles.length == 0) {
      //   console.warn("未上传分类图片");
      //   this.$message.error("未上传分类图片");
      //   return;
      // }
      const params = {
        storeid: this.myStoreInfo.id,
        text: this.form.text
        // iconurl: JSON.stringify(formatUrl(this.urlFiles)),
        // pid: this.pid
      };

      // 判断是否是新增
      if (this.isAdd) {
        console.info("新增分类信息：", params);
        await this.$post("/backend/business/LantianDishesclassificationtable", {
          ...params
        });
        this.$message.success("新增成功");
        this.$emit("addCategoryDone");
        this.$bus.$emit("addCategoryDone");
      } else {
        params["id"] = this.targetCategoryInfo.id;
        await this.$put("/backend/business/LantianDishesclassificationtable", {
          ...params
        });
        this.$message.success("保存成功");
        this.$emit("addCategoryDone");
      }
    },
    //从子组件中获取图片信息
    getUploadFileList(record) {
      this.urlFiles = record;
    },
    // 获取门店信息
    async getMyStoreInfo() {
      const user = this.$db.get("USER");
      const res = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      this.myStoreInfo = res.data.data;
    },
    // 设置分类信息
    async setCategoryInfo(targetCategory) {
      if (targetCategory.id === 0) {
        this.isAdd = true;
        this.targetCategoryInfo = null;
        this.form.text = "";
      } else {
        this.isAdd = false;
        this.targetCategoryInfo = targetCategory;
        this.form.text = targetCategory.text;
      }
    }
  }
};
</script>
