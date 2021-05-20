<template>
  <div>
    <a-modal
      :visible="visible"
      title="选择你的门店地址"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <baidu-map
        class="bm-view"
        :zoom="15"
        :center="center"
        :ak="mapAK"
        inertial-dragging
        @ready="mapReady"
        @rightclick="selectPoint"
        :scroll-wheel-zoom="true"
      >
        <bm-marker
          :position="point"
          :dragging="true"
          animation="BMAP_ANIMATION_BOUNCE"
        ></bm-marker>
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
        ></bm-geolocation>
        <bm-local-search
          :keyword="keyword"
          @searchcomplete="search"
          :auto-viewport="true"
        ></bm-local-search>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      </baidu-map>
    </a-modal>
  </div>
</template>
<script>
import {
  BmGeolocation,
  BmLocalSearch,
  BmNavigation,
  BmMarker,
  BaiduMap,
} from "vue-baidu-map";
export default {
  data() {
    return {
      mapAK: "QAVv9hnYBI89yS8eHYVBw3hh1boX4uiD",
    };
  },
  components: {
    BmGeolocation,
    BmLocalSearch,
    BmNavigation,
    BmMarker,
    BaiduMap,
  },
  props: {
    mapVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    visible() {
      return this.mapVisible;
    },
  },
  methods: {
    handleOk() {
      this.$emit("close");
    },
    handleCancel() {
      this.$emit("close");
    },

    /* BMap是百度地图的对象，直接new出来跟原始的百度地图API一样使用，map是地图对象，可以调用对应的地图方法，比如添加marker */
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
  },
};
</script>
<style>
.bm-view {
  width: 100%;
  height: 400px;
}
</style>
