<template>
  <div class="app-container">
    <el-row :gutter="15" style="margin-top:5px">
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-col :span="5">
          <el-form-item label="下拉选择" prop="year">
            <el-select
              v-model="formData.year"
              placeholder="选择年份"
              clearable
              :style="{width: '100%'}"
              @change="clearYear"
            >
              <el-option v-for="year in Object.keys(date)" :key="year" :label="year" :value="year"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="下拉选择" prop="month">
            <el-select
              v-model="formData.month"
              placeholder="请选择下拉选择"
              clearable
              :style="{width: '100%'}"
            >
              <el-option
                v-for="month in date[formData.year]"
                :key="month"
                :label="month"
                :value="month"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="5">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
          </el-form-item>
        </el-col>-->
      </el-form>
    </el-row>

    <el-button
      :loading="downloadLoading"
      style="margin:0 0 20px 20px;"
      type="primary"
      icon="el-icon-document"
      @click="handleDownload"
    >导出Excel</el-button>
  </div>
</template>

<script>
import { downloadExcel, getDate, getExcelUrl, getStatis } from "@/api/order";
import { baseUrl } from "@/utils/request";
import qs from "qs";

export default {
  data() {
    return {
      downloadLoading: false,
      formData: {
        year: undefined,
        month: undefined,
      },
      rules: {
        year: [
          {
            required: true,
            message: "请选择下拉选择",
            trigger: "change",
          },
        ],
        month: [
          {
            required: true,
            message: "请选择下拉选择",
            trigger: "change",
          },
        ],
      },
      yearOptions: [],
      monthOptions: {},
      date: {},
      curMonths: [],
      maxTime: { year: 0, month: 0 },
      minTime: {
        year: 0,
        month: 0,
      },
    };
  },
  created() {
    this.getData();
  },
  methods: {
    clearYear() {
      this.formData.month = "";
    },
    getData() {
      getDate({}).then((resp) => {
        this.date = resp.data;
        var a = Object.keys(this.date);
        console.log(a);
      });
    },
    getTimeRange(data) {
      var maxTimeStr = data.maxTime;
      var minTimeStr = data.minTime;

      this.maxTime = this.setTime(maxTimeStr);
      this.minTime = this.setTime(minTimeStr);
      this.build();
    },
    build() {
      var maxy = this.maxTime.year;
      var miny = this.minTime.year;
      if (maxy == miny) {
        this.yearOptions.push(
          this.buildYear(
            miny,
            this.subBuild(this.minTime.month, this.maxTime.month)
          )
        );
        return;
      }
      this.yearOptions.push(
        this.buildYear(miny, this.subBuild(this.minTime.month, 11))
      );
      for (let i = miny + 1; i <= maxy - 1; i++) {
        this.yearOptions.push(this.buildYear(i, this.subBuild(1, 11)));
      }
      this.yearOptions.push(
        this.buildYear(maxy, this.subBuild(0, this.maxTime.month))
      );
    },
    buildYear(year, month) {
      var o = {
        label: year + "年",
        value: year,
      };
      this.monthOptions[o.label] = month;
      return o;
    },
    subBuild(min, max) {
      var temp = [];
      for (let i = min; i <= max; i++) {
        temp.push({
          label: i + 1 + "月",
          value: i + 1,
        });
      }
      return temp;
    },
    setTime(str) {
      var time = new Date(str);
      return {
        year: time.getFullYear(),
        month: time.getMonth(),
      };
    },
    submitForm() {
      console.log(this.formData);
    },
    handleDownload() {
      var params = qs.stringify(this.formData, { indices: false });
      window.location.href = baseUrl() + "/distr/api/download/excel?" + params;
    },
  },
};
</script>