<template>
  <div>
    <el-form-item label="收件人">
      <hideable :hide="info.receiverStr" :show="info.receiver" />
    </el-form-item>
    <el-form-item label="手机">
      <hideable :hide="info.phoneStr" :show="info.phone" />
    </el-form-item>
    <el-form-item label="收货地址">
      <hideable :hide="info.addressStr" :show="info.address" />
    </el-form-item>
  </div>
</template>

<script>
import Hideable from "./hideable";

export default {
  components: { Hideable },
  props: ["info"],
  data() {
    return {};
  },
};
</script>