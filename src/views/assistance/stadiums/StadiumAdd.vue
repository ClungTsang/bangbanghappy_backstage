<template>
  <a-card :bordered="false">
    <a-row type="flex" justify="center">
      <a-col :span="14">
        <a-steps :current="current">
          <a-step title="基础信息" description="添加商户基础信息"></a-step>
          <a-step title="地图信息" description="添加商户地图信息"></a-step>
        </a-steps>
      </a-col>

      <a-col :span="18">
        <div class="steps-content">
          <a-form :form="form" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div v-show="current == 0">
              <!-- <a-form-item label="商户类型">
                <a-radio-group
                  @change="radioChange"
                  v-decorator="[
                    'category',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">室内商户</a-radio>
                  <a-radio value="1">室外野球场</a-radio>
                </a-radio-group>
              </a-form-item> -->
              <a-form-item label="商户名称">
                <a-input
                  placeholder="请输入商户名称"
                  v-decorator="[
                    'companyname',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商户名称'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item>
              <!-- <a-form-item label="标语">
                <a-input
                  placeholder="请输入标语"
                  v-decorator="[
                    'slogan',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入标语'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item> -->
              <a-form-item label="商户简介">
                <a-textarea
                  placeholder="请输入商户简介"
                  :auto-size="{ minRows: 7 }"
                  v-decorator="[
                    'detailedintroduction',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商户简介'
                        }
                      ]
                    }
                  ]"
                ></a-textarea>
              </a-form-item>
              <a-form-item label="联系人">
                <a-input
                  placeholder="请输入联系人"
                  v-decorator="[
                    'storeowner',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入联系人'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item>
              <!-- <a-form-item label="商户地址">
                <a-input
                  placeholder="请输入商户地址"
                  v-decorator="[
                    'address',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入商户地址'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item> -->
              <a-form-item label="公众号绑定电话，谨慎填写">
                <a-input
                  placeholder="请输入公众号绑定电话，谨慎填写"
                  v-decorator="[
                    'bossmobilenumber',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入公众号绑定电话，谨慎填）'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item>
              <a-form-item label="商户电话">
                <a-input
                  placeholder="请输入商户电话"
                  v-decorator="[
                    'storephone',
                    {
                      rules: [
                        {
                          required: true,
                          message: '请输入老板电话（公众号绑定电话，谨慎填写）'
                        }
                      ]
                    }
                  ]"
                ></a-input>
              </a-form-item>
              <!-- <a-form-item label="商户标签" required>
                <a dash @click="tagsVisible = true">管理标签</a>
                <br />
                <template v-for="tag in tags">
                  <a-checkable-tag :key="tag" :checked="selectedTags.indexOf(tag) > -1" @change="checked => handleChange(tag, checked)">
                    {{ tag }}
                  </a-checkable-tag>
                </template>
              </a-form-item> -->
              <a-form-item v-if="!isAdd" label="商户状态">
                <a-radio-group
                  v-decorator="[
                    'storestatus',
                    {
                      initialValue: '0'
                    }
                  ]"
                >
                  <a-radio value="0">不营业</a-radio>
                  <a-radio value="1">关店</a-radio>
                  <a-radio value="2">休店</a-radio>
                  <a-radio value="3">开店</a-radio>
                  <a-radio value="4">异常</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="logo图片" required>
                <image-uploader
                  @upload_fileList="getLogoFilesList"
                  :files="originLogoFilesList"
                  ref="logoFiles"
                ></image-uploader>
              </a-form-item>
              <a-form-item label="商户照片" required>
                <image-uploader
                  @upload_fileList="getStoreFilesList"
                  :files="originStoreFilesList"
                  ref="storeFiles"
                ></image-uploader>
              </a-form-item>
              <!-- <a-form-item label="商户星级" v-show="isIndoor" required>
                <a-rate v-model="stars" allow-half />
              </a-form-item> -->
              <a-form-item label="抽成比例">
                <a-input-number
                  :step="1"
                  v-decorator="[
                    'spendpercent',
                    {
                      initialValue: '20',
                      rules: [
                        {
                          required: true,
                          message: '请设置抽成比例'
                        }
                      ]
                    }
                  ]"
                  :min="0"
                  :max="100"
                />
              </a-form-item>
              <!-- <a-form-item label="商户日期" required>
                <a-checkbox
                  :indeterminate="indeterminate"
                  :checked="checkAll"
                  @change="onCheckAllChange"
                >
                  全选
                </a-checkbox>
                <br />
                <a-checkbox-group
                  v-model="checkedList"
                  :options="plainOptions"
                  @change="onChange"
                />
              </a-form-item> -->
              <a-form-item label="商户营业时间" required>
                <a-time-picker v-model="openinghours" valueFormat="HH:mm" />
                ~
                <a-time-picker v-model="closinghours" valueFormat="HH:mm" />
              </a-form-item>
            </div>
            <!-- 地图选址 -->
            <div v-show="current == 1">
              <map-selector
                ref="mapSelection"
                @origin_address="getOriginAddress"
                @choose_location="chooseLocation"
              ></map-selector>
            </div>
          </a-form>
        </div>
      </a-col>
      <a-col :span="18">
        <div class="steps-action">
          <a-button v-if="current < 1" type="primary" @click="next">
            下一步，添加商户地图信息
          </a-button>
          <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
            上一步，填写商户信息
          </a-button>
          <a-button
            v-if="current == 1"
            type="primary"
            @click="() => (modalVisible = true)"
          >
            {{ isAdd ? "完成，创建商户" : "完成，保存商户" }}
          </a-button>
        </div>
      </a-col>
    </a-row>
    <a-modal
      :visible="modalVisible"
      title="提示"
      @cancel="modalVisible = false"
      @ok="confirmSetStadium"
    >
      {{ isAdd ? "是否要创建该商户" : "是否要保存编辑该商户" }}
    </a-modal>
    <!-- 标签管理 -->
    <!-- <stadium-tags-modal
      :tagsVisible="tagsVisible"
      title="编辑标签"
      @close="
        tagsVisible = false;
        getTagsList();
      "
    ></stadium-tags-modal> -->
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
const plainOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const defaultCheckedList = ["周一", "周二", "周三", "周四", "周五"];
// import { formatUrl, restoreFiles } from "@/utils/urlTool";
import uuid from "@/utils/uuid";
import DefaultInputTree from "~/tool/DefaultInputTree.vue";
import ImageUploader from "~/tool/ImageUploader2.vue";
import MapSelector from "@/components/tool/MapSelector.vue";
import StadiumTagsModal from "./components/StadiumTagsModal.vue";
export default {
  components: {
    ImageUploader,
    DefaultInputTree,
    MapSelector,
    StadiumTagsModal
  },
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol,
      wrapperCol,
      current: 0,
      stadiumLogoFiles: [],
      modalVisible: false,
      openinghours: "",
      closinghours: "",
      isIndoor: true,
      isAdd: true,
      judgeStadiumLogoUpload: false,
      targetMallInfo: null,
      checkedList: defaultCheckedList,
      indeterminate: true,
      checkAll: false,
      plainOptions,
      tagsVisible: false,
      tags: [],
      selectedTags: [],
      localxy: null,
      address: null,
      stars: 2.5,
      originLogoFilesList: [],
      logoFilesList: [],
      originStoreFilesList: [],
      storeFilesList: []
    };
  },
  watch: {
    /**
     * 复用组件时，想对路由参数的变化作出响应的话，你可以简单地 watch (监测变化) $route 对象：
     *  */
    $route: {
      handler(to, from) {
        // 判断url路径中是否传参
        if (to.query && to.query.id) {
          // 有则修改商品
          this.changeMall(to.query.id);
        } else {
          // 无则新增商品
          this.addStadium();
        }
      },
      immediate: true
    }
  },
  mounted() {
    this.$refs.logoFiles.setFolderName("bang/mall/logo/");
    this.$refs.storeFiles.changeNum(4);
    this.$refs.storeFiles.changeMultiple();
    this.$refs.storeFiles.setFolderName("bang/mall/photos/");
  },
  methods: {
    getLogoFilesList(record) {
      this.logoFilesList = record;
    },
    getStoreFilesList(record) {
      this.storeFilesList = record;
    },
    // 获取标签信息
    async getTagsList() {
      let res = await this.$get("/rootDataById", { id: 12 });
      let resArr = res.data.data.valuedata.split(",");
      let tagsList = [];
      resArr.forEach(item => {
        tagsList.push(item);
      });
      this.tags = tagsList;
    },
    // 提交产品
    confirmSetStadium() {
      this.form.validateFields(async (err, value) => {
        this.modalVisible = false;
        if (err) {
          this.$message.error("提交失败，检查参数");
          console.error("错误表单信息：", err);
          return;
        }
        if (this.openinghours == "" || this.closinghours == "") {
          console.warn("未选择商户营业时间");
          this.$message.error("未选择商户营业时间");
          return;
        }
        if (this.localxy == null) {
          console.warn("未选择商户位置");
          this.$message.error("未选择商户位置");
          return;
        }
        if (this.logoFilesList.length == 0) {
          console.warn("未上传logo图");
          this.$message.error("未上传logo图");
          return;
        }
        if (this.storeFilesList.length == 0) {
          console.warn("未上传商户图");
          this.$message.error("未上传商户图");
          return;
        }
        let params = {
          ...value,
          logo: this.$formatUrl(this.logoFilesList),
          storeurl: this.$formatUrl(this.storeFilesList),
          openinghours: this.openinghours,
          closinghours: this.closinghours,
          localxy: this.localxy,
          address: this.address
        };
        let user = this.$db.get("USER");
        if (user.description == "一级代理" || user.roleName == "一级代理") {
          const res = await this.$get(
            `/business/LantianStore/getByPhone/${user.username}`
          );
          // 自己门店ID当做旗下代理的父亲ID
          params["parentid"] = res.data.data.id;
        }
        // 点击列表选取原始地址
        // if (typeof this.address !== "undefined") {
        //   params["address"] = this.address;
        // }
        // 判断是否是新增
        if (this.isAdd) {
          this.$post("/business/LantianStore", { ...params }).then(res => {
            if (res.data.code == 200) {
              this.$message.success("提交成功");
            } else {
              this.$message.error("提交失败：", res.data.message);
            }
          });
        } else {
          params["id"] = this.targetMallInfo.id;
          await this.$put("/business/LantianStore", { ...params });
          this.$message.success("保存成功");
        }
      });
    },
    // 得到坐标系
    chooseLocation(payload) {
      this.localxy = payload;
    },
    getOriginAddress(payload) {
      this.address = `${payload.name} ${payload.address}`;
    },
    // 根据id获取商户
    async changeMall(id) {
      this.isAdd = false;
      let res = await this.$get(`/business/LantianStore/${id}`);
      const result = res.data.data;
      this.targetMallInfo = result;
      // const originLogoFilesList = JSON.parse(result.logo).map(item => ({
      //   uid: uuid(6),
      //   name: `${uuid(6)}.png`,
      //   status: "done",
      //   url: item
      // }));
      // const originStoreFilesList = JSON.parse(result.storeurl).map(item => ({
      //   uid: uuid(6),
      //   name: `${uuid(6)}.png`,
      //   status: "done",
      //   url: item
      // }));
      this.originLogoFilesList = this.$restoreFiles(result.logo);
      this.originStoreFilesList = this.$restoreFiles(result.storeurl);
      // let opendaysArr = [];
      // result.opendays.split(",").forEach(item => {
      //   opendaysArr.push(item);
      // });
      // this.checkedList = opendaysArr;
      // let tagsArr = [];
      // result.tags.split(",").forEach(item => {
      //   tagsArr.push(item);
      // });
      // this.selectedTags = tagsArr;
      this.openinghours = result.openinghours;
      this.closinghours = result.closinghours;
      // this.stars = parseFloat(result.stars) / 2;
      this.$refs.mapSelection.setLocation([
        result.localxy.split(",")[1],
        result.localxy.split(",")[0]
      ]);
      this.form.setFieldsValue({
        // category: result.category,
        companyname: result.companyname,
        // slogan: result.slogan,
        detailedintroduction: result.detailedintroduction,
        storeowner: result.storeowner,
        bossmobilenumber: result.bossmobilenumber,
        storephone: result.storephone,
        address: result.address,
        spendpercent: result.spendpercent,
        storestatus: result.storestatus
      });
    },
    // 新增并清除页面信息
    addStadium() {
      this.isAdd = true;
      this.selectedTags = [];
      this.openinghours = "";
      this.closinghours = "";
      this.stars = 2.5;
      this.originLogoFilesList = [];
      this.logoFilesList = [];
      this.originStoreFilesList = [];
      this.storeFilesList = [];
      this.$refs.mapSelection.resetLocation();
      this.form.resetFields();
    },
    // 控制开放日期方法
    onChange(checkedList) {
      this.indeterminate =
        !!checkedList.length && checkedList.length < plainOptions.length;
      this.checkAll = checkedList.length === plainOptions.length;
    },
    // 全选日期
    onCheckAllChange(e) {
      Object.assign(this, {
        checkedList: e.target.checked ? plainOptions : [],
        indeterminate: false,
        checkAll: e.target.checked
      });
    },

    // 选择标签
    handleChange(tag, checked) {
      const { selectedTags } = this;
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter(t => t !== tag);
      console.log("选择的标签: ", nextSelectedTags);
      this.selectedTags = nextSelectedTags;
    },
    radioChange(e) {
      this.isIndoor = e.target.value == 0 ? true : false;
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
