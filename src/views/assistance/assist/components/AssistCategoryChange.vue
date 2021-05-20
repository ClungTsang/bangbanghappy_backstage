<template>
  <div>
    <a-select style="width: 150px" v-model="assist.text">
      <!-- <a-select-option v-for="item in items" :key="item.id" :value="item.text">
        {{ item.text }}
      </a-select-option> -->

      <a-select-option value="待援助">待援助</a-select-option>
      <a-select-option value="援助中">援助中</a-select-option>
      <a-select-option value="已完成">已完成</a-select-option>
      <a-select-option value="处理中">处理中</a-select-option>
    </a-select>
  </div>
</template>
<script>
import { mapState } from "vuex";
import event from "../../../../utils/event";
export default {
  data() {
    return {
      assist: {
        text: "切换状态",
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
    //     // TODO:如果便携小程序 就传1
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
    async "assist.text"(val) {
      // 传输门店id和选择的分类
      // let res = {
      //   storeId: this.storeId,
      //   assist: val,
      // };
      event.$emit("transferAssist", val);
    },
  },
};
</script>
<style>
</style>
