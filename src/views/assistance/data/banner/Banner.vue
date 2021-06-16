<template>
  <div>
    <!-- 新增轮播图按钮 -->
    <a-button
      @click="
        () => {
          this.isModalShow = true;
        }
      "
      type="primary"
      ghost
      v-hasPermission="['banner:add']"
      >新增图片</a-button
    >
    <!-- 删除轮播图按钮 -->
    <a-button
      @click="
        () => {
          this.deleteVisible = true;
        }
      "
      v-hasPermission="['banner:delete']"
      >多选删除</a-button
    >
    <a-modal
      title="提示"
      :visible="deleteVisible"
      @ok="onBatchDelete"
      @cancel="
        () => {
          this.deleteVisible = false;
        }
      "
    >
      <p>确定删除选中轮播图吗?此操作不可逆</p>
    </a-modal>
    <!-- 轮播图展示信息 -->
    <a-table
      :columns="columns"
      :data-source="dataSource"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
      :scroll="{ x: 1000 }"
    >
      <span slot="banner" slot-scope="text, record">
        <img style="width: 300px; heigth: auto" :src="record.banner" />
      </span>
      <span slot="action" slot-scope="text, record">
        <a-divider type="vertical"></a-divider>
        <a-popconfirm
          title="确定删除该轮播图"
          ok-text="确定"
          cancel-text="取消"
          @confirm="confirmDelete(record)"
        >
          <a>删除</a>
        </a-popconfirm>
        <a-divider type="vertical"></a-divider>
        <a @click="changeInfoModal(record)">修改</a>
      </span>
    </a-table>
    <banner-upload-modal
      :isVisible="isModalShow"
      @uploadIsVisible="
        () => {
          this.isModalShow = false;
        }
      "
      @uploadImage="onUploadImage"
    ></banner-upload-modal>
    <banner-change-modal
      :isVisible="isModalChange"
      :targetId="targetId"
      @changeIsVisible="
        () => {
          this.isModalChange = false;
        }
      "
      @changeImage="onUploadImage"
    ></banner-change-modal>
  </div>
</template>
<script>
import BannerUploadModal from "./components/BannerUploadModal.vue";
import BannerChangeModal from "./components/BannerChangeModal.vue";
const columns = [
  {
    title: "排序",
    dataIndex: "ordernum",
    key: "ordernum",
    align: "center",
    width: 100,
  },
  {
    title: "轮播图",
    align: "center",
    dataIndex: "banner",
    scopedSlots: { customRender: "banner" },
    width: 400,
  },
  {
    title: "创建时间",
    align: "center",
    dataIndex: "createtime",
    key: "createindex",
    width: 300,
  },
  {
    title: "修改时间",
    align: "center",
    dataIndex: "updatetime",
    key: "updatetime",
    width: 300,
  },

  {
    title: "操作",
    align: "center",
    key: "action",
    width: 200,
    scopedSlots: { customRender: "action" },
  },
];
export default {
  components: { BannerUploadModal, BannerChangeModal },
  data() {
    return {
      dataSource: [],
      columns,
      // 上传modal
      isModalShow: false,
      // 修改modal
      isModalChange: false,
      targetId: 0,
      deleteVisible: false,
      selectedRowKeys: [],
    };
  },
  created() {
    this.getBanner();
  },
  methods: {
    // 网络获取轮播图
    getBanner() {
      let token = this.$db.get("USER_TOKEN");
      this.$get("backend/carousel/all", {
        Authentication: token,
      }).then((r) => {
        return this.setBanner(r.data.data);
      });
    },
    // 渲染轮播图信息到浏览器
    setBanner(banner) {
      banner.forEach((item) => {
        this.dataSource.push({
          key: item.id,
          ordernum: item.ordernum,
          banner: item.carouselimgurl,
          createtime: item.createtime,
          updatetime: item.updatetime,
        });
      });
    },

    // 新增轮播图
    onUploadImage(bannerInfo) {
      const { dataSource } = this;
      let newBanner = {
        key: bannerInfo.id,
        ordernum: bannerInfo.ordernum,
        banner: bannerInfo.carouselimgurl,
        createtime: bannerInfo.createtime,
        updatetime: bannerInfo.updatetime,
      };
      this.dataSource = [...dataSource, newBanner];
    },
    // 选择列
    onSelectChange(selectedRowKeys) {
      console.log("selectedRowKeys changed: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 单选多选删除
    onBatchDelete() {
      this.selectedRowKeys.forEach((id) => {
        this.$delete("backend/carousel", { id: id }).then(() => {
          let dataSource = [...this.dataSource];
          this.dataSource = dataSource.filter((item) => item.key !== id);
        });
      });
      this.selectedRowKeys = [];
      this.deleteVisible = false;
      this.$message.success("删除成功");
    },
    // 删除轮播图
    confirmDelete(record) {
      this.$delete("backend/carousel", { id: record.key }).then(() => {
        let dataSource = [...this.dataSource];
        this.dataSource = dataSource.filter((item) => item.key !== id);
        this.$message.success("删除成功");
      });
    },
    // 修改轮播图
    changeInfoModal(record) {
      this.targetId = record.key;
      this.isModalChange = true;
    },
  },
};
</script>
