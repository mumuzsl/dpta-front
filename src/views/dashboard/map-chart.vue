<template>
  <el-card>
    <div ref="chart" class="chart"></div>
  </el-card>
</template>

<script>
import * as echarts from "echarts/core";
import { GridComponent } from "echarts/components";
import { LineChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { getPersonNumber, getPersonTime, mapChart } from "@/api/dashboard";

export default {
  data() {
    return {
      chart: null,
    };
  },
  watch: {
    data: {
      handler(val, oldVal) {
        this.updateChart();
      },
      deep: true,
    },
  },
  created() {
    this.fetchData();
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
      this.updateChart([[]]);
    },
    fetchData() {
      mapChart({}).then((res) => {
        console.log(res);
        this.data = res.data;
        this.chartLoading = false;
      });
    },
    updateChart(data) {
      this.chart.hideLoading();
      this.chart.setOption({
        title: {
          text: "分销商走势图",
        },
        legend: {},
        tooltip: {
          trigger: "axis",
          showContent: false,
        },
        dataset: {
          source: [
            ["product", "2016", "2017", "2018", "2019", "2020", "2021"],
            [
              data[0][0],
              data[1][0],
              data[1][4],
              data[1][8],
              data[1][12],
              data[1][16],
              data[1][20],
            ],
            [
              data[0][1],
              data[1][1],
              data[1][5],
              data[1][9],
              data[1][13],
              data[1][17],
              data[1][21],
            ],
            [
              data[0][2],
              data[1][2],
              data[1][6],
              data[1][10],
              data[1][14],
              data[1][18],
              data[1][22],
            ],
            [
              data[0][3],
              data[1][3],
              data[1][7],
              data[1][11],
              data[1][15],
              data[1][19],
              data[1][23],
            ],
          ],
        },
        xAxis: { type: "category" },
        yAxis: { gridIndex: 0 },
        grid: { top: "20%" },
        series: [
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
          { type: "line", smooth: true, seriesLayoutBy: "row" },
        ],
      });
    },
  },
};
</script>

<style>
.chart {
  width: 100%;
  height: 250px;
}
</style>