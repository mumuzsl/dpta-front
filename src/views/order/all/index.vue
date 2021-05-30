<template>
  <div class="app-container">
    <div class="filter-container" v-if="listQuery.state===null">
      <el-input
        v-model="listQuery.keyword"
        placeholder="输入订单号/商品名/手机号/收件人/商铺名"
        style="width: 300px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <!-- <el-select
        v-model="listQuery.option"
        placeholder="搜索条件"
        clearable
        style="width: 110px"
        class="filter-item"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>-->

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >搜索</el-button>
      <!-- <el-button
        :loading="downloadLoading"
        style="margin:0 0 20px 5px;"
        type="primary"
        icon="el-icon-document"
        @click="handleDownload"
      >导出Excel</el-button>-->
    </div>
    <el-radio-group
      v-model="listQuery.states"
      class="radio"
      v-if="listQuery.states!=null"
      style="margin-bottom:20px"
      @change="handleRedio"
    >
      <el-radio :label="cv.all">全部</el-radio>
      <el-radio :label="cv.c1">顾客关闭</el-radio>
      <el-radio :label="cv.c2">自动关闭</el-radio>
      <el-radio :label="cv.c3">卖家关闭</el-radio>
    </el-radio-group>
    <el-table
      v-loading="listLoading"
      :data="list"
      style="width: 100%"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @row-click="handleDetail"
      ref="table"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="店铺">
              <span>{{ scope.row.shopNm }}</span>
            </el-form-item>
            <el-form-item label="收件人">
              <span>{{ scope.row.receiverStr }}</span>
            </el-form-item>
            <el-form-item label="手机">
              <span>{{ scope.row.phoneStr }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ scope.row.addressStr }}</span>
            </el-form-item>
          </el-form>
          <div class="table-expand" v-for="(d,i) in scope.row.details" :key="i">
            <!-- <el-card style="font-size: 5px;"> -->
            <el-row :gutter="12" style="font-size: 5px;">
              <el-col :span="3">
                <a :href="goodsUrl()+d.commId">
                  <el-image :src="d.goodsCoverImg" lazy></el-image>
                </a>
              </el-col>
              <el-col :span="6" class="col">
                <a :href="goodsUrl()+d.commId">
                  <el-row>
                    <span>{{ d.goodsName }}</span>
                  </el-row>
                  <el-row>
                    <span>数量X{{ d.count }}</span>
                  </el-row>
                  <el-row>
                    <span>价格￥{{ d.price }}</span>
                  </el-row>
                </a>
              </el-col>
            </el-row>
            <!-- </el-card> -->
            <!-- <div v-html="d.goods.goodsDetailContent"></div> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column label="订单号" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="商铺id" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.shopId }}</template>
      </el-table-column>
      <el-table-column label="商铺名" width="100" align="center">
        <template slot-scope="scope">{{ scope.row.shopNm }}</template>
      </el-table-column>
      <el-table-column label="金额" width="110" align="center">
        <template slot-scope="scope">
          <span>￥{{ scope.row.amount }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="分润" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.profit }}</span>
        </template>
      </el-table-column>-->
      <!-- <el-table-column label="本金" width="110" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.baseP }}</span>
        </template>
      </el-table-column>-->
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <!-- <el-tag :type="scope.row.state | statusFilter">{{ scope.row.stateStr }}</el-tag> -->
          <span>{{ scope.row.stateStr }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.datm }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column align="center" prop="created_at" label="核销时间" width="300">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.verifyTm }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="Actions" align class-name="fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" class="action" size="mini" @click="handleUpdate(row)">查看详情</el-button>
          <el-button
            v-if="row.state<0||row.state===4"
            size="mini"
            type="danger"
            class="action"
            @click="handleDelete(row)"
          >删除</el-button>
          <el-button
            v-if="row.state===1"
            class="action"
            type="primary"
            size="mini"
            @click="handleSend(row)"
          >发货</el-button>
          <el-button
            v-if="row.state===3"
            class="action"
            type="warning"
            size="mini"
            @click="handleRefund(row)"
          >处理退款</el-button>
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
import { parseTime, formatTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination";
import { deleteReq, getComm, refundReq, sendReq } from "@/api/order";

export default {
  filters: {
    statusFilter(status) {
      const statusMap = { 未付款: "success" };
      return statusMap[status];
      // return "";
    },
  },
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      radio: 0,
      downloadLoading: false,
      list: null,
      listLoading: true,
      stateList: [
        { value: null, label: "全部" },
        {
          value: -3,
          label: "超时关闭",
        },
        {
          value: -2,
          label: "手动关闭",
        },
        {
          value: -1,
          label: "商家关闭",
        },
        {
          value: 0,
          label: "待付款",
        },
        { value: 1, label: "待发货" },
        { value: 2, label: "待收货" },
        { value: 3, label: "已发货" },
        { value: 4, label: "已成功" },
      ],
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
        // {
        //   value: 2,
        //   label: "状态",
        // },
      ],
      listQuery: {
        keyword: undefined,
        state: null,
        states: null,
        page: 1,
        size: 10,
      },
      cv: {
        all: [-1, -2, -3],
        c1: [-1],
        c2: [-2],
        c3: [-3],
      },
    };
  },
  created() {
    this.updateState();
    this.getList();
  },
  methods: {
    updateState() {
      var state = this.$route.params.state;
      // var state = this.$route.query.state;
      console.log("state", state);
      if (state !== ":state") {
        if (state < 0) {
          this.listQuery.states = this.cv.all;
        }
        this.listQuery.state = state;
      }
    },
    handleRedio() {
      console.log(this.listQuery.states);
      this.handleFilter();
    },
    getList() {
      this.listLoading = true;
      console.log(this.listQuery);
      fetchList(this.listQuery).then((response) => {
        console.log(response);
        this.total = response.data.total;
        this.list = response.data.records;
        this.list.forEach((item) => {
          item.details.forEach((d) => {
            var id = d.commId;
            getComm(id, {}).then((resp) => {
              d.goods = resp.data;
              setTimeout(() => {
                this.$refs.table.toggleRowExpansion(item, true);
              }, 100);
            });
          });
        });

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.3 * 1000);
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.$router.push({ path: "/order/detail/" + row.id });
    },
    orderId(id) {
      return {
        order_id: id,
      };
    },
    msg(resp) {
      this.$message({
        message: resp.message,
        type: "success",
      });
      this.getList();
    },
    handleDelete(row) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      })
        .then(() => {
          deleteReq(this.orderId(row.id)).then((resp) => {
            this.msg(resp);
          });
        })
    },
    handleSend(row) {
      this.$prompt("请输入快递单号", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(({ value }) => {
        var o = {
          id: row.id,
          expressNo: value,
        };
        sendReq(o).then((resp) => {
          this.msg(resp);
        });
      });
    },
    handleRefund(row) {
      this.$router.push({ path: "/order/refund/" + row.id });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleStateSelect() {
      console.log("select");
      this.handleFilter();
    },
    handleDownload() {
      this.$router.push({ path: "/order/excel" });
    },
    handleDetail(o) {
      console.log(o);
      this.$refs.table.toggleRowExpansion(o, true);
    },
    goodsUrl() {
      return "http://localhost:8080/goods/detail/";
    },
  },
};
</script>

<style>
.filter-container {
  /* padding: 10px; */
}

.filter-item {
  margin: 5px;
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

.table-expand {
  /* border: 1px solid red; */
  /* border-top: 1px solid #99a9bf; */
  /* border-bottom: 0.1px solid #99a9bf; */
  /* margin: 3px; */
  /* padding: 3px; */
  /* display: inline; */
}

.table-expand img {
  width: 50px;
  height: 50px;
}

.table-expand span {
  text-align: center;
  /* margin-left: 100px; */
}

.radio {
  margin-left: 10px;
}

.action {
  /* border: 1px red solid; */
  /* background: #99a9bf; */
  width: 80px;
}

.col .el-row {
  /* display: inline; */
  /* border: 1px red solid; */
  /* margin: 10px; */
  margin-bottom: 3px;
  /* display: inline-block; */
}
</style>
