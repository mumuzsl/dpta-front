<template>
  <el-card>
    <div slot="header">
      <span>最近七日订单数量统计</span>
    </div>
    <div ref="chart" class="chart" style="height:300px"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { getNear, getPersonNumber, getPersonTime } from "@/api/dashboard";

export default {
  data() {
    return {
      chart: null,
      source: null,
    };
  },
  watch: {
    option: {
      handler(val, oldVal) {
        this.updateChart();
      },
      deep: true,
    },
  },
  created() {
    this.a();
    // this.fetchData();
    this.$nextTick(function () {
      // DOM 现在更新了
      // `this` 绑定到当前实例
      this.draw();
    });
  },
  methods: {
    draw() {
      echarts.use([GridComponent, LineChart, CanvasRenderer]);
      this.chart = echarts.init(this.$refs.chart);
    },
    fetchData() {
      getPersonNumber().then((res) => {
        console.log(res);
        var data = res.data;
        this.option.xAxis = {
          type: "category",
          data: data.xdata,
        };
        this.option.series.push({
          name: "近七日访问人数",
          data: data.ydata,
          type: "line",
        });
      });
    },
    a() {
      getNear({}).then((resp) => {
        console.log(resp);
        this.source = resp.data;
        var series = [];
        for (var i = 0; i < this.source[0].length - 1; i++) {
          series.push({ type: "line" });
        }
        var option = {
          legend: {},
          tooltip: {},
          dataset: {
            // 提供一份数据。
            source: resp.data,
          },
          // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
          xAxis: { type: "category" },
          // 声明一个 Y 轴，数值轴。
          yAxis: {},
          // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
          series: series,
        };
        this.chart.setOption(option);
      });
    },
  },
};
</script>

<style>
.chart {
  width: 100%;
  height: 100%;
  /* min-height: 500px;
  border: 1px red solid; */
}

.card {
  align-items: center;
}
</style>