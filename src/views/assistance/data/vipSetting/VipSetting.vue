<template>
  <a-card title="会员服务权益">
    <a-button type="danger" ghost @click="vipPriceVisible = true">
      调整升级会员所需金额
    </a-button>
    <div style="margin-top:10px">
      <a-form>
        <a-form-item>
          <editor-bar
            v-model="MTE"
            :isClear="isClear"
            @change="change"
          ></editor-bar>
        </a-form-item>
      </a-form>
      <a-button type="primary" @click="saveUserAgreement">点击保存</a-button>
    </div>
    <vip-price-modal
      :vipPriceVisible="vipPriceVisible"
      @close="vipPriceVisible = false"
    ></vip-price-modal>
  </a-card>
</template>
<script>
import VipPriceModal from "./components/VipPriceModal.vue";
import EditorBar from "~/tool/wangEnduit.vue";
export default {
  components: {
    EditorBar,
    VipPriceModal
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
      vipPriceVisible: false
    };
  },
  created() {
    this.getUserAgreement();
    // this.$post("/backend/notice", { title: "terms", noticestatus: 5 });
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
        noticestatus: 5
      }).then(res => {
        let result = res.data.data.rows.filter(item => {
          return item.title == "terms";
        });
        console.log(result);
        this.MTE = JSON.parse(result[0].content);
      });
    },
    // 保存公告
    saveUserAgreement() {
      let params = {
        title: "terms",
        noticestatus: 5
      };
      // if (this.jumpWay == 0) {
      //   params["content"] = this.carouselurl;
      // } else {
      //   params["content"] = JSON.stringify(this.MTE);
      // }
      params["content"] = JSON.stringify(this.MTE);

      this.$put("/backend/notice", {
        id: 90,
        ...params
      }).then(() => {
        this.$message.success("保存成功");
      });
    }
  }
};
</script>
<style></style>
