<template>
  <div>
    <a-modal
      title="新增轮播图"
      :destroyOnClose="true"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      :visible="visible"
      @ok="confirmToUpload"
      @cancel="$emit('uploadIsVisible')"
    >
      <a-form :form="form">
        <a-form-item>
          <image-uploader
            @upload_fileList="getUploadFileList"
            ref="uploadImage"
          ></image-uploader>
        </a-form-item>
        <a-form-item label="排序">
          <a-input-number
            v-decorator="[
              'ordernum',
              {
                initialValue: '0'
              }
            ]"
            :min="0"
            :max="10"
          />
        </a-form-item>

        <a-form-item>
          <a-radio-group @change="radioChange" v-model="radioValue">
            <a-radio :value="0">不跳转</a-radio>
            <!-- 跳转指定产品 -->
            <!-- <a-radio :value="1">跳转到指定产品</a-radio> -->
            <a-radio :value="2">跳转到指定网址</a-radio>
            <a-radio :value="3">跳转到自定义内容</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
      <div style="margin-top: 10px" v-if="jumpWay == 0"></div>
      <div style="margin-top: 10px" v-else-if="jumpWay == 1">
        <a-form>
          <a-form-item label="跳转到指定产品">
            <a-input v-model="carouselurl" />
          </a-form-item>
        </a-form>
      </div>
      <div style="margin-top: 10px" v-else-if="jumpWay == 2">
        <a-form>
          <a-form-item label="跳转到指定网址">
            <a-input v-model="carouselurl" />
          </a-form-item>
        </a-form>
      </div>
      <div style="margin-top: 10px" v-else-if="jumpWay == 3">
        <a-form>
          <a-form-item label="自定义内容">
            <editor-bar
              v-model="MTE"
              :isClear="isClear"
              @change="MTEchange"
            ></editor-bar>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { formatUrl, restoreUrl } from "@/utils/urlTool";
import ImageUploader from "~/tool/ImageUploader.vue";
import EditorBar from "~/tool/wangEnduit.vue";
export default {
  components: {
    ImageUploader,
    EditorBar
  },
  data() {
    return {
      confirmLoading: false,
      urlFiles: [],
      // 清除文本
      isClear: false,
      // 富文本内容
      MTE: "",
      // 跳转方式
      jumpWay: 0,
      // 选择跳转方式
      radioValue: 0,
      form: this.$form.createForm(this),
      // 跳转自定义网址
      carouselurl: ""
    };
  },

  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  computed: {
    visible() {
      return this.isVisible;
    }
  },
  methods: {
    async confirmToUpload() {
      if (this.urlFiles.length == 0) {
        this.$message.error("未上传轮播图");
        return;
      }
      this.$refs.uploadImage.setFolderName("banner/");

      this.confirmLoading = true;
      const params = {
        carouselimgurl: JSON.stringify(formatUrl(this.urlFiles)),
        carouselstatus: this.jumpWay,
        ordernum: this.form.getFieldValue("ordernum")
      };
      switch (this.jumpWay) {
        case 0:
          delete params["carouselurl"];
          break;
        case 1:
          params["carouselurl"] = this.carouselurl;
          break;
        case 2:
          params["carouselurl"] = this.carouselurl;
          break;
        case 3:
          params["carouselurl"] = JSON.stringify(this.MTE);
          break;
        default:
          delete params["carouselurl"];
          console.warn("未添加任何网址或自定义内容");
          break;
      }
      try {
        await this.$post("/backend/carousel", { ...params });
      } catch (e) {
        this.$message.error("新增轮播图出错");
      } finally {
        this.confirmLoading = false;
      }
      this.$message.success("新增轮播图成功");
      this.confirmLoading = false;
      this.$emit("uploadIsVisible", "done");
    },
    //从子组件中获取轮播图信息
    getUploadFileList(record) {
      this.urlFiles = record;
    },
    // 富文本内容
    MTEchange(val) {
      this.MTE = val;
    },
    // 切换轮播图的点击跳转方式
    radioChange(e) {
      this.jumpWay = e.target.value;
    }
  }
};
</script>
<style>
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
