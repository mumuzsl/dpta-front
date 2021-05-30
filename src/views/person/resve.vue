<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="uid"
        placeholder="输入订单id"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />-->
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleFilter"
      >充值</el-button>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="handleTransfer"
      >提现</el-button>

      <add-resve :title="'充值预备金'" :limit="undefined" :visible.sync="visible" />
      <transfer :title="'提现预备金'" :limit="list[0].balance" :visible.sync="visible2" />
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
        <template slot-scope="scope">{{ scope.row.dResId }}</template>
      </el-table-column>
      <el-table-column label="类型" align="center">
        <template slot-scope="scope">{{ scope.row.typeStr }}</template>
      </el-table-column>

      <el-table-column label="金额" align="center">
        <template slot-scope="scope">￥{{ scope.row.amount }}</template>
      </el-table-column>
      <el-table-column label="余额" align="center">
        <template slot-scope="scope">￥{{ scope.row.balance }}</template>
      </el-table-column>
      <el-table-column label="交易ID" align="center">
        <template slot-scope="scope">{{ scope.row.dealId }}</template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="300">
        <template slot-scope="scope">
          <!-- <i class="el-icon-time" /> -->
          <span>{{ scope.row.createTm }}</span>
        </template>
      </el-table-column>
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
import { getResve, transfer } from "@/api/person";
import AddResve from "@/views/person/AddResve";
import waves from "@/directive/waves"; // waves directive
import Transfer from "./transfer.vue";
// import AddResve from "./addResve.vue";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "gray", "danger"];
      return statusMap[status];
    },
  },
  components: { Pagination, AddResve, Transfer },
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
      stateList: ["success", "gray", "danger"],
      total: 0,
      visible: false,
      visible2: false,
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      getResve(this.listQuery).then((response) => {
        this.list = response.data.records;
        this.total = response.data.total;
        console.log(response);
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.listLoading = true;
      if (this.uid !== 0) {
        this.fetchData();
      } else {
        this.listLoading = false;
      }
      this.visible = true;
    },
    handleTransfer() {
      this.listQuery.page = 1;
      this.listLoading = true;
      if (this.uid !== 0) {
        setTimeout(() => {
          this.fetchData();
        }, 1000);
      } else {
        this.listLoading = false;
      }
      this.visible2 = true;
    },
  },
};
</script>

<style>
.filter-item {
  margin: 5px;
}
</style>
