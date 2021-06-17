<template>
  <div>
    <a-modal
      :visible="visible"
      :title="this.judge == 0 ? '新建门店' : '更新门店'"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="门店名称">
          <a-input
            v-decorator="[
              'companyname',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入门店名称',
                  },
                ],
              },
            ]"
          ></a-input>
        </a-form-item>

        <a-form-item label="门店老板姓名">
          <a-input
            v-decorator="[
              'storeowner',
              {
                rules: [
                  {
                    required: true,
                  },
                ],
              },
            ]"
          ></a-input>
        </a-form-item>
        <a-form-item label="门店电话">
          <a-input
            v-decorator="[
              'storephone',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入本店电话',
                  },
                ],
              },
            ]"
          ></a-input>
        </a-form-item>
        <div v-show="this.judge == 0">
          <a-form-item label="老板手机号">
            <a-input
              v-decorator="[
                'bossmobilenumber',
                {
                  rules: [
                    {
                      required: true,

                      message: '请输入正确的手机号',
                    },
                  ],
                },
              ]"
            ></a-input>
          </a-form-item>
        </div>
        <a-form-item label="门店地址">
          <a-input
            v-model="baiduMap.keyword"
            placeholder="搜索门店地址"
            v-decorator="[
              'storeAddress',
              {
                rules: [
                  {
                    required: true,
                    whitespace: true,
                    message: '请输入门店名称',
                  },
                ],
              },
            ]"
          >
            <a-select
              slot="addonAfter"
              default-value="深圳"
              style="width: 80px"
              @change="onRegionChange"
            >
              <a-select-option value="深圳"> 深圳 </a-select-option>
              <a-select-option value="广州"> 广州 </a-select-option>
              <a-select-option value="上海"> 上海 </a-select-option>
              <a-select-option value="北京"> 北京 </a-select-option>
            </a-select>
          </a-input>
          <baidu-map
            ak="baiduMap.mapAK"
            :center="center"
            @ready="mapReady"
            @click="selectPoint"
            @moving="syncCenterAndZoom"
            @moveend="syncCenterAndZoom"
            @zoomend="syncCenterAndZoom"
          >
            <bm-view style="width: 100%; height: 200px"></bm-view>

            <bm-marker
              :position="point"
              :dragging="true"
              animation="BMAP_ANIMATION_BOUNCE"
            ></bm-marker>

            <bm-local-search
              :keyword="baiduMap.keyword"
              :auto-viewport="true"
              :location="location"
            ></bm-local-search>
          </baidu-map>
        </a-form-item>
        <div v-show="this.judge == 0">
          <a-form-item label="门店图标">
            <store-logo-upload v-on="$listeners"
              >上传门店logo</store-logo-upload
            >
          </a-form-item>
          <a-form-item label="门店照片">
            <store-info-upload v-on="$listeners"
              >上传门店照片</store-info-upload
            >
          </a-form-item>
        </div>

        <a-form-item label="门店详细介绍">
          <a-textarea
            placeholder="请介绍门店的详细信息..."
            v-decorator="[
              'detailedintroduction',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入详细介绍',
                  },
                ],
              },
            ]"
          ></a-textarea>
        </a-form-item>
        <!-- <a-form-item label="请输入门店标签">
          <a-input
            placeholder="热门"
            v-decorator="[
              'storeSlogan',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入详细介绍',
                  },
                ],
              },
            ]"
          ></a-input>
        </a-form-item> -->
        <div v-show="this.judge == 0">
          <a-form-item label="营业时间">
            <a-time-picker
              format="HH:mm"
              v-decorator="['openinghours', config]"
            />
            <span>~</span>
            <a-time-picker
              format="HH:mm"
              v-decorator="['closinghours', config]"
            />
          </a-form-item>
        </div>
        <div v-show="this.judge !== 0">
          <a-form-item label="门店状态" style="margin-bottom: 2rem">
            <a-radio-group
              button-style="solid"
              @change="changeStatus"
              v-model="storestatus"
            >
              <a-radio-button
                style="margin: 5px"
                v-for="(item, index) in storestatusItems"
                :key="index"
                :value="item.id"
              >
                {{ item.text }}
              </a-radio-button>
            </a-radio-group>
          </a-form-item>
        </div>

        <a-form-item label="滑动调整对该门店的抽成比例">
          <a-row>
            <a-col :span="20">
              <a-slider v-model="slider.value" :min="1" :max="99" />
            </a-col>
            <a-col :span="4">
              <a-input-number
                v-model="slider.value"
                :min="1"
                :max="99"
                style="marginleft: 16px"
              />
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script>
import event from "@/utils/event.js";
import { BmLocalSearch, BaiduMap, BmView } from "vue-baidu-map";
import StoreInfoUpload from "./StoreInfoUpload.vue";
import StoreLogoUpload from "./StoreLogoUpload.vue";
export default {
  components: {
    StoreLogoUpload,
    StoreInfoUpload,
    BmLocalSearch,
    BaiduMap,
    BmView,
  },
  data() {
    return {
      config: {
        rules: [
          { type: "object", required: false, message: "请选择营业时间!" },
        ],
      },
      form: this.$form.createForm(this),
      openinghours: null,
      closinghours: null,
      // 是否显示排序按钮
      isShowSort: false,
      // 滑动设定抽成比例
      slider: {
        value: 20,
      },
      // 上传页面中的排序是否展示
      inputValue1: 1,
      baiduMap: {
        mapAK: "QAVv9hnYBI89yS8eHYVBw3hh1boX4uiD",
        keyword: "",
        location: "",
      },
      center: { lng: 116.404, lat: 39.915 },
      // 地图逆向解析方法实例
      myGeo: null,
      // 已选坐标，呈现mark用
      point: { lng: 116.404, lat: 39.915 },
      city: "",
      province: "",
      district: "",
      storeAddress: "",
      // 门店logo
      storeLogo: "",
      // 门店照片
      storeurl: "",
      // 门店信息
      // storeInfo: {},
      // 门店状态
      storestatus: "0",
      storestatusItems: [
        { id: "0", text: "不营业" },
        { id: "1", text: "关店" },
        { id: "2", text: "休店" },
        { id: "3", text: "开店" },
        { id: "4", text: "异常" },
      ],
    };
  },
  props: {
    addVisible: {
      type: Boolean,
      default: false,
    },
    id: {
      type: Number,
      default: 0,
    },
  },
  mounted() {
    event.$on("storeLogoUrl", (res) => {
      let list = [];
      res.forEach((item) => {
        list.push(item.url);
      });
      this.storeLogo = JSON.stringify(list);
    });
    event.$on("storeInfoUrl", (res) => {
      let list = [];
      res.forEach((item) => {
        list.push(item.url);
      });
      // TODO: 再删除之后，需要将数组中的内容也删除
      this.storeurl = JSON.stringify(list);
    });
  },
  computed: {
    visible() {
      return this.addVisible;
    },
    judge() {
      return this.id;
    },
    location() {
      return this.baiduMap.location;
    },
  },
  watch: {
    judge: {
      handler(id) {
        if (id != 0) {
          this.getMallInfo(id);
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 取消按钮
    handleCancel() {
      this.id = 0;
      this.$emit("close");
    },
    // 点击确认按钮
    handleSubmit(e) {
      // 新建门店
      if (this.judge == 0) {
        e.preventDefault();
        this.form.validateFields(async (err, fieldsValue) => {
          if (err) {
            console.log(err);
            return;
          }
          const value = {
            ...fieldsValue,
            openinghours: fieldsValue["openinghours"].format("HH:mm:ss"),
            closinghours: fieldsValue["closinghours"].format("HH:mm:ss"),
            slider: this.slider.value,
          };
          await this.onUploadData(value);
        });
      } else {
        // 修改门店
        this.form.validateFields(async (err, fieldsValue) => {
          if (err) {
            console.log(err);
            return;
          }
          const value = {
            ...fieldsValue,
            id: this.id,
            storestatus: this.storestatus,
            // openinghours: fieldsValue["openinghours"].format("HH:mm:ss"),
            // closinghours: fieldsValue["closinghours"].format("HH:mm:ss"),
            slider: this.slider.value,
          };
          // console.log(this.storestatus);

          this.$put("/business/LantianStore", { ...value }).then((res) => {
            if (res.data.code == 200) {
              this.$message.success("更新门店成功");
              this.$emit("close");
              event.$emit("mallChangeDone");
              this.id = 0;
            }
          });
        });
      }
    },
    // 网络请求商铺信息
    getMallInfo(id) {
      this.$get(`/business/LantianStore/${id}`).then((res) => {
        return this.onUpdateQuestion(res.data.data);
      });
    },
    // 修改门店信息
    onUpdateQuestion(storeInfo) {
      console.log(storeInfo.storestatus);
      this.form.getFieldDecorator("companyname");
      this.form.getFieldDecorator("storeowner");
      this.form.getFieldDecorator("storephone");
      this.form.getFieldDecorator("bossmobilenumber");
      this.form.getFieldDecorator("storeAddress");
      this.form.getFieldDecorator("detailedintroduction");
      // this.form.getFieldDecorator("openinghours");
      // this.form.getFieldDecorator("closinghours");
      this.form.setFieldsValue({
        companyname: storeInfo.companyname,
        storeowner: storeInfo.storeowner,
        storephone: storeInfo.storephone,
        bossmobilenumber: storeInfo.bossmobilenumber,
        detailedintroduction: storeInfo.detailedintroduction,
        // openinghours: storeInfo.openinghours,
        // closinghours: storeInfo.closinghours,
        storeAddress: storeInfo.address,
      });
      this.storestatus = storeInfo.storestatus;
      console.log(this.storestatus);
      this.baiduMap.keyword = storeInfo.address;
      // this.openinghours = storeInfo.openinghours;
      // this.closinghours = storeInfo.closinghours;
    },
    // 上传门店信息服务器
    async onUploadData(formData) {
      const params = {
        bossmobilenumber: formData.bossmobilenumber,
        companyname: formData.companyname,
        logo: this.storeLogo,
        storeowner: formData.storeowner,
        storephone: formData.storephone,
        address: formData.storeAddress,
        storeurl: this.storeurl,
        detailedintroduction: formData.detailedintroduction,
        // 默认传递 0-不营业 的状态
        storestatus: 0,
        // 标语：后续需求
        // slogan: formData.storeSlogan,
        openinghours: formData.openinghours,
        closinghours: formData.closinghours,
        spendpercent: formData.slider + "",
        localxy: this.point.lat + "," + this.point.lng,
      };

      let user = this.$db.get("USER");
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        await this.$get(
          `/business/LantianStore/getByPhone/${user.username}`
        ).then((res) => {
          // 自己门店ID当做旗下代理的父亲ID
          params["parentid"] = res.data.data.id;
        });
      }

      this.$post("/business/LantianStore", { ...params }).then((res) => {
        if (res.data.code == 200) {
          this.$message.success("新增门店成功");
          this.$emit("close");
          this.id = 0;
        } else {
          this.$message.error("重复添加");
        }
      });
    },
    // 地区下拉更改
    onRegionChange(value) {
      this.baiduMap.location = value;
    },

    // 地图左键选点
    selectPoint({ type, target, point, pixel, overlay }) {
      // 获取当前坐标
      this.point = point;
      const _this = this;
      // 根据坐标逆解析获取地址详细描述
      this.myGeo.getLocation(point, function (result) {
        if (result) {
          _this.city = result.addressComponents.city;
          _this.province = result.addressComponents.province;
          _this.district = result.addressComponents.district;

          //把得到的详细地址的信息回显给用户
          _this.storeAddress =
            result.surroundingPois.length > 0
              ? result.surroundingPois[0].address +
                result.surroundingPois[0].title
              : result.address;
          _this.form.setFieldsValue({
            storeAddress: _this.storeAddress,
          });
        }
      });
    },
    // 地图初始化
    mapReady({ BMap, map }) {
      const _this = this;
      // 获取自动定位方法
      var geolocation = new BMap.Geolocation();
      // 获取逆解析方法实例
      this.myGeo = new BMap.Geocoder();
      // 获取自动定位获取的坐标信息
      geolocation.getCurrentPosition(
        function (r) {
          _this.center = {
            lng: r.point.lng,
            lat: r.point.lat,
          };
          _this.point = {
            lng: r.point.lng,
            lat: r.point.lat,
          };
        },
        { enableHighAccuracy: true }
      );
    },
    // 改变分类选择
    changeStatus(e) {
      this.storestatus = e.target.value;
    },
    onMapClick(e) {
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
    },
  },
};
</script>
<style scoped>
.code-box-demo .ant-slider {
  margin-bottom: 16px;
}
</style>
