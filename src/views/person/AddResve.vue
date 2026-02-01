<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      @open="onOpen"
      @close="onClose"
      :title="title"
      class="dialog"
    >
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
        <el-form-item label-width="0" prop="payValue">
          <el-input
            v-model="formData.payValue"
            :placeholder="'请输入金额'+(limit===undefined?'':'最多'+limit)"
            clearable
            :style="{width: '100%'}"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
      <div id="pay" class="box">
        <!-- jhkjhklh
        <form
          name="punchout_form"
          method="post"
          action="https://openapi.alipaydev.com/gateway.do?app_cert_sn=ad1e435d6ac3fd9cb9c862cd88003228&charset=UTF-8&alipay_root_cert_sn=687b59193f3f462dd5336e5abf83c5d8_02941eef3187dddf3d3b83462e1dfcf6&method=alipay.trade.page.pay&sign=TJjFQqkvIW%2FxFeSdEkKtA%2FMe2XtJHfHfv0%2BfWUwViuz4QIsxfiL8YLJqMpveqdbovyDXqD3tW%2BqxK%2BmAJCxzkVQlMLVKWhwcv%2F%2F3VDf0x4fjLEwaNYJxZL7BSibJ%2BPIpMKH1uPGenDgyRGFNthLy0D0mPqE%2FP2Pf4XxMBzsZ1WmmLLOQdIDilpYMJ7Sj%2FYtxdamk4FoVDUTtcaqDASFSuQHSrG%2F%2FShLgAYlohNWreo8giWBxlipk4cU2%2BmcGupbvMWH4ZgJnV3VQn8u18ZsLAWuxUrOGqDG2XfP4tc0c8h68Tfd10dui9T479JSnXFrDG2q5DWQy%2BjbpBR5ybKkSHg%3D%3D&return_url=http%3A%2F%2Flocalhost%3A9528%2Fdistr%2F%23%2Fperson%2Fresve&version=1.0&app_id=2021000117634821&sign_type=RSA2&timestamp=2021-05-07+11%3A14%3A16&alipay_sdk=alipay-sdk-java-dynamicVersionNo&format=json"
        >
          <input
            type="hidden"
            name="biz_content"
            value="{&quot;out_trade_no&quot;:&quot;1390505233469145088&quot;,&quot;total_amount&quot;:&quot;8&quot;,&quot;subject&quot;:&quot;充值预备金&quot;,&quot;body&quot;:&quot;1002&quot;,&quot;product_code&quot;:&quot;FAST_INSTANT_TRADE_PAY&quot;}"
          />
          <input type="submit" value="立即支付" style="display:none" />
        </form>-->
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { addResve } from "@/api/person";
import { getToken } from "@/utils/auth";
export default {
  inheritAttrs: false,
  props: ["limit", "title"],
  components: {},
  data() {
    return {
      visible: true,
      html: "<h1>erweima</h1>",
      formData: {
        payValue: undefined,
      },
      rules: {
        payValue: [
          {
            required: true,
            message: "请输入金额",
            trigger: "blur",
          },
          {
            pattern: /^[1-9]\d*\.?\d*$/,
            message: "请输入数字",
            trigger: "blur",
          },
        ],
      },
    };
  },
  computed: {},
  watch: {
    formData: {
      //深度监听，可监听到对象、数组的变化
      handler(val, oldVal) {
        console.log(typeof val.payValue);
        var ov = parseFloat(oldVal.payValue);
        var nv = parseFloat(val.payValue);
        var limit = parseFloat(this.limit);
        if (nv > limit) {
          this.formData.payValue = limit;
        }
      },
      deep: true, //true 深度监听
    },
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) {
          return;
        }
        var o = {
          pay_value: this.formData.payValue,
          // return_url: window.location.href,
        };
        window.location.href =
          "http://localhost:8081/api/dpta/distr/api/alipay/pay?url=http://localhost:9529/distr/&subPath=/person/resve&amount=" +
          this.formData.payValue +
          "&token=" +
          getToken();
        // addResve(o).then((resp) => {
        //   console.log(resp);
        //   this.$msgbox({
        //     title: "消息",
        //     message: resp.message,
        //     type: "success",
        //     showConfirmButton: false,
        //   });
        // });
        // this.close();
      });
    },
  },
};
</script>
<style>
.dialog {
}

.box > form {
  background: rgba(0, 0, 0, 0);
  width: 100%;
  height: 500px;
  border: 1px red solid;
}
</style>
