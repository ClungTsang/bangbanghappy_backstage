<template>
  <div>
    <a-card :bordered="false">
      <a-table :columns="columns" :data-source="userData" :scroll="{ x: 1500 }">
        <span slot="avatar" slot-scope="text, record">
          <img style="width: 60px; heigth: 60px" :src="record.avatar" />
        </span>
        <span slot="action" slot-scope="text, record">
          <a href="javascript:;">操作</a>
        </span>
      </a-table>
    </a-card>
  </div>
</template>
<script>
const columns = [
  {
    title: "头像",
    dataIndex: "avatar",
    scopedSlots: { customRender: "avatar" },
    width: 100,
    align: "center",
  },
  {
    title: "用户姓名",
    dataIndex: "name",
    width: 150,
    align: "center",
  },
  {
    title: "电话号码",
    dataIndex: "telephone",
    width: 200,
    align: "center",
  },
  {
    title: "会员等级",
    dataIndex: "viplevel",
    width: 100,
    align: "center",
  },
  {
    title: "更新时间",
    dataIndex: "membership",
    width: 200,
    align: "center",
  },
  {
    title: "操作",
    dataIndex: "action",
    align: "center",
    width: 100,
    scopedSlots: { customRender: "action" },
  },
];
// import api from "../user.js";
export default {
  data() {
    return {
      userData: [],
      columns,
    };
  },
  created() {
    this.getUserCustomer();
  },
  methods: {
    // 获取用户信息
    getUserCustomer() {
      this.$get("/wechatcustomer").then((res) => {
        return this.setUserCustomer(res.data.data);
      });
    },
    // 设置用户信息
    setUserCustomer(userDataList) {
      userDataList.forEach((item) => {
        this.userData.push({
          avatar: item.headimgurl,
          name: item.customername,
          telephone: item.phonenum,
          viplevel: item.viplevel,
          membership: item.updatetime,
        });
      });
    },
  },
};
</script>
