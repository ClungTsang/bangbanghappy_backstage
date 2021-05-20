<template>
  <div>
    <a-modal
      v-model="judge"
      title="填写相关内容"
      @ok="confirmToUpload"
      :confirm-loading="confirmLoading"
      @cancel="cancelToUpload"
    >
      <banner-upload-image ref="UploadImage" v-on="$listeners"
        >上传图片</banner-upload-image>
    </a-modal>
  </div>
</template>
<script>
import BannerUploadImage from "./BannerUploadImage";

export default {
  data() {
    return {
      confirmLoading: false,
    };
  },
  components: {
    BannerUploadImage,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    judge() {
      return this.isVisible;
    },
  },
  methods: {
    // 通知父组件关闭modal
    cancelToUpload() {
      this.$emit("changeIsVisible");
    },
    confirmToUpload() {
      // 调用节点方法，上传图片至数据库
      this.$refs.UploadImage.afterUpload();
      this.$message.success("添加成功");
      // 关闭modal
      this.$emit("changeIsVisible");
    },
    //从子组件中获取腾讯云存储信息
    //改变上传限制数量
    changeNum(val) {
      this.$refs.UploadImage.changeNum(val);
    },
    // 获取图片本地url
    getBase64(img, callback) {
      const reader = new FileReader();
      reader.addEventListener("load", () => callback(reader.result));
      reader.readAsDataURL(img);
    },
  },
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
