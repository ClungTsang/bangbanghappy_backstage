<template>
  <a-card :bordered="false">
    <a-row type="flex" justify="center">
      <a-col :span="18" offset="6">
        <a-steps :current="current">
          <a-step title="基础信息" description="添加商品基础信息"></a-step>
          <a-step title="详细信息" description="添加商品详细信息"></a-step>
        </a-steps>
      </a-col>

      <a-col :span="18" offset="6">
        <div class="steps-content">
          <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div v-show="current == 0">
              <a-form-item label="商品分类" required>
                <default-input-tree
                  @change="handleCategoryChange"
                  :defaultValue="defaultValue"
                  ref="categoryTree"
                  :treePlaceholder="'请选择'"
                  :isLoadTree="'loadCategoryTree2'"
                ></default-input-tree>
              </a-form-item>
              <a-form-item label="商品名称">
                <a-input
                  placeholder="请输入商品名称"
                  v-decorator="[
                    'dishname',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商品名称'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item>
              <a-form-item label="商品简介">
                <a-textarea
                  placeholder="请输入商品简介"
                  :auto-size="{ minRows: 7 }"
                  v-decorator="[
                    'description',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商品简介'
                        }
                      ]
                    }
                  ]"
                ></a-textarea>
              </a-form-item>
              <!-- <a-form-item label="商品货号">
                <a-input
                  placeholder="请输入商品货号"
                  v-decorator="[
                    'goodsnum',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商品货号'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item> -->
              <!-- <a-form-item label="上级商品">
          <a-select
            v-decorator="[
              'father',
              { rules: [{ required: true, message: '请选择上级商品' }] },
            ]"
            ,
            placeholder="请选择上级商品"
          >
            <a-select-option value="1">111</a-select-option>
          </a-select>
        </a-form-item> -->
              <a-form-item label="商品价格（元）">
                <a-input-number
                  :step="0.1"
                  v-decorator="[
                    'dishprice',
                    {
                      initialValue: '0.01',
                      rules: [
                        {
                          required: true,
                          message: '请设置商品价格（元）'
                        }
                      ]
                    }
                  ]"
                  :min="0.1"
                  :max="99999999"
                />
              </a-form-item>
              <a-form-item label="商品会员价（元）">
                <a-input-number
                  :step="0.1"
                  v-decorator="[
                    'memberprice',
                    {
                      initialValue: '0.01',
                      rules: [
                        {
                          required: true,
                          message: '请设置商品会员价（元）'
                        }
                      ]
                    }
                  ]"
                  :min="0.1"
                  :max="99999999"
                />
              </a-form-item>
              <a-form-item label="限购量（个）">
                <a-input-number
                  v-decorator="[
                    'purchaselimit',
                    {
                      initialValue: '1'
                    }
                  ]"
                  :min="1"
                  :max="99999999"
                />
              </a-form-item>
              <!-- <a-form-item label="追加运费（元）">
                <a-input-number
                  :step="0.01"
                  v-decorator="[
                    'appendfreight',
                    {
                      initialValue: '0'
                    }
                  ]"
                  :min="0"
                  :max="99999999"
                />
              </a-form-item> -->
            </div>
            <div v-show="current == 1">
              <a-form-item label="上架">
                <a-radio-group
                  v-decorator="[
                    'dishstatus',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">否</a-radio>
                  <a-radio value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
              <!-- <a-form-item label="新品">
                <a-radio-group
                  v-decorator="[
                    'isnew',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">否</a-radio>
                  <a-radio value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="推荐">
                <a-radio-group
                  v-decorator="[
                    'isrecommend',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">否</a-radio>
                  <a-radio value="1">是</a-radio>
                </a-radio-group>
              </a-form-item>

              <a-form-item label="预售">
                <a-radio-group
                  v-decorator="[
                    'presell',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">否</a-radio>
                  <a-radio value="1">是</a-radio>
                </a-radio-group>
              </a-form-item> -->
              <!-- <a-form-item label="备注1">
                <a-input
                  placeholder="请输入商品备注"
                  v-decorator="[
                    'remark1',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商品备注'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item>
              <a-form-item label="备注2">
                <a-input
                  placeholder="请输入商品备注"
                  v-decorator="[
                    'remark2',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商品备注'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item> -->
              <!-- <a-form-item label="备注3">
                <a-input
                  placeholder="请输入商品备注"
                  v-decorator="[
                    'remark3',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商品备注'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item> -->
              <a-form-item label="商品图片" required>
                <image-uploader
                  @upload_fileList="getGoodsLogo"
                  :files="logoFiles"
                  ref="goodsLogo"
                ></image-uploader>
              </a-form-item>
              <!-- <a-form-item label="商品轮播图" required>
                <image-uploader @upload_fileList="getGoodsBanner" :files="bannerFiles" ref="goodsBanner"></image-uploader>
              </a-form-item>
              <a-form-item label="商品详情图" required>
                <image-uploader @upload_fileList="getGoodsDetail" :files="detailFiles" ref="goodsDetail"></image-uploader>
              </a-form-item> -->
            </div>
          </a-form>
        </div>
      </a-col>
      <a-col :span="18" offset="6">
        <div class="steps-action">
          <a-button v-if="current < 1" type="primary" @click="next">
            下一步，填写详细信息
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
            上一步，填写商品信息
          </a-button>
          <a-button
            v-if="current == 1"
            type="primary"
            @click="() => (modalVisible = true)"
          >
            {{ isAdd ? "完成，提交商品" : "完成，编辑商品" }}
          </a-button>
          <a-button
            v-if="current == 1 && !isAdd"
            type="primary"
            @click="() => (copyModalVisible = true)"
          >
            {{ "复制商品" }}
          </a-button>
        </div>
      </a-col>
    </a-row>
    <a-modal
      :visible="modalVisible"
      title="提示"
      @cancel="() => (modalVisible = false)"
      @ok="confirmSetGoods"
    >
      {{ isAdd ? "是否要新增该商品" : "是否要保存编辑该商品" }}
    </a-modal>
    <a-modal
      :visible="copyModalVisible"
      title="提示"
      @cancel="() => (copyModalVisible = false)"
      @ok="confirmCopyGoods"
    >
      {{ "是否要复制该商品" }}
    </a-modal>
  </a-card>
</template>

<script>
const labelCol = {
  xl: { span: 6 },
  xs: { span: 24 },
  sm: { span: 5 }
};
const wrapperCol = {
  xl: { span: 18 },
  xs: { span: 24 },
  sm: { span: 12 }
};
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
import ImageUploader from "~/tool/ImageUploader2.vue";
export default {
  components: {
    ImageUploader,
    DefaultInputTree
  },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol,
      wrapperCol,
      current: 0,
      goodsLogoFiles: [],
      goodsBannerFiles: [],
      goodsDetailFiles: [],
      logoFiles: [],
      bannerFiles: [],
      detailFiles: [],
      modalVisible: false,
      dishclassificationid: null,
      dishclassificationname: null,
      defaultValue: null,
      isAdd: true,
      changeGoodsInfo: null,
      copyModalVisible: false
    };
  },
  watch: {
    $route: {
      handler(to, from) {
        if (to.query && to.query.id) {
          this.isAdd = false;
          this.getProductInfoById(to.query.id);
        } else {
          this.isAdd = true;
          this.addGoods();
        }
      },
      immediate: true
    }
  },
  computed: {
    // ...mapState({
    //   coupon: state => state.account.coupon,
    //   targetCoupon: state => state.account.targetCoupon
    // })
  },
  mounted() {
    this.getMyStoreInfo();
    this.changeLogoNum();
    // this.changeBannerNum(9)
    // this.changeDetailNum(20)
  },
  methods: {
    // ...mapMutations({ setCoupon: 'account/setCoupon' }),
    // 获取门店信息
    async getMyStoreInfo() {
      const user = this.$db.get("USER");
      const userRes = await this.$get(
        `/business/LantianStore/getByPhone/${user.username}`
      );
      this.getMyStoreInfo = userRes.data.data;
    },
    // 分类方式
    async handleCategoryChange(value) {
      console.log("选择的分类id：", JSON.parse(value).id);
      console.log("选择的分类：", JSON.parse(value).text);
      this.dishclassificationid = JSON.parse(value).id;
      this.dishclassificationname = JSON.parse(value).text;
    },
    //从子组件中获取商品logo
    getGoodsLogo(record) {
      this.goodsLogoFiles = record;
    },
    //从子组件中获取商品轮播图
    getGoodsBanner(record) {
      this.goodsBannerFiles = record;
    },
    //从子组件中获取商品详细图
    getGoodsDetail(record) {
      this.goodsDetailFiles = record;
    },
    //改变上传轮播图数量
    changeLogoNum() {
      this.$refs.goodsLogo.setFolderName("goods/logo/");
    },
    //改变上传轮播图数量
    changeBannerNum(val) {
      this.$refs.goodsBanner.changeNum(val);
      this.$refs.goodsBanner.changeMultiple();
      this.$refs.goodsBanner.setFolderName("goods/banner/");
    },
    //改变上传限制数量
    changeDetailNum(val) {
      this.$refs.goodsDetail.changeNum(val);
      this.$refs.goodsDetail.changeMultiple();
      this.$refs.goodsDetail.setFolderName("goods/detail/");
    },
    // 提交产品
    confirmSetGoods() {
      this.form.validateFields(async (err, value) => {
        this.modalVisible = false;
        if (err) {
          this.$message.error("提交失败，检查参数");
          console.error("错误表单信息：", err);
          return;
        }
        if (this.dishclassificationid == null) {
          console.warn("未选择分类信息");
          this.$message.error("未选择分类信息");
          return;
        }
        if (this.goodsLogoFiles.length == 0) {
          console.warn("未上传商品图");
          this.$message.error("未上传商品图");
          return;
        }
        // if (this.goodsBannerFiles.length == 0) {
        //   console.warn('未上传商品轮播图')
        //   this.$message.error('未上传商品轮播图')
        //   return
        // }
        // if (this.goodsDetailFiles.length == 0) {
        //   console.warn('未上传商品详情图')
        //   this.$message.error('未上传商品详情图')
        //   return
        // }
        // let storeNameRes = await this.$get("/lantianStoreById", { id: 1 });
        // console.info("表单信息", value);
        const params = {
          ...value,
          storeid: this.getMyStoreInfo.id,
          storename: this.getMyStoreInfo.companyname,
          dishclassificationid: this.dishclassificationid,
          dishclassificationname: this.dishclassificationname,
          dishurl: this.$formatUrl(this.goodsLogoFiles)
        };
        if (this.isAdd) {
          await this.$post(`/backend/business/LantianDishmanagement`, {
            ...params
          });
          this.$message.success("提交成功");
        } else {
          params["id"] = this.changeGoodsInfo.id;
          await this.$put(`/backend/business/LantianDishmanagement`, {
            ...params
          });
          this.$message.success("保存成功");
        }
        this.$bus.$emit("changeGoodsDone");
      });
    },
    // 复制商品
    confirmCopyGoods() {
      this.form.validateFields(async (err, value) => {
        this.copyModalVisible = false;
        if (err) {
          this.$message.error("提交失败，检查参数");
          console.error("错误表单信息：", err);
          return;
        }
        if (this.dishclassificationid == null) {
          console.warn("未选择分类信息");
          this.$message.error("未选择分类信息");
          return;
        }
        if (this.goodsLogoFiles.length == 0) {
          console.warn("未上传商品图");
          this.$message.error("未上传商品图");
          return;
        }
        const params = {
          ...value,
          storeid: this.getMyStoreInfo.id,
          storename: this.getMyStoreInfo.companyname,
          dishclassificationid: this.dishclassificationid,
          dishclassificationname: this.dishclassificationname,
          dishurl: this.$formatUrl(this.goodsLogoFiles)
        };
        await this.$post(`/backend/business/LantianDishmanagement`, {
          ...params
        });
        this.$message.success("复制成功");
        this.$bus.$emit("changeGoodsDone");
      });
    },
    // 根据id获取商品
    async getProductInfoById(id) {
      this.logoFiles = [];
      this.bannerFiles = [];
      this.detailFiles = [];
      // this.defaultValue = [];
      let res = await this.$get(
        `/backend/business/LantianDishmanagement/${id}`
      );
      const result = res.data.data;
      this.changeGoodsInfo = result;
      this.logoFiles = this.$restoreFiles(result.dishurl);
      this.defaultValue = result.dishclassificationid;
      this.dishclassificationid = result.dishclassificationid;
      this.form.setFieldsValue({
        dishname: result.dishname,
        description: result.description,
        goodsnum: result.goodsnum,
        dishprice: result.dishprice,
        minprmemberpriceice: result.memberprice,
        purchaselimit: result.purchaselimit,
        dishstatus: result.dishstatus
        // isnew: result.isnew,
        // isrecommend: result.isrecommend,
        // presell: JSON.stringify(result.presell),
        // remark1: result.remark1,
        // remark2: result.remark2,
        // remark3: result.remark3
      });
    },
    // 新增清除页面信息
    addGoods() {
      this.defaultValue = null;
      this.form.resetFields();
    },
    next() {
      this.current++;
    },
    prev() {
      this.current--;
    }
  }
};
</script>
<style scoped>
.steps-content {
  margin-top: 16px;
  width: 800px;
}

.steps-action {
  margin-top: 24px;
}
</style>
