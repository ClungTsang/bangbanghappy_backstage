<template>
  <a-card :bordered="false">
    <a-row>
      <a-col :span="8">
        <a-space>
          <!-- 新增轮播图按钮 -->
          <a-button
            @click="
              () => {
                isModalShow = true;
              }
            "
            type="primary"
            ghost
          >
            新增图片
          </a-button>
          <!-- 删除轮播图按钮 -->
          <!-- <a-button
            @click="
              () => {
                batchDeleteVisible = true;
              }
            "
          >
            多选删除
          </a-button> -->
        </a-space>
      </a-col>
    </a-row>
    <div>
      <!-- 轮播图展示信息 -->
      <a-table
        ref="TableInfo"
        :rowKey="record => record.id"
        :columns="columns"
        :data-source="dataSource"
        :pagination="pagination"
        :loading="loading"
        :row-selection="{
          selectedRowKeys: selectedRowKeys,
          onChange: onSelectChange
        }"
        @change="handleTableChange"
      >
        <!-- 图片 -->
        <span slot="carouselimgurl" slot-scope="text, record">
          <img style="width: 300px; heigth: auto" :src="text" />
        </span>
        <!-- 跳转状态 -->
        <span slot="carouselstatus" slot-scope="carouselstatus">
          <a-tag
            v-for="tag in carouselstatus"
            :key="tag"
            :color="tag == 0 ? 'blue' : tag > 2 ? 'orange' : 'green'"
          >
            {{
              tag == 0
                ? "不跳转"
                : tag == 1
                ? "跳转到指定产品"
                : tag == 2
                ? "跳转到指定网址"
                : "跳转到自定义内容"
            }}
          </a-tag>
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
          isModalShow = false;
          fetch();
        "
      ></banner-upload-modal>
      <banner-change-modal
        :isVisible="isModalChange"
        :targetBanner="targetBanner"
        @changeIsVisible="
          isModalChange = false;
          fetch();
        "
      ></banner-change-modal>
    </div>
    <!-- <a-modal
      title="提示"
      :visible="batchDeleteVisible"
      @ok="onBatchDelete"
      @cancel="batchDeleteVisible = false"
    >
      <p>确定删除选中轮播图吗?</p>
    </a-modal> -->
  </a-card>
</template>
<script>
import { formatUrl, restoreUrl } from "@/utils/urlTool";

import BannerUploadModal from "./components/BannerUploadModal.vue";
import BannerChangeModal from "./components/BannerChangeModal.vue";
const columns = [
  {
    title: "排序",
    dataIndex: "ordernum",
    key: "ordernum",
    align: "center",
    width: 100
  },
  {
    title: "轮播图",
    align: "center",
    dataIndex: "carouselimgurl",
    scopedSlots: { customRender: "carouselimgurl" },
    width: 300
  },
  {
    title: "跳转状态",
    align: "center",
    dataIndex: "carouselstatus",
    scopedSlots: { customRender: "carouselstatus" },
    width: 100
  },
  {
    title: "创建时间",
    align: "center",
    dataIndex: "createtime",
    key: "createindex",
    width: 250
  },
  {
    title: "修改时间",
    align: "center",
    dataIndex: "updatetime",
    key: "updatetime",
    width: 250
  },

  {
    title: "操作",
    align: "center",
    key: "action",
    width: 300,
    scopedSlots: { customRender: "action" }
  }
];

export default {
  components: { BannerUploadModal, BannerChangeModal },
  data() {
    return {
      dataSource: [],
      columns,
      selectedRowKeys: [],
      queryParams: {},
      filteredInfo: null,
      sortedInfo: null,
      paginationInfo: null,
      loading: false,
      pagination: {
        pageSizeOptions: ["10", "20", "30", "40", "100"],
        defaultCurrent: 1,
        defaultPageSize: 10,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total, range) =>
          `显示 ${range[0]} ~ ${range[1]} 条记录，共 ${total} 条记录`
      },
      // 上传moda
      isModalShow: false,
      // 修改modal
      isModalChange: false,
      // 批量删除轮播图
      batchDeleteVisible: false,
      // 修改目标
      targetBanner: null
    };
  },
  mounted() {
    this.fetch();
  },
  methods: {
    // 选择列
    onSelectChange(selectedRowKeys) {
      console.info("选择了: ", selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    // 展开更多筛选
    toggleAdvanced() {
      this.advanced = !this.advanced;
    },
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
      this.$get(`/backend/carousel/page`, {
        ...params
      }).then(res => {
        let pagination = { ...this.pagination };
        pagination.total = res.data.data.total;
        let dataSource = [];
        if (res.data.data.rows) {
          let result = res.data.data.rows;
          for (let i = 0; i < result.length; i++) {
            let item = result[i];
            item["carouselimgurl"] = restoreUrl(
              JSON.parse(result[i].carouselimgurl)
            )[0];
            dataSource.push(item);
          }
        }
        this.dataSource = dataSource;
        this.pagination = pagination;
        this.loading = false;
      });
    },
    // 单选多选删除
    onBatchDelete() {
      this.selectedRowKeys.forEach(id => {
        let dataSource = this.dataSource.filter(item => {
          return item.id !== id;
        });
        this.dataSource = dataSource;
      });
      this.selectedRowKeys = [];
      this.batchDeleteVisible = false;
      this.$message.success("删除成功");
      this.selectedRowKeys.forEach(async id => {
        await this.$delete("/backend/carousel", { id: id });
      });
    },
    // 删除轮播图
    confirmDelete(record) {
      let dataSource = this.dataSource.filter(item => {
        return item.id !== record.id;
      });
      this.dataSource = dataSource;
      this.$delete("/backend/carousel", { id: record.id }).then(() => {
        this.$message.success("删除成功");
      });
    },
    // 修改轮播图
    changeInfoModal(record) {
      // console.info("修改轮播图假死");
      this.targetBanner = record;
      this.isModalChange = true;
    }
  }
};
</script>
