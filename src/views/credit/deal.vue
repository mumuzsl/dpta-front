<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="输入分销商名"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center">
        <template slot-scope="scope">{{ scope.row.dealId }}</template>
      </el-table-column>
      <el-table-column label="供应商ID" align="center">
        <template slot-scope="scope">{{ scope.row.distrId }}</template>
      </el-table-column>
      <el-table-column label="授信额度" align="center">
        <template slot-scope="scope">￥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.stateStr }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">查看详情</el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            Delete
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getDetail, getList, fetchList } from "@/api/table";
import { fetchData, fetchDeal } from "@/api/credit";
import { parseTime, formatTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "gray", "danger"];
      return statusMap[status];
    },
  },
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      stateList: ["success", "gray", "danger"],
      total: 0,
      options: [
        {
          value: 0,
          label: "商品名称",
        },
        {
          value: 1,
          label: "商铺名称",
        },
        {
          value: 2,
          label: "状态",
        },
      ],
      listQuery: {
        keyword: undefined,
        option: 0,
        page: 1,
        size: 10,
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchDeal(this.listQuery).then((response) => {
        console.log(response);
        this.list = response.data.records;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.3 * 1000);
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.$router.push({
        path: "/credit/deal-detail",
        query: { uid: row.dealId },
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
  },
};
</script>

<style scoped>
.filter-container {
  /* padding: 10px; */
}

.filter-item {
  margin: 5px;
}
</style>
