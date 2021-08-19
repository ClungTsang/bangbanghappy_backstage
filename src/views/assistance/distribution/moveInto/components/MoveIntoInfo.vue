<template>
  <div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :pagination="pagination"
      :loading="loading"
      @change="handleTableChange"
    >
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
      :footer="null"
    >
      <div v-for="(item, index) in JSON.parse(picList)" :key="index">
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
  // { title: "id", dataIndex: "id" },
  {
    title: "申请人",
    width: 120,
    dataIndex: "name",
    align: "center"
  },
  {
    title: "联系方式",
    width: 130,
    dataIndex: "phone",
    align: "center"
  },
  {
    title: "申请理由",
    width: 200,
    dataIndex: "apply",
    align: "center",
    ellipsis: true
  },
  {
    title: "商家地址",
    width: 300,
    dataIndex: "address",
    align: "center",
    ellipsis: true
  },
  { title: "申请时间", width: 200, dataIndex: "createtime", align: "center" },
  {
    title: "操作",
    width: 200,
    dataIndex: "action",
    align: "center",
    scopedSlots: { customRender: "action" }
  }
];
export default {
  data() {
    return {
      columns,
      dataSource: [],
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      loading: false,
      form: this.$form.createForm(this),
      question: null,
      showPic: false,
      picList: null
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    // 分页切换
    handleTableChange(pagination, filters, sorter) {
      const pager = { ...this.pagination };
      pager.current = pagination.current;
      this.pagination = pager;
      this.fetch({
        pageSize: pagination.pageSize,
        pageNum: pagination.current
      });
    },
    // 网络请求
    fetch(params = {}) {
      this.loading = true;
      this.dataSource = [];
      this.$get("/backend/notice/selectAllByNoticeStatus", {
        pageSize: 10,
        noticestatus: 1,
        ...params
      }).then(res => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        // 遍历数组
        let dataSource = [];
        if (res.data.data.rows) {
          res.data.data.rows.forEach(item => {
            let content = JSON.parse(item.content);
            let title = item.title.split(" ");
            item.apply = content[0];
            item.address = content[1];
            item.name = title[0];
            item.phone = title[1];
            dataSource.push(item);
          });
        }
        this.pagination = pagination;
        this.dataSource = dataSource;
      });
      this.loading = false;
    },

    // 删除入驻申请
    confirmDelete(record) {
      this.$delete("/backend/notice", { id: record.id }).then(() => {
        const dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter(item => item.id !== record.id);
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
    }
  }
};
</script>
<style></style>
