<template>
  <div class="app-container" v-if="id !== 1">
    <div class="info">
      <el-row>
        <span>当前正在处理的订单号: {{ order.orderId }}</span>
      </el-row>
      <el-row>
        <span>退款理由: {{ order.reason }}</span>
      </el-row>
    </div>
    <el-button @click="ok" type="success">同意退款</el-button>
    <el-divider content-position="left">不同意退款</el-divider>
    <el-form ref="elForm" :model="formData" :rules="rules" size="medium">
      <el-form-item label="原因" prop="reason1">
        <el-select
          v-model="formData.reason1"
          placeholder="请选择原因"
          clearable
          :style="{width: '100%'}"
        >
          <el-option
            v-for="(item, index) in reason1Options"
            :key="index"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原因" prop="reason2" v-if="formData.reason1==='其他'">
        <el-input
          v-model="formData.reason2"
          type="textarea"
          placeholder="请输入原因"
          :maxlength="50"
          :autosize="{minRows: 4, maxRows: 4}"
          :style="{width: '100%'}"
          show-word-limit
        ></el-input>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { refundReq, rejectReq } from "@/api/order";
export default {
  components: {},
  props: ["id"],
  data() {
    var validate = (rule, value, callback) => {
      if (value === undefined || value === "") {
        callback(new Error("请输入原因"));
      }
      callback();
    };
    return {
      formData: {
        reason1: undefined,
        reason2: undefined,
      },
      rules: {
        reason1: [
          {
            required: true,
            message: "请选择原因",
            trigger: "change",
          },
        ],
        reason2: [
          {
            validator: validate,
            trigger: "change",
          },
        ],
      },
      reason1Options: [
        {
          label: "",
          value: "未收到退货",
        },
        {
          label: "",
          value: "不符合退货条件",
        },
        {
          label: "",
          value: "其他",
        },
      ],
      order: {
        orderId: this.id,
        reason: "七天无理由退换",
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    console.log(this.id);
  },
  mounted() {},
  methods: {
    submitForm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        var o = {
          orderId: this.id,
          reason:
            this.formData.reason1 === "其他"
              ? this.formData.reason2
              : this.formData.reason1,
        };
        rejectReq(o).then((resp) => {
          this.$message({
            type: "success",
            message: resp.message,
          });
          this.close();
        });
      });
    },
    resetForm() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$router.go(-1);
    },
    setId() {
      this.id = this.$route.query.id;
    },
    ok() {
      this.$confirm("确定同意退款吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        center: true,
      }).then(() => {
        refundReq({ order_id: this.id }).then((resp) => {
          this.$message({
            type: "success",
            message: resp.message,
          });
          this.close();
        });
      });
    },
  },
};
</script>
<style>
.id {
  line-height: 50px;
  margin-bottom: 100px;
}

.info span {
  /* width: 100%; */
  /* border: 1px red solid; */
  /* display: inline; */
  line-height: 50px;
}
</style>
