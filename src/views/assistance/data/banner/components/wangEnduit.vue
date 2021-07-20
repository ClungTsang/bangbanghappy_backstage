<template lang="html">
  <div class="editor">
    <div ref="toolbar" class="toolbar">
    </div>
    <div ref="editor" class="text">
    </div>
  </div>
</template>

<script>
import COS from "cos-js-sdk-v5";
import E from "wangEditor";
let that;
export default {
  // name: 'editoritem',
  data() {
    return {
      // uploadPath,
      editor: null,
      info_: null,
      cos: null,
      credentials: null,
    };
  },
  model: {
    prop: "value",
    event: "change",
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    isClear: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    isClear(val) {
      // 触发清除文本域内容
      if (val) {
        this.editor.txt.clear();
        this.info_ = null;
      }
    },
    value: function (value) {
      if (value !== this.editor.txt.html()) {
        this.editor.txt.html(this.value);
      }
    },
    //value为编辑框输入的内容，这里我监听了一下值，当父组件调用得时候，如果给value赋值了，子组件将会显示父组件赋给的值
  },
  async created() {
    that = this
    // 获取随机key和id
    let res = await this.getKeyAndId();
    // 初始化cos
    this.cos = new COS({
      getAuthorization: (options, callback) => {
        const result = JSON.parse(res.data.data);
        console.log(result);
        callback({
          TmpSecretId: result.credentials.tmpSecretId,
          TmpSecretKey: result.credentials.tmpSecretKey,
          XCosSecurityToken: result.credentials.sessionToken,
          ExpiredTime: result.expiredTime,
        });
      },
    });
  },
  mounted() {
    this.seteditor();
    this.editor.txt.html(this.value);
  },
  methods: {
    // 获取key和id
    getKeyAndId() {
      return this.$get("backend/TemKeyAndID");
    },
    seteditor() {
      this.editor = new E(this.$refs.toolbar, this.$refs.editor);
      this.editor.config.uploadImgShowBase64 = false; // base 64 存储图片
      this.editor.config.uploadImgHeaders = {}; // 自定义 header
      this.editor.config.uploadFileName = "file"; // 后端接受上传文件的参数名
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; // 将图片大小限制为 2M
      this.editor.config.uploadImgMaxLength = 6; // 限制一次最多上传 3 张图片
      this.editor.config.uploadImgTimeout = 3 * 60 * 1000; // 设置超时时间

      // 配置菜单
      this.editor.config.menus = [
        "head", // 标题
        "bold", // 粗体
        "fontSize", // 字号
        // "fontName", // 字体
        "italic", // 斜体
        "underline", // 下划线
        "strikeThrough", // 删除线
        "foreColor", // 文字颜色
        // "backColor", // 背景颜色
        // "link", // 插入链接
        // "list", // 列表
        "justify", // 对齐方式
        // "quote", // 引用
        // "emoticon", // 表情
        "image", // 插入图片
        // "table", // 表格
        // "video", // 插入视频
        // "code", // 插入代码
        "undo", // 撤销
        "redo", // 重复
        "fullscreen", // 全屏
      ];
      this.editor.config.customUploadImg = function (resultFiles, insertImgFn) {
        console.log(that);
        that.cos.putObject(
          {
            Bucket: that.$config.Bucket,
            Region: that.$config.Region,
            Key: resultFiles[0].name,
            Body: resultFiles[0], // 上传文件对象
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
              that.$message.success("图片上传成功");
              // 图片上传至腾讯cos云 返回图片地址
              insertImgFn(`http://${data["Location"]}`);
            }
          }
        );
      };
      this.editor.config.onchange = (html) => {
        this.info_ = html; // 绑定当前逐渐地值
        this.$emit("change", this.info_); // 将内容同步到父组件中
      };
      // 创建富文本编辑器
      this.editor.create();
    },
  },
};
</script>

<style lang="css">
.editor {
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 0;
}
.toolbar {
  border: 1px solid #ccc;
}
.text {
  border: 1px solid #ccc;
  min-height: 500px;
}
</style>
