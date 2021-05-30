<template>
  <el-card>
    <div slot="header">
      <span>近七日店铺访问人数和访问人次</span>
    </div>
    <div ref="chart" style="height:300px"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { getPerson, getPersonNumber, getPersonTime } from "@/api/dashboard";

export default {
  data() {
    return {
      chart: null,
      option: {
        xAxis: {
          type: "category",
          data: [],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [],
            type: "line",
          },
        ],
      },
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
    // this.fetchData();
    this.a();
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
      // this.chart.showLoading();
      // this.updateChart();
    },
    fetchData() {
      getPersonNumber().then((res) => {
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
        this.chart.hideLoading();
      });

      getPersonTime().then((res) => {
        // this.topList = res.data;
        var data = res.data;
        this.option.series.push({
          name: "近七日访问人次",
          data: data.ydata,
          type: "line",
        });
      });
    },
    updateChart() {
      this.chart.setOption(this.option);
    },
    a() {
      getPerson({}).then((resp) => {
        console.log(resp);
        this.source = resp.data;
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
          series: [
            { type: "line" },
            { type: "line" },
          ],
        };
        this.chart.setOption(option);
      });
    },
  },
};
</script>

<style>
</style>