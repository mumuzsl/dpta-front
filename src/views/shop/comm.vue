<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="uid"
        placeholder="输入订单id"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      >
        <template slot="prepend">当前店铺id</template></el-input>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">
          {{ scope.row.commId }}
        </template>
      </el-table-column>
      <el-table-column label="商品名" align="center">
        <template slot-scope="scope">
          {{ scope.row.commNm }}
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">
          {{ scope.row.state }}
        </template>
      </el-table-column>
      <el-table-column label="供应商id" align="center">
        <template slot-scope="scope">
          {{ scope.row.suppId }}
        </template>
      </el-table-column>
      <el-table-column label="平台销售量" align="center">
        <template slot-scope="scope">
          {{ scope.row.salesVolume }}
        </template>
      </el-table-column>
      <el-table-column label="商品详情" align="center">
        <template slot-scope="scope">
          {{ scope.row.commD }}
        </template>
      </el-table-column>
      <el-table-column label="佣金规则id" align="center">
        <template slot-scope="scope">
          {{ scope.row.rCommId }}
        </template>
      </el-table-column>
      <el-table-column label="退款规则id" align="center">
        <template slot-scope="scope">
          {{ scope.row.refundId }}
        </template>
      </el-table-column>
      <!-- <el-table-column label="sku ID"  align="center">
        <template slot-scope="scope">
          {{ scope.row.state }}
        </template>
      </el-table-column> -->
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.size"
      @pagination="fetchData"
    />
  </div>
</template>

<script>
import { getDetail, getList } from "@/api/table";
import { fetchComms } from "@/api/shop";
import Pagination from "@/components/Pagination";
import waves from "@/directive/waves"; // waves directive

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
      uid: 0,
      listQuery: {
        keyword: undefined,
        option: 0,
        page: 1,
        size: 10,
      },
      stateList: ["启用", "禁用"],
      total: 0,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      var i = this.$route.query.uid;
      if (i != undefined) {
        this.uid = i;
      }
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.listLoading = true;
      if (this.uid !== 0) {
        fetchComms(this.uid, this.listQuery).then((response) => {
          this.list = response.data.records;
          this.total = response.data.total;
          this.listLoading = false;
        });
      } else {
        this.listLoading = false;
      }
    },
  },
};
</script>

<style>
.filter-item {
  margin: 5px;
}
</style>
