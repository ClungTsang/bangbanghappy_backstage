<template>
  <div>
    <a-modal
      :visible="visible"
      title="新建门店"
      @ok="handleSubmit"
      @cancel="handleCancel"
    >
      <a-form :form="form">
        <a-form-item label="门店名称">
          <a-input
            v-decorator="[
              'storeName',
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
        <a-form-item label="门店图标">
          <banner-upload-image
            ref="UploadImage"
            :sort="isShowSort"
            v-on="$listeners"
            v-decorator="[
              'storeLogo',
              {
                rules: [
                  {
                    required: false,
                  },
                ],
              },
            ]"
            >上传门店logo</banner-upload-image
          >
        </a-form-item>
        <a-form-item label="门店照片">
          <banner-upload-image
            ref="UploadImage"
            :sort="isShowSort"
            v-on="$listeners"
            v-decorator="[
              'storePhoto',
              {
                rules: [
                  {
                    required: false,
                  },
                ],
              },
            ]"
            >上传门店照片</banner-upload-image
          >
        </a-form-item>
        <a-form-item label="门店详细介绍">
          <a-textarea
            placeholder="请介绍门店的详细信息..."
            v-decorator="[
              'storeIntroduce',
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
        <a-form-item label="营业时间">
          <a-time-picker v-decorator="['openTime', config]" />
          <span>~</span>
          <a-time-picker v-decorator="['closeTime', config]" />
        </a-form-item>
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
import { BmLocalSearch, BaiduMap, BmView } from "vue-baidu-map";
import BannerUploadImage from "../../../data/banner/components/BannerUploadImage.vue";
export default {
  components: { BannerUploadImage, BmLocalSearch, BaiduMap, BmView },
  data() {
    return {
      config: {
        rules: [{ type: "object", required: true, message: "请选择营业时间!" }],
      },
      form: this.$form.createForm(this, { name: "dynamic_rule" }),
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
    };
  },
  props: {
    addVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.addVisible;
    },
    location() {
      return this.baiduMap.location;
    },
  },
  watch: {
    center(val) {
      console.log(val);
    },
  },
  methods: {
    // 取消按钮
    handleCancel() {
      this.$emit("close");
    },
    // 点击确认按钮
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }
        const value = {
          ...fieldsValue,
          openTime: fieldsValue["openTime"].format("HH:mm:ss"),
          closeTime: fieldsValue["closeTime"].format("HH:mm:ss"),
          slider: this.slider.value,
        };
        // console.log("form内容: ", value);
        await this.onUploadData(value);
      });
    },
    // 上传门店信息服务器
    async onUploadData(formData) {
      const params = {
        bossmobilenumber: formData.bossmobilenumber,
        companyname: formData.storeName,
        logo: formData.storeLogo[0].url,
        storeowner: formData.storeowner,
        storephone: formData.storephone,
        address: formData.storeAddress,
        storeurl: formData.storePhoto[0].url,
        detailedintroduction: formData.storeIntroduce,
        // 默认传递 0-不营业 的状态
        storestatus: 0,
        // 标语：后续需求
        // slogan: formData.storeSlogan,
        openinghours: formData.openTime,
        closinghours: formData.closeTime,
        spendpercent: formData.slider + "",
        localxy: this.point.lat + "," + this.point.lng,
      };

      let user = this.$db.get("USER");
      if (user.description == "一级代理" || user.roleName == "一级代理") {
        await this.$get(`/business/LantianStore/${user.userId}`).then((res) => {
          params["parentid"] = res.data.data.id;
        });
      }

      this.$post("/business/LantianStore", { ...params }).then(
        () => {
          this.$emit("close");
          this.$message.success("新增门店成功");
        },
        () => {
          this.$message.error("新增失败");
        }
      );
    },
    // 上传图片到后台数据库
    uploadImage() {
      // 调用节点方法，上传图片至数据库
      this.$refs.UploadImage.afterUpload();
    },
    // 地区下拉更改
    onRegionChange(value) {
      this.baiduMap.location = value;
      // console.log(this.baiduMap.location);
    },

    // 地图左键选点
    selectPoint({ type, target, point, pixel, overlay }) {
      // 获取当前坐标
      this.point = point;
      // console.log(this.point);
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
    onMapClick(e) {
      this.center.lng = e.point.lng;
      this.center.lat = e.point.lat;
      console.log(this.center);
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
