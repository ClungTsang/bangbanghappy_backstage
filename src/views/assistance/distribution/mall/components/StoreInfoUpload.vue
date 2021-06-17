
<template>
  <div class="clearfix">
    <!-- 上传组件 -->
    <a-upload
      accept="image/*"
      listType="picture-card"
      :fileList="fileList"
      :multiple="true"
      @preview="handlePreview"
      :remove="remove"
      :beforeUpload="beforeUpload"
      :customRequest="handleUpload"
    >
      <div v-if="fileList.length < maxNum">
        <a-icon type="plus" />
        <div class="ant-upload-text">Upload</div>
      </div>
    </a-upload>
    <!-- 图片预览 -->
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="加载失败" style="width: 100%" :src="previewImage" />
    </a-modal>
  </div>
</template>
<script>
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
import event from "@/utils/event.js";
import COS from "cos-js-sdk-v5";
import uuid from "@/utils/uuid";
export default {
  props: {
    files: {
      type: Array,
      required: false,
      default: () => [],
    },
    sort: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileList: [],
      cos: null,
      previewVisible: false,
      previewImage: "",
      maxNum: 3,
      // bannerUrl: "",
    };
  },
  computed: {
    isShow() {
      return this.sort;
    },
  },
  watch: {
    files(list) {
      this.fileList = list;
    },
  },
  async created() {
    // 获取随机key和id
    let res = await this.getKeyAndId();
    // 初始化cos
    this.cos = new COS({
      getAuthorization: (options, callback) => {
        const result = JSON.parse(res.data.data);
        callback({
          TmpSecretId: result.credentials.tmpSecretId,
          TmpSecretKey: result.credentials.tmpSecretKey,
          XCosSecurityToken: result.credentials.sessionToken,
          ExpiredTime: result.expiredTime,
        });
      },
    });
  },
  methods: {
    // 获取key和id
    getKeyAndId() {
      return this.$get("backend/TemKeyAndID");
    },
    // 限制上传数量
    changeNum(maxNum) {
      this.maxNum = maxNum;
    },
    // 图片预览关闭
    handleCancel() {
      this.previewVisible = false;
    },
    // 图片预览开启
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    handlePreview() {
      this.previewImage = this.fileList;
      this.previewVisible = true;
    },
    // 上传之前判断文件类型
    beforeUpload(file) {
      let isJPG = false;
      const picTypes = ["image/jpeg", "image/png", "image/bmp", "image/tif"];
      picTypes.forEach((item) => {
        if (file.type.toLocaleLowerCase() == item) {
          isJPG = true;
        }
      });
      if (!isJPG) {
        this.$message.error("请上传图片类型：jpeg/png/bmp/tif");
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("图片必须小于1MB!");
        return false;
      }
    },
    // 删除图片
    remove(file) {
      // console.log("remove", file.name);
      // console.log("fileList", this.fileList);
      // debugger;
      let fileList = this.fileList.filter((item) => {
        return item.uid != file.uid;
      });
      //TODO: cos端云删除
      // this.cos.deleteObject(
      //   {
      //     Bucket: this.$config.Bucket,
      //     Region: this.$config.Region,
      //     Key: file.name,
      //   },
      //   (err, data) => {
      //     if (err) {
      //       this.$message.success(err);
      //       return false;
      //     }
      //     if (data) {
      //       this.$message.success("删除成功");
      //       return false;
      //     }
      //   }
      // );
      this.fileList = fileList;
      this.$emit("storeInfoUrl", fileList);
    },
    // 上传文件 返回腾讯云信息，通过事件将存储信息返回到父组件
    handleUpload(info) {
      const that = this;
      const { file } = info;
      const uid = uuid();
      // const extName = that.getExtName(file.name);
      const fileName = file.name;
      this.cos.putObject(
        {
          Bucket: that.$config.Bucket,
          Region: that.$config.Region,
          Key: fileName,
          Body: file, // 上传文件对象
          onProgress: () => {},
        },
        (err, data) => {
          if (err) {
            // console.log(err);
            that.$notification.error({
              message: "文件上传错误",
              description: err.Message,
            });
          } else {
            this.$message.success("图片上传成功");
            // console.log(data);
            // 图片上传至腾讯cos云 返回图片地址
            that.bannerUrl = `http://${data["Location"]}`;
            that.fileList.push({
              uid,
              name: file.name,
              status: "done",
              url: `http://${data["Location"]}`,
            });
            // 调用父组件方法，并传递参数
            event.$emit("storeInfoUrl", that.fileList);
          }
        }
      );
    },
    // 父组件后置上传
    // 轮播图地址上传至后台数据库服务器
    // afterUpload() {
    //   let params = {
    //     carouselimgurl: this.bannerUrl,
    //     carouselstatus: 0,
    //     ordernum: this.rank.number,
    //   };
    //   return this.$post("backend/carousel", {
    //     ...params,
    //   }).then((res) => {
    //     this.$emit("uploadImage", res.data.data);
    //     this.previewImage = "";
    //     this.rank.number = 0;
    //   });
    // },
    /**
     * 获取后缀名
     */
    getExtName(fileName) {
      const index = fileName.lastIndexOf(".");
      if (index > -1) {
        return fileName.substring(index + 1);
      } else {
        return "";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}
</style>
