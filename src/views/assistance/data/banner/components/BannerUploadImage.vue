
<template>
  <div class="clearfix">
    <!-- 上传组件 -->
    <a-upload
      accept="image/*"
      listType="picture-card"
      :fileList="fileList"
      :multiple="false"
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
    <!-- 图片排序 -->
    <div style="margin-top: 10px">
      <a-form>
        <a-form-item label="排序">
          <a-input-number v-model="ordernum" :min="0" :max="10" />
        </a-form-item>
      </a-form>
    </div>
    <a-form>
      <a-form-item>
        <a-radio-group
          @change="radioChange"
          v-decorator="[
            'modifier',
            {
              initialValue: '0',
            },
          ]"
        >
          <a-radio value="0">url地址跳转</a-radio>
          <a-radio value="1">富文本跳转</a-radio>
        </a-radio-group>
      </a-form-item>
    </a-form>

    <div style="margin-top: 10px" v-if="jumpWay == 0">
      <a-form>
        <a-form-item label="url地址">
          <a-input v-model="carouselurl" />
        </a-form-item>
      </a-form>
    </div>
    <div style="margin-top: 10px" v-else-if="jumpWay == 1">
      <a-form>
        <a-form-item label="富文本内容">
          <editor-bar
            v-model="MTE"
            :isClear="isClear"
            @change="change"
          ></editor-bar>
        </a-form-item>
      </a-form>
    </div>
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
import EditorBar from "./wangEnduit.vue";

export default {
  name: "UploadImage",
  components: {
    EditorBar,
  },
  props: {
    files: {
      type: Array,
      required: false,
      default: () => [],
    },
  },
  data() {
    return {
      fileList: [],
      cos: null,
      previewVisible: false,
      previewImage: "",
      // 图片上传数量
      maxNum: 1,
      // 顺序号 必传
      ordernum: 0,
      // 图片地址
      carouselimgurl: "",
      // 0 不跳转 1商户 2网址 必传
      carouselstatus: 0,
      // 跳转外链 非必传
      carouselurl: "",
      // 清除文本
      isClear: false,
      // 富文本内容
      MTE: "",
      // 跳转方式
      jumpWay: 0,
    };
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
      console.log("remove", file);
      let fileList = this.fileList.filter((item) => {
        return item.uid != file.uid;
      });
      this.fileList = fileList;
      console.log(this.fileList);
      this.$emit("change", fileList);

      return new Promise(() => {
        this.cos.deleteObject(
          {
            Bucket: this.$config.Bucket,
            Region: this.$config.Region,
            Key: file.url.substr(file.url.lastIndexOf("myqcloud.com/") + 13),
          },
          (err, data) => {
            if (err) {
              this.$message.error(err);
              return false;
            }
            if (data) {
              this.$message.success("删除成功");
            }
          }
        );
      });
    },
    // 上传文件 返回腾讯云信息，通过事件将存储信息返回到父组件
    handleUpload(info) {
      const that = this;
      const { file } = info;
      // console.log("file", file);
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
            // console.log(data);
            // 图片上传至腾讯cos云 返回图片地址
            // that.carouselimgurl = `http://${data["Location"]}`;
            that.fileList.push({
              uid,
              name: file.name,
              status: "done",
              url: `http://${data["Location"]}`,
            });
            // 调用父组件方法，并传递参数
            console.log(that.fileList);

            event.$emit("change", that.fileList);
          }
        }
      );
    },

    // 父组件后置上传
    // 轮播图地址上传至后台数据库服务器
    afterUpload() {
      if (this.fileList.length > 0) {
        let params = {
          carouselimgurl: this.fileList[0].url,
          carouselstatus: this.carouselstatus,
          ordernum: this.ordernum,
        };
        // 图片跳转地址
        if (this.carouselurl != "") {
          params["carouselurl"] = this.carouselurl;
          params["carouselstatus"] = 2;
        }
        // 自定义跳转内容
        else if (this.MTE != "") {
          params["carouselurl"] = JSON.stringify(this.MTE);
          params["carouselstatus"] = 3;
        } else {
          console.log("未添加任何网址或自定义内容");
        }

        return this.$post("backend/carousel", {
          ...params,
        }).then((res) => {
          this.$emit("uploadImage", res.data.data);
          // this.previewImage = "";
          // this.ordernum = 0;
          // this.carouselimgurl = "";
          // this.carouselstatus = 0;
          // this.carouselurl = "";
          this.$message.success("图片上传成功");
        });
      } else {
        this.$message.error("未选择图片");
      }
    },
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
    // 富文本内容
    change(val) {
      this.MTE = val;
    },
    // 切换轮播图的点击跳转方式
    radioChange(e) {
      // console.log(e.target.value);
      this.jumpWay = e.target.value;
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
