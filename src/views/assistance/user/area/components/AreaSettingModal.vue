<template>
  <div>
    <a-modal
      title="编辑区域代理"
      :visible="visible"
      :width="900"
      :destroyOnClose="true"
      :maskClosable="false"
      @ok="handleOk"
      @cancel="() => {$emit('close')}"
    >
      <a-form
        :form="form"
        :label-col="labelCol"
        :wrapper-col="wrapperCol"
      >
        <a-form-item label="区域代理名称描述">
          <a-input
            placeholder="请输入区域代理名称描述"
            v-decorator="[
              'agentinformationdescription',
              {
                rules: [
                  {
                    required: true,
                    message: '请输入区域代理名称描述'
                  }
                ]
              }
            ]"
          ></a-input>
        </a-form-item>
        </a-form-item>
        <a-form-item label="半径（千米）">
          <a-input-number
            v-decorator="[
              'radius',
              {
                initialValue: '1',
              }
            ]"
            :min="1"
            :max="9999999"
          />
        </a-form-item>
        <a-form-item label="中心区域代理">
          <a-input
            v-model="baiduMap.keyword"
            placeholder="搜索"
            v-decorator="[
              'agentinformationname'
            ]"
          >
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

      </a-form>
    </a-modal>
  </div>
</template>

<script>
const labelCol = {
  xl: { span: 4 },
  xs: { span: 24 },
  sm: { span: 5 },
}
const wrapperCol = {
  xl: { span: 20 },
  xs: { span: 24 },
  sm: { span: 12 },
}
import { BmLocalSearch, BaiduMap, BmView, BmMarker } from 'vue-baidu-map'
export default {
  data() {
    return {
      labelCol,
      wrapperCol,
      form: this.$form.createForm(this, { name: 'area_add_form' }),
      baiduMap: {
        mapAK: 'QAVv9hnYBI89yS8eHYVBw3hh1boX4uiD',
        keyword: '',
        location: '',
      },
      center: { lng: 116.404, lat: 39.915 },
      // 地图逆向解析方法实例
      myGeo: null,
      // 已选坐标，呈现mark用
      point: { lng: 116.404, lat: 39.915 },
      city: '',
      province: '',
      district: '',
      areaInfo: null,
    }
  },
  components: {
    BmMarker,
    BmLocalSearch,
    BaiduMap,
    BmView,
  },
  props: {
    areaVisible: {
      type: Boolean,
      default: false,
    },
    targetAreaId: {
      type: Number,
      default: 0,
    },
  },

  computed: {
    visible() {
      return this.areaVisible
    },
    location() {
      return this.baiduMap.location
    },
    judge() {
      return this.targetAreaId
    },
  },
  watch: {
    // judge: {
    //   handler(targetAreaId) {
    //     if (targetAreaId != 0) {
    //       this.getAgentInfo(targetAreaId);
    //     }
    //   },
    //   immediate: true,
    // },
    targetAreaId: {
      handler(targetAreaId) {
        if (targetAreaId != 0) {
          this.getAgentInfo(targetAreaId)
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 控制开关
    handleOk() {
      this.form.validateFields((err, values) => {
        if (err) {
          this.$message.error('检查内容')
          return
        }
        const params = {
          id: this.targetAreaId,
          ...values,
        }
        this.$post('/agentInformation/update', { ...params }).then((res) => {
          if (res.data.code == 200) {
            this.$message.success('更新区域代理成功')
            this.$emit('changeDone')
          }
        })
      })
    },
    // 网络请求商铺信息
    async getAgentInfo(targetAreaId) {
      let res = await this.$get(`/agentInformationById`, { id: targetAreaId })

      let result = res.data.data
         this.baiduMap.keyword = result.agentinformationname
         this.point ={ lat:result.longitiude,lat:result.latitiude}
        //  console.info(this.point)
      this.form.setFieldsValue({
        agentinformationdescription: result.agentinformationdescription,
        radius: parseFloat(result.radius)/1000,
        agentinformationname: result.agentinformationname,
      })
    },

    // 地图左键选点
    selectPoint({ type, target, point, pixel, overlay }) {
      console.info('地图选点坐标：',point)
      console.info('地图选点：',target)
      // 获取当前坐标
      this.point = point
      const _this = this
      // 根据坐标逆解析获取地址详细描述
      this.myGeo.getLocation(point, function (result) {
        if (result) {
          _this.city = result.addressComponents.city
          _this.province = result.addressComponents.province
          _this.district = result.addressComponents.district

          //把得到的详细地址的信息回显给用户
          // this.form.getFieldDecorator("agentinformationname");
          _this.form.setFieldsValue({
            agentinformationname:
              result.surroundingPois.length > 0
                ? result.surroundingPois[0].address +
                  result.surroundingPois[0].title
                : result.address,
          })
        }
      })
    },
    // 地图初始化
    mapReady({ BMap, map }) {
      const _this = this
      // 获取自动定位方法
      var geolocation = new BMap.Geolocation()
      // 获取逆解析方法实例
      this.myGeo = new BMap.Geocoder()
      // 获取自动定位获取的坐标信息
      geolocation.getCurrentPosition(
        function (r) {
          _this.center = {
            lng: r.point.lng,
            lat: r.point.lat,
          }
          _this.point = {
            lng: r.point.lng,
            lat: r.point.lat,
          }
        },
        { enableHighAccuracy: true }
      )
    },
    // 改变分类选择
    changeStatus(e) {
      this.storestatus = e.target.value
    },
    onMapClick(e) {
      this.center.lng = e.point.lng
      this.center.lat = e.point.lat
    },
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter()
      this.center.lng = lng
      this.center.lat = lat
      this.zoom = e.target.getZoom()
    },
  },
}
</script>
