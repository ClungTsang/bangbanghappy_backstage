<template>
  <a-card title="用户协议">
    <!-- <a-form>
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
    </a-form> -->

    <!-- <div style="margin-top: 10px" v-if="jumpWay == 0">
      <a-form>
        <a-form-item label="url地址">
          <a-input v-model="carouselurl" />
        </a-form-item>
      </a-form>
    </div> -->
    <!-- <div style="margin-top: 10px" v-else-if="jumpWay == 1"> -->
    <div>
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
    <a-button type="primary" @click="saveUserAgreement">点击保存</a-button>
  </a-card>
</template>
<script>
import EditorBar from "../banner/components/wangEnduit.vue";
export default {
  components: {
    EditorBar,
  },
  data() {
    return {
      // 跳转外链 非必传
      carouselurl: "",
      // 清除文本
      isClear: false,
      // 富文本内容
      MTE: "",
      // 选择公告显示方式
      jumpWay: 0,
    };
  },
  created() {
    this.getUserAgreement();
  },
  methods: {
    // 富文本内容
    change(val) {
      this.MTE = val;
    },
    // 切换轮播图的点击跳转方式
    radioChange(e) {
      this.jumpWay = e.target.value;
    },
    // 获取公告信息
    getUserAgreement() {
      this.$get("/backend/notice/selectAllByNoticeStatus", {
        noticestatus: 4,
      }).then((res) => {
        let result = res.data.data.rows.filter(item=>{
          return item.title == 'userAgreement'
        })
        console.log(result);
        this.MTE = JSON.parse(result[0].content);
      });
    },
    // 保存公告
    saveUserAgreement() {
      let params = {
        title: "userAgreement",
        noticestatus: 4,
      };
      // if (this.jumpWay == 0) {
      //   params["content"] = this.carouselurl;
      // } else {
      //   params["content"] = JSON.stringify(this.MTE);
      // }
      params["content"] = JSON.stringify(this.MTE);

      this.$put("/backend/notice", {
        id: 82,
        ...params,
      }).then(() => {
        this.$message.success("保存成功");
      });
    },
  },
};
</script>
<style>
</style>
