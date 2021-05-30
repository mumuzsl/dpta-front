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
import { getPersonNumber, getPersonTime } from "@/api/dashboard";

export default {
  data() {
    return {
      chart: null,
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
      this.chart.setOption(this.option);
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
    updateChart() {
      this.chart.setOption({
        title: {
          text: "平台收益图",
        },
        legend: {},
        tooltip: {},
        dataset: {
          dimensions: ["product", "2019", "2020", "2021"],
          source: [
            {
              product: "平台收益",
              2019: data[0],
              2020: data[1],
              2021: data[2],
            },
          ],
        },
        xAxis: { type: "category" },
        yAxis: {},
        series: [{ type: "bar" }, { type: "bar" }, { type: "bar" }],
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