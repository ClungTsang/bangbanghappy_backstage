<template>
  <div>
    <a-table :columns="columns" :data-source="dataSource">
      <span slot="action" slot-scope="text, record">
        <a-popconfirm
          title="确定删除该申请"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除申请</a>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>

        <a @click="showPicModal(record)">查看图片</a>
      </span>
    </a-table>
    <a-modal
      :visible="showPic"
      title="查看图片"
      @ok="closePicModal"
      @cancel="closePicModal"
    >
      <div v-for="(item, index) in JSON.parse(picList)" :key="index" >
        <img
          style="width: 450px; heigth: auto; margin-bottom: 20px"
          :src="item"
        />
      </div>
    </a-modal>
  </div>
</template>
<script>
const columns = [
  { title: "id", dataIndex: "id" },
  {
    title: "申请人",
    width: 120,
    dataIndex: "name",
    align: "center",
  },
  {
    title: "联系方式",
    width: 130,
    dataIndex: "phone",
    align: "center",
  },
  {
    title: "申请理由",
    width: 300,
    dataIndex: "apply",
    align: "center",
  },
  {
    title: "商家地址",
    width: 200,
    dataIndex: "address",
    align: "center",
  },
  { title: "申请时间", width: 200, dataIndex: "createtime", align: "center" },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" },
  },
];
export default {
  data() {
    return {
      columns,
      dataSource: [],
      form: this.$form.createForm(this),
      question: null,
      showPic: false,
      picList: null,
    };
  },
  created() {
    this.getMoveInto();
  },
  methods: {
    // 获取所有入驻申请
    getMoveInto() {
      this.$get("/backend/notice/selectAllByNoticeStatus", {
        noticestatus: 1,
      }).then((res) => {
        let dataSource = res.data.data.rows;
        // const dataSource = [...this.dataSource];
        dataSource.forEach((item) => {
          let content = JSON.parse(item.content);
          let title = JSON.stringify(item.title).split(" ");
          item.apply = content[0];
          item.address = content[1];
          item.name = title[0];
          item.phone = title[1];
          this.dataSource.push(item);
        });
      });
    },
    // 删除入驻申请
    confirmDelete(record) {
      this.$delete("/backend/notice", { id: record.id }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.id !== record.id);
        this.$message.success("删除成功");
      });
    },
    // 查看图片
    showPicModal(record) {
      console.log(record);
      this.picList = record.picUrl;
      this.showPic = true;
    },
    // 关闭图片
    closePicModal() {
      this.showPic = false;
      this.picList = null;
    },
  },
};
</script>
<style>
</style>
