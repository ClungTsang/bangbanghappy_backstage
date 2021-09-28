<template>
  <div>
    <!-- 图片上传组件 -->
    <a-upload
      accept="image/*"
      listType="picture-card"
      :fileList="fileList"
      :multiple="multiple"
      :remove="remove"
      :beforeUpload="beforeUpload"
      :customRequest="handleUpload"
      @preview="handlePreview"
    >
      <!-- 达到上传最大值 -->
      <div v-if="fileList.length < maxNum">
        <a-icon type="plus" />
        <div class="ant-upload-text">上传</div>
      </div>
    </a-upload>
    <!-- 图片预览弹框 -->
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
    reader.onerror = error => reject(error);
  });
}
import COS from "cos-js-sdk-v5";
import uuid from "@/utils/uuid";
export default {
  props: {
    files: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // 图片列表
      fileList: [],
      // 预览图片控制
      previewVisible: false,
      // 预览图片
      previewImage: "",
      // 上传图片最大数量
      maxNum: 1,
      // 限制上传多选
      multiple: false,
      // 腾讯对象存储
      cos: null,
      // 文件夹名称
      folderName: ""
    };
  },
  watch: {
    files: {
      handler(list) {
        this.fileList = list;
        this.$emit("upload_fileList", this.fileList);
      },
      immediate: true
    }
  },
  methods: {
    async initCos() {
      // 获取随机key和id
      let res = await this.$get("backend/TemKeyAndID");
      // 初始化cos
      return new Promise((resole, reject) => {
        let cos = new COS({
          getAuthorization: (options, callback) => {
            const result = JSON.parse(res.data.data);
            callback({
              TmpSecretId: result.credentials.tmpSecretId,
              TmpSecretKey: result.credentials.tmpSecretKey,
              XCosSecurityToken: result.credentials.sessionToken,
              ExpiredTime: result.expiredTime
            });
          }
        });
        resole(cos);
      });
    },
    // 限制上传数量
    changeNum(maxNum) {
      this.maxNum = maxNum;
    },
    // 改变上传是否可多选
    changeMultiple() {
      this.multiple = true;
    },
    // 图片预览关闭
    handleCancel() {
      this.previewVisible = false;
    },
    // 设置文件夹名字
    setFolderName(folderName) {
      this.folderName = folderName;
    },
    // 图片预览开启
    async handlePreview(file) {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      this.previewImage = file.url || file.preview;
      this.previewVisible = true;
    },
    // 上传之前判断文件类型与图片大小
    beforeUpload(file) {
      let isJPG = false;
      const picTypes = ["image/jpeg", "image/png", "image/bmp", "image/tif"];
      picTypes.forEach(item => {
        if (file.type.toLocaleLowerCase() == item) {
          isJPG = true;
        }
      });
      // 判断图片上传类型
      if (!isJPG) {
        this.$message.error("请上传图片类型：jpeg/png/bmp/tif");
        return false;
      }
      // 判断图片上传大小
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        this.$message.error("图片必须小于1MB!");
        return false;
      }
    },
    // 删除图片
    async remove(file) {
      let fileList = this.fileList.filter(item => {
        return item.uid != file.uid;
      });
      this.fileList = fileList;
      this.$emit("upload_fileList", this.fileList);
      this.$message.success("删除成功");
      // let cos = await this.initCos();
      // return new Promise(() => {
      //   cos.deleteObject(
      //     {
      //       Bucket: this.$config.Bucket,
      //       Region: this.$config.Region,
      //       Key: file.url.substr(file.url.lastIndexOf("myqcloud.com/") + 13)
      //     },
      //     (err, data) => {
      //       if (err) {
      //         this.$message.error(err);
      //         return false;
      //       }
      //       if (data) {
      //         this.$message.success("删除成功");
      //       }
      //     }
      //   );
      // });
    },
    // 上传文件 返回腾讯云信息，通过事件将存储信息返回到父组件
    async handleUpload(info) {
      const that = this;
      const { file } = info;
      const uid = uuid();
      const fileName = `${this.folderName}${uuid(5)}${file.name}`;
      let cos = await this.initCos();
      cos.putObject(
        {
          Bucket: that.$config.Bucket,
          Region: that.$config.Region,
          Key: fileName,
          Body: file
        },
        (err, data) => {
          if (err) {
            that.$notification.error({
              message: "文件上传错误",
              description: err.Message
            });
          } else {
            this.$message.success("图片上传成功");
            this.fileList.push({
              uid,
              name: file.name,
              status: "done",
              url: decodeURI(`http://${data["Location"]}`)
            });
            this.$emit("upload_fileList", this.fileList);
          }
        }
      );
    },
    // 获取后缀名
    getExtName(fileName) {
      const index = fileName.lastIndexOf(".");
      if (index > -1) {
        return fileName.substring(index + 1);
      } else {
        return "";
      }
    }
  }
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
