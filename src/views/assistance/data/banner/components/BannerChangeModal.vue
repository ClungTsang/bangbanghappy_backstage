<template>
  <div>
    <a-modal
      v-model="judge"
      title="填写相关内容"
      :destroyOnClose="true"
      :maskClosable="false"
      :confirm-loading="confirmLoading"
      @ok="confirmToUpload"
      @cancel="cancelToUpload"
    >
      <banner-change-image
        ref="UploadImage"
        v-on="$listeners"
        :files="files"
        @uploadImage="uploadImage"
      ></banner-change-image>
    </a-modal>
  </div>
</template>
<script>
import BannerChangeImage from "./BannerChangeImage.vue";
export default {
  data() {
    return {
      confirmLoading: false,
      files: [],
    };
  },
  components: {
    BannerChangeImage,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    targetId: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    judge() {
      return this.isVisible;
    },
  },
  watch: {
    targetId(targetId) {
      this.getBannerInfo(targetId);
    },
  },
  methods: {
    // 通知父组件关闭modal
    cancelToUpload() {
      this.$emit("closeChangeModal");
    },
    confirmToUpload() {
      // 调用节点方法，上传图片至数据库
      this.$refs.UploadImage.afterUpload();
    },
    uploadImage() {
      this.$emit("closeChangeModal");
    },
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
    getBannerInfo(targetId) {
      this.files = [];
      this.$get("backend/carousel", { id: targetId }).then((res) => {
        this.files.push(res.data.data);
      });
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
