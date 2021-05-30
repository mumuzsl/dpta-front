<template>
  <div class="app-container">
    <div class="filter-container">
      <el-row>
        <div>
          <el-col :span="4">
            <el-input
              v-model="inputId"
              placeholder="输入订单id"
              class="filter-item"
              style="width: 300px"
              @keyup.enter.native="handleFilter"
              disabled
            >
              <template #prepend>当前订单id</template>
            </el-input>
          </el-col>
        </div>
        <div v-if="order != null">
          <div class="spec">
            <!-- <el-col :span="4">
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
            </el-col>-->
          </div>
        </div>
      </el-row>
    </div>

    <div v-if="order != null">
      <el-steps :active="handleStep().length" align-center class="steps">
        <el-step v-for="(t,i) in handleStep()" :key="i" :title="t" class="step"></el-step>
        <!-- <el-step title="待发货" v-if="order.state===2"></el-step>
        <el-step title="退款中" v-if="order.state===3"></el-step>
        <el-step title="交易成功" v-if="order.state===4"></el-step>
        <el-step title="退款成功" v-if="order.state===-3"></el-step>
        <el-step title="订单关闭" v-if="order.state===-1||order.state===-2"></el-step>-->
      </el-steps>

      <el-form label-position="left" inline class="demo-table-expand">
        <el-form-item label="商品总价">
          <span>￥{{ order.amount }}</span>
        </el-form-item>
        <el-form-item label="运费">
          <span>￥{{ order.expressMoney }}</span>
        </el-form-item>
        <el-form-item label="店铺">
          <span>{{ order.shopNm }}</span>
        </el-form-item>
        <!-- <el-form-item label="收件人">
          <span>{{ order.receiverStr }}</span>
        </el-form-item>
        <el-form-item label="手机">
          <span>{{ order.phoneStr }}</span>
        </el-form-item>
        <el-form-item label="收货地址">
          <span>{{ order.addressStr }}</span>
        </el-form-item>-->
        <receive :info="order" />
        <el-form-item label="快递号" v-if="order.state>=2">
          <span>{{ order.expressNo }}</span>
        </el-form-item>
        <el-form-item label="创建时间">
          <span>{{ order.datm }}</span>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column label="商品图" align="center" width="95">
          <template slot-scope="scope">
            <el-image :src="scope.row.goodsCoverImg" lazy></el-image>
          </template>
        </el-table-column>
        <!-- <el-table-column label="ID" align="center" width="95">
          <template slot-scope="scope">{{ order.id }}</template>
        </el-table-column>-->
        <el-table-column label="商品名" align="center">
          <template slot-scope="scope">{{ scope.row.goodsName }}</template>
        </el-table-column>
        <!-- <el-table-column label="订单id" align="center">
        <template slot-scope="scope">
          {{ order.orderId }}
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
  </div>
</template>

<script>
import { getDetail, getList } from "@/api/table";
import Receive from "../receive.vue";

export default {
  components: { Receive },
  props: ["id"],
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "gray", "danger"];
      return statusMap[status];
    },
  },
  data() {
    return {
      steps: [
        ["待付款", "待发货", "退款中", "退款成功"],
        ["待付款", "超时关闭"],
        ["待付款", "手动关闭"],
        ["待付款"],
        ["待付款", "待发货"],
        ["待付款", "待发货", "已发货"],
        ["待付款", "待发货", "退款中"],
        ["待付款", "待发货", "已发货", "交易成功"],
      ],
      list: null,
      listLoading: true,
      inputId: "",
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
    if (this.id !== ":id") {
      this.inputId = this.id;
    }
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.handleFilter();
    },
    handleFilter() {
      this.listLoading = true;
      if (this.inputId !== "") {
        getDetail(this.inputId).then((response) => {
          response.data;
          this.list = response.data.details;
          this.order = response.data;
          console.log(response);
          this.listLoading = false;
        });
      } else {
        this.listLoading = false;
      }
    },
    handleStep() {
      var state = this.order.state;
      return this.steps[state + 3];
    },
  },
};
</script>

<style>
.steps {
  margin-top: 20px;
  margin-bottom: 20px;
  /* min-width: auto;
  border: 1px red solid;
  text-align: center;
  align-items: center; */
}

.filter-item {
  margin: 5px;
}

.spec .el-col {
  margin: 5px;
  margin-left: 0px;
  margin-right: 0px;
}

.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
