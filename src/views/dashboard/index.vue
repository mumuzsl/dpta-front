<template>
  <div class="dashboard-container">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->

    <el-row :gutter="24" v-loading="statisLoading" class="top-row">
      <!-- <el-col :span="8">
        <el-card>
          <el-row>
            <el-col :span="15">
              <div class="top-panel-header top-panel-right">已核销可用提现收入</div>
              <div class="top-panel-number top-panel-right">{{ statis.verified }}</div>
            </el-col>
            <el-col :span="8">
              <div class="top-panel-header">今日</div>
              <div class="top-panel-number">{{ statis.today_verified }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>-->
      <el-col :span="12">
        <el-card>
          <el-row>
            <el-col :span="15">
              <div class="top-panel-header top-panel-right">已支付订单数</div>
              <div class="top-panel-number top-panel-right">{{ orderStatis.count }}</div>
            </el-col>
            <el-col :span="8">
              <div class="top-panel-header">今日</div>
              <div class="top-panel-number">{{ todayOrderStatis.count }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <el-row>
            <el-col :span="15">
              <div class="top-panel-header top-panel-right">总收入金额</div>
              <div class="top-panel-number top-panel-right">￥{{ orderStatis.sum }}</div>
            </el-col>
            <el-col :span="8">
              <div class="top-panel-header">今日</div>
              <div class="top-panel-number">￥{{ todayOrderStatis.sum }}</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <!-- <el-col :span="8">
        <el-card class="top-panel">
          <template #header>
            <div>今日</div>
          </template>
          <div class="today-panel">
            <el-row class="today-panel-item">
              <el-col :span="3" class="today-panel-left">总收入</el-col>
              <el-col :span="3">{{ statis.today_verified }}</el-col>
            </el-row>
            <el-row class="today-panel-item">
              <el-col :span="3" class="today-panel-left">总收入已核销收入</el-col>
              <el-col :span="3">{{ statis.today_verify }}</el-col>
            </el-row>
            <el-row class="today-panel-item">
              <el-col :span="3" class="today-panel-left">总收入未核销收入</el-col>
              <el-col :span="3">{{ statis.today_amount }}</el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>-->
    </el-row>

    <el-row class="chart-row" :gutter="24">
      <el-col :span="12">
        <person-chart />
      </el-col>
      <el-col :span="12">
        <records-chart />
      </el-col>
    </el-row>

    <el-row class="chart-row" :gutter="24">
      <el-col :span="12">
        <!-- <dataset-chart /> -->
      </el-col>
      <el-col :span="12">
        <!-- <map-chart /> -->
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-card id="top">
          <div slot="header" class="clearfix">
            <span>商品收入排行榜</span>
          </div>
          <el-table :data="topList">
            <!-- <el-table-column label="商品id" align="center">
              <template slot-scope="scope">{{ scope.row.commId }}</template>
            </el-table-column>
            <el-table-column label="商品名" align="center">
              <template slot-scope="scope">{{ scope.row.commName }}</template>
            </el-table-column>-->
            <el-table-column label="商品id" align="center">
              <template slot-scope="scope">{{ scope.row.commId }}</template>
            </el-table-column>
            <el-table-column label="商品图" align="center" width="95">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.goodsVo.goodsCoverImg"
                  lazy
                  style="width: 50px;height: 50px;"
                ></el-image>
              </template>
            </el-table-column>
            <el-table-column label="最高价格" align="center">
              <template slot-scope="scope">￥{{ scope.row.maxPrice }}</template>
            </el-table-column>
            <el-table-column label="最低价格" align="center">
              <template slot-scope="scope">￥{{ scope.row.minPrice }}</template>
            </el-table-column>
            <el-table-column label="价格平均值" align="center">
              <template slot-scope="scope">￥{{ scope.row.avgPrice }}</template>
            </el-table-column>
            <el-table-column label="销售额" align="center">
              <template slot-scope="scope">￥{{ scope.row.amount }}</template>
            </el-table-column>
            <el-table-column label="数量" align="center">
              <template slot-scope="scope">{{ scope.row.count }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getPersonNumber, getPersonTime, getTopList } from "@/api/dashboard";
import PersonChart from "./person-chart.vue";
import RecordsChart from "./records-chart.vue";
import DatasetChart from "./dataset-chart.vue";
import MapChart from "./map-chart.vue";
import { getStatis } from "@/api/order";
import { formatTime, parseTime } from "@/utils";
import { poll } from "@/api/global";

export default {
  components: { PersonChart, RecordsChart, DatasetChart, MapChart },
  name: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
  data() {
    return {
      statis: {
        amount: 0,
        today_amount: 0,
        today_verified: 0,
        today_verify: 0,
        verified: 0,
        verify: 0,
      },
      orderStatis: {
        count: 0,
        sum: 0,
      },
      todayOrderStatis: {
        count: 0,
        sum: 0,
      },
      topList: null,
      xdata: [],
      ydata: [],
      statisLoading: false,
    };
  },
  created() {
    var path = this.$route.query.path;
    console.log(path);
    this.fetchData();
    this.$nextTick(function () {
      // DOM 现在更新了
      // `this` 绑定到当前实例
      this.draw();
    });
    poll(() => {
      this.fetchData();
    });
  },
  watch: {
    // formData: {
    //   handler(val, oldVal) {
    //     // this.updateChart();
    //     this.curMonths = this.monthOptions[this.year]
    //   },
    //   deep: true,
    // },
  },
  methods: {
    draw() {},
    fetchData() {
      var s = new Date();
      var start = s.toLocaleDateString();
      s = s.setDate(s.getDate() + 1);
      var e = new Date(s);
      // console.log(start, e.toLocaleDateString());
      getStatis({
        start: start,
        end: e.toLocaleDateString(),
        statis_payed: true,
      }).then((res) => {
        var data = res.data[0];
        this.statisLoading = false;

        this.todayOrderStatis = Object.assign(this.todayOrderStatis, data);
      });

      getStatis({ statis_payed: true }).then((res) => {
        var data = res.data[0];
        this.statisLoading = false;

        this.orderStatis = Object.assign(this.orderStatis, data);
      });

      getTopList({}).then((res) => {
        this.topList = res.data;
        this.topLoading = false;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.chart-row {
  margin-top: 10px;
}

.top-row {
  // border: 5px solid red;
  // min-height: 20%;
  // height: 10px;
}

#top {
  text-align: center;
  padding-left: 100px;
  padding-right: 100px;
}

.top-panel-item {
}

.top-panel {
  border: 1px solid #eceff9;
  border-radius: 5px;
  text-align: center;
}

.top-panel-header {
  text-align: center;
  border-bottom: 3px solid #eceff9;
  padding-bottom: 10px;
}
.top-panel-number {
  font-size: 30px;
  text-align: center;
}

.top-panel-right {
  border-right: 3px solid #eceff9;
}

.chart {
  width: 100%;
  height: 300px;
}
</style>
