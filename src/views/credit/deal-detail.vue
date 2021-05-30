<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <div>
          <el-col :span="4">
            <el-input
              v-model="uid"
              placeholder="输入订单id"
              class="filter-item"
              style="width: 200px"
              @keyup.enter.native="handleFilter"
            >
              <template #prepend>当前订单id</template>
            </el-input>
          </el-col>
        </div>
        <!-- <div v-if="order != null" class="spec">
          <el-col :span="4">
            <el-input :value="order.baseP" :disabled="true" style="width: 200px">
              <template #prepend>本金</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input :value="order.amount" :disabled="true" style="width: 200px">
              <template #prepend>总金额</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input :disabled="true" :value="order.profit" style="width: 200px">
              <template #prepend>分润</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input :disabled="true" :value="order.shop.shopNm" style="width: 200px">
              <template #prepend>商铺名</template>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-input :disabled="true" :value="order.datm" style="width: 200px">
              <template #prepend>时间</template>
            </el-input>
          </el-col>
        </div>-->
      </el-row>
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
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="商品名" align="center">
        <template slot-scope="scope">{{ scope.row.commId }}</template>
      </el-table-column>
      <el-table-column label="商品名" align="center">
        <template slot-scope="scope">{{ scope.row.dealId }}</template>
      </el-table-column>
      <!-- <el-table-column label="订单id" align="center">
        <template slot-scope="scope">
          {{ scope.row.orderId }}
        </template>
      </el-table-column>-->
      <el-table-column label="价格" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" align="center">
        <template slot-scope="scope">{{ scope.row.count }}</template>
      </el-table-column>
      <!-- <el-table-column label="sku" align="center">
        <template slot-scope="scope">
          <div v-for="(v, k, i) in JSON.parse(scope.row.sku.spec)" v-bind:key="k" class="spec">
            <span style="color: black">{{ k }}</span>
            <span style="margin: 5px">:</span>
            {{ v }}
          </div>
        </template>
      </el-table-column>-->
    </el-table>
  </div>
</template>

<script>
import { getDetail } from "@/api/credit";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "gray", "danger"];
      return statusMap[status];
    },
  },
  data() {
    return {
      list: null,
      listLoading: true,
      uid: 0,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        keyword: undefined,
        type: undefined,
        sort: "+id",
      },
      stateList: ["success", "gray", "danger"],
      order: null,
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
      // this.listQuery.page = 1;
      // this.getList();
      // this.fetchData();
      this.listLoading = true;
      if (this.uid !== 0) {
        getDetail(this.uid).then((response) => {
          this.list = response.data;
          // this.order = response.data;
          console.log(response);
          console.log(this.list);
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

.spec .el-col {
  margin: 5px;
  margin-left: 0px;
  margin-right: 0px;
}
</style>
