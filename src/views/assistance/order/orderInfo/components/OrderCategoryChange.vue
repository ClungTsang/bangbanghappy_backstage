<template>
  <div>
    <a-select  style="width:150px" v-model="order.text">
      <!-- <a-select-option v-for="item in items" :key="item.id" :value="item.text">
        {{ item.text }}
      </a-select-option> -->

      <a-select-option value="未付款">未付款</a-select-option>
      <a-select-option value="已付款">已付款</a-select-option>
      <a-select-option value="配送中">配送中</a-select-option>
      <a-select-option value="已送达">已送达</a-select-option>
      <a-select-option value="待处理">待处理</a-select-option>
      <a-select-option value="已关闭">已关闭</a-select-option>
    </a-select>
  </div>
</template>
<script>

import { mapState } from "vuex";
import event from "@/utils/event";
export default {
  data() {
    return {
      order: {
        text: "切换订单模块",
      },
      items: [],
    };
  },

  computed: {
    ...mapState({
      userInfo: (state) => state.account.userInfo,
    }),
  },
  created() {
    // this.getOrderInfo();
  },
  methods: {
    // TODO:后续优化一个显示全部，用于默认显示和点击全部查看
    // 网络获取所有分类数据
    // async getOrderInfo() {
    //   // 用我们门店信息中的 门店id=storeid
    //   const res = await this.getStoreInfo();
    //   this.setUserInfo(res.data.data);
    //   this.storeId = res.data.data.id;
    //   const params = {
    //     // LantianDishmanagementstatus: 0,
    //     storeid: this.storeId,
    //   };
    //   // 根据storeid全查菜品分类
    //   // this.$get(`/backend/business/LantianDishmanagement/MapAllByStoreId`, {
    //   this.$get(
    //     `/backend/business/LantianDishesclassificationtable/MapAllByStoreId`,
    //     {
    //       ...params,
    //     }
    //   ).then((res) => {
    //     return this.setOrderInfo(res.data.data);
    //   });
    // },
    // 渲染数据到浏览器端
    // setOrderInfo(order) {
    //   this.items = order;
    // },
    // 获取当前我的门店信息
    // getStoreInfo() {
    //   const user = this.$db.get("USER");
    //   return this.$get(`/business/LantianStore/getByPhone/${user.username}`);
    // },
    // 新增分类回调
  },
  watch: {
    async "order.text"(val) {
      // 传输门店id和选择的分类
      // let res = {
      //   storeId: this.storeId,
      //   order: val,
      // };
      event.$emit("transferOrder", val);
    },
  },
};
</script>
<style>
</style>
