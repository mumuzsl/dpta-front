<template>
  <div class="app-container">
    <el-row :gutter="15" v-loading="loading">
      <el-form
        ref="elForm"
        :model="formData"
        :rules="rules"
        size="medium"
        label-width="100px"
      >
        <el-col :span="12">
          <el-form-item label="名称" prop="distrNm">
            <el-input
              v-model="formData.distrNm"
              placeholder="请输入分销商名"
              :disabled="true"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="分销商ID" prop="distrId">
            <el-input
              v-model="formData.distrId"
              placeholder="请输入分销商id"
              :disabled="true"
              clearable
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="电话号码" prop="phone">
            <el-input
              v-model="formData.phone"
              placeholder="请输入分销商名电话号码"
              :maxlength="20"
              show-word-limit
              :disabled="true"
              clearable
              prefix-icon="el-icon-mobile"
              :style="{ width: '100%' }"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="等级" prop="levelId">
            <el-select
              v-model="formData.levelId"
              placeholder="请选择等级规则id"
              :disabled="true"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in levelIdOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="state">
            <el-select
              v-model="formData.state"
              placeholder="请选择状态"
              :disabled="true"
              clearable
              :style="{ width: '100%' }"
            >
              <el-option
                v-for="(item, index) in stateOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
                :disabled="item.disabled"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <!-- <el-col :span="24">
          <el-form-item size="large">
            <el-button type="primary" @click="submitForm">提交</el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-col> -->
      </el-form>
    </el-row>
  </div>
</template>
<script>
import { getDetail, getLevelIdOptions } from "@/api/person";
export default {
  components: {},
  props: [],
  data() {
    return {
      loading: false,
      formData: {
        distrNm: undefined,
        distrId: undefined,
        phone: "",
        levelId: undefined,
        state: undefined,
      },
      rules: {
        distrNm: [
          {
            required: true,
            message: "请输入分销商名",
            trigger: "blur",
          },
        ],
        distrId: [
          {
            required: true,
            message: "请输入分销商id",
            trigger: "blur",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入分销商名电话号码",
            trigger: "blur",
          },
        ],
        levelId: [
          {
            required: true,
            message: "请选择等级规则id",
            trigger: "change",
          },
        ],
        state: [
          {
            required: true,
            message: "请选择状态",
            trigger: "change",
          },
        ],
      },
      levelIdOptions: [],
      stateOptions: [
        { value: 1, label: "启用" },
        { value: 0, label: "禁用" },
      ],
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getDetail();
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        // TODO 提交表单
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    getDetail() {
      this.loading = true;
      getDetail({}).then((resp) => {
        console.log(resp);
        this.formData = resp.data;
        // this.loading = false;
      });

      getLevelIdOptions({}).then((resp) => {
        console.log(resp);
        this.levelIdOptions = resp.data;
        this.loading = false;
      });
    },
  },
};
</script>
<style>
</style>
