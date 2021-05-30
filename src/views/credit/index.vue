<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="输入供货商名"
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
        <template slot-scope="scope">{{ scope.row.creditId }}</template>
      </el-table-column>
      <el-table-column label="供应商ID" align="center">
        <template slot-scope="scope">{{ scope.row.suppId }}</template>
      </el-table-column>
      <el-table-column label="授信额度" align="center">
        <template slot-scope="scope">{{ scope.row.creditAmout }}</template>
      </el-table-column>
      <el-table-column label="授信剩余额度" align="center">
        <template slot-scope="scope">{{ scope.row.creditAmout - scope.row.usedAmout }}</template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">还款</el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>-->
          <!-- <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDisable(row)"
          >
            禁用
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
import { disable, fetchData, refund } from "@/api/credit";
import { parseTime, formatTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination";
import Refund from "./refund.vue";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "gray", "danger"];
      return statusMap[status];
    },
  },
  components: { Pagination, Refund },
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
      visible: false,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchData(this.listQuery).then((response) => {
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
      this.$prompt("请输入还款金额", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[1-9]\d*\.?\d*$/,
        inputErrorMessage: "金额格式不正确",
        inputValidator: function (o) {
          // console.log(row.usedAmout);
          if (o > row.usedAmout) {
            return "还款金额超过可还最大值";
          }
        },
        inputPlaceholder: "还款最大值" + row.usedAmout,
      }).then(({ value }) => {
        this.handleRefund(value, row.creditId);
      });
      // .catch(() => {
      //   this.$message({
      //     type: "info",
      //     message: "取消还款",
      //   });
      // });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleRefund(value, id) {
      var data = {
        refund_value: value,
        credit_id: id,
      };
      this.$prompt("请输入密码", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^\d*$/,
        inputErrorMessage: "密码格式不正确",
        inputValidator: function (o) {
          // console.log(row.usedAmout);
          if (o.length != 6) {
            return "密码长度为6位";
          }
        },
        // inputPlaceholder: "还款最大值" + row.usedAmout,
      }).then(({ value }) => {
        data["password"] = value;
        refund(data).then((resp) => {
          this.$message({
            type: "success",
            message: resp.message + "已还款" + data.refund_value + "元",
          });
          this.getList();
        });
      });
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
