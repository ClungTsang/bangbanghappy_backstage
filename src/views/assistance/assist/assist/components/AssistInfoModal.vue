<template>
  <div>
    <a-modal
      :visible="visible"
      :width="1400"
      title="该订单详细信息"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <a-descriptions bordered>
        <a-descriptions-item label="订单编号" :span="2">
          {{ assistInfo.outTradeNo }}
        </a-descriptions-item>
        <a-descriptions-item label="订单创建时间">
          {{ assistInfo.createtime }}
        </a-descriptions-item>
        <a-descriptions-item label="所属分类">
          {{ assistInfo.oncampus == 0 ? "校外" : "校内" }}
        </a-descriptions-item>
        <a-descriptions-item label="分类名称">
          {{ assistInfo.classifyName }}
        </a-descriptions-item>
        <a-descriptions-item label="订单状态">
          <a-badge
            status="warning"
            text="待付款"
            v-if="this.assistInfo.aidorderstatus == 1"
          />
          <a-badge
            status="processing"
            text="待援助"
            v-else-if="this.assistInfo.aidorderstatus == 2"
          />
          <a-badge
            status="processing"
            text="援助中"
            v-else-if="this.assistInfo.aidorderstatus == 3"
          />
          <a-badge
            status="error"
            text="处理中"
            v-else-if="this.assistInfo.aidorderstatus == 4"
          />
          <a-badge
            status="success"
            text="已完成"
            v-else-if="this.assistInfo.aidorderstatus == 5"
          />
          <a-badge
            status="default"
            text="已取消"
            v-else-if="this.assistInfo.aidorderstatus == 6"
          />
          <a-badge
            status="warning"
            text="已关闭"
            v-else="this.assistInfo.aidorderstatus == 7"
          />
        </a-descriptions-item>
        <a-descriptions-item label="客户名字">
          {{ orderUser.realname }}
        </a-descriptions-item>
        <a-descriptions-item label="客户电话">
          {{ assistInfo.publishUserNamemobile }}
        </a-descriptions-item>
        <a-descriptions-item label="收货地址">
          {{ assistInfo.addressDetail }}
        </a-descriptions-item>
        <a-descriptions-item label="求助标题">
          {{ assistInfo.title }}
        </a-descriptions-item>
        <a-descriptions-item label="求助说明">
          {{ assistInfo.description }}
        </a-descriptions-item>
        <a-descriptions-item label="货物价值">
          {{ assistInfo.materialsAmount }}
        </a-descriptions-item>
        <a-descriptions-item label="商铺名称">
          <div v-if="mallInfo.companyname != null">
            {{ mallInfo.companyname }}
          </div>
          <div v-else>无商铺</div>
        </a-descriptions-item>
        <a-descriptions-item label="商铺联系人">
          <div v-if="mallInfo.storeowner != null">
            {{ mallInfo.storeowner }}
          </div>
          <div v-else>无商铺联系人</div>
        </a-descriptions-item>
        <a-descriptions-item label="商铺电话">
          <div v-if="mallInfo.storephone != null">
            {{ mallInfo.storephone }}
          </div>
          <div v-else>无商铺电话</div>
        </a-descriptions-item>
        <a-descriptions-item label="菜品内容" :span="4">
          {{ assistInfo.content }}
        </a-descriptions-item>
        <a-descriptions-item label="援助者">
          <div v-if="assistor.realname != null">
            {{ assistor.realname }}
          </div>
          <div v-else>无援助者</div>
        </a-descriptions-item>
        <a-descriptions-item label="援助者电话">
          <div v-if="assistor.phonenum != null">
            {{ assistor.phonenum }}
          </div>
          <div v-else>无援助者电话</div>
        </a-descriptions-item>
        <a-descriptions-item label="援助佣金">
          {{ assistInfo.aidAmout }}
        </a-descriptions-item>
        <a-descriptions-item label="平台抽成援助数额">
          {{ assistInfo.aidPlatformIncome }}
        </a-descriptions-item>
        <a-descriptions-item label="援助者得到的佣金" :span="2">
          {{ assistInfo.aiderIncome }}
        </a-descriptions-item>
        <a-descriptions-item label="凭证内容">
          <div v-if="assistInfo.certificateContent != null">
            {{ assistInfo.certificateContent }}
          </div>
          <div v-else>未填写凭证内容</div>
        </a-descriptions-item>
        <a-descriptions-item label="凭证图片">
          <div v-if="assistInfo.certificateUrls != null">
            <div
              v-for="(item, index) in JSON.parse(assistInfo.certificateUrls)"
              :key="index"
            >
              <img
                style="width: 400px; heigth: auto; margin-bottom: 20px"
                :src="item"
              />
            </div>
          </div>
          <div v-else>未上传相关图片</div>
        </a-descriptions-item>
      </a-descriptions>
    </a-modal>
  </div>
</template>

<script>
export default {
  props: {
    infoVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      default: 0,
    },
  },
  data() {
    return {
      // 订单信息
      assistInfo: {},
      // 求助者信息
      orderUser: {},
      // 援助者信息
      assistor: {},
      // 商铺信息
      mallInfo: {},
    };
  },
  computed: {
    visible() {
      return this.infoVisible;
    },
  },
  watch: {
    id(id) {
      this.getOrderInfo(id);
    },
    assistInfo() {
      this.getAssistorInfo();
      this.getOrderUserInfo();
      this.getMallInfo();
    },
  },
  methods: {
    // 控制开关
    handleOk() {
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },
    // 获取订单信息
    getOrderInfo(id) {
      this.$get("/aidOrderById", { id: id }).then((res) => {
        this.assistInfo = res.data.data;
      });
    },
    // 获取求助者信息
    getOrderUserInfo() {
      const params = { openid: this.assistInfo.publishUserOpenid };
      this.$get("/wechatcustomerByopenId", { ...params }).then((res) => {
        if (res.data.data) {
          this.orderUser = res.data.data;
        }
      });
    },
    // 获取援助者信息
    getAssistorInfo() {
      console.log(this.assistInfo.aidUserOpenid);
      if (this.assistInfo.aidUserOpenid) {
        const params = { openid: this.assistInfo.aidUserOpenid };
        this.$get("/wechatcustomerByopenId", { ...params }).then((res) => {
          if (res.data.data) {
            this.assistor = res.data.data;
          }
        });
      } else {
        this.assistor = {};
      }
    },
    // 获取商铺信息
    getMallInfo() {
      if (this.assistInfo.blackboardId) {
        let id = this.assistInfo.blackboardId;
        this.$get(`/business/LantianStore/${id}`).then((res) => {
          if (res.data.data) {
            this.mallInfo = res.data.data;
          }
        });
      } else {
        this.mallInfo = {};
      }
    },
  },
};
</script>
