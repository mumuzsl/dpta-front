<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
        v-model="listQuery.keyword"
        placeholder="关键字"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.option"
        placeholder="搜索条件"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>-->

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-circle-plus-outline"
        @click="onOpen"
      >添加商铺</el-button>

      <el-dialog
        :visible.sync="visible"
        v-bind="$attrs"
        v-on="$listeners"
        @open="onOpen"
        @close="onClose"
        title="添加商铺"
      >
        <el-row :gutter="20">
          <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="100px">
            <el-col :span="12">
              <el-form-item label="店铺名" prop="shopNm">
                <el-input
                  v-model="formData.shopNm"
                  placeholder="请输入店铺名"
                  :maxlength="20"
                  show-word-limit
                  clearable
                  prefix-icon="el-icon-mobile"
                  :style="{ width: '100%' }"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="下拉选择" prop="appId">
                <el-select
                  v-model="formData.appId"
                  placeholder="请选择下拉选择"
                  clearable
                  :style="{ width: '100%' }"
                >
                  <el-option
                    v-for="(item, index) in appIdOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-form>
        </el-row>
        <div slot="footer">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="handelConfirm">确定</el-button>
        </div>
      </el-dialog>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="ID" align="center" width="95">
        <template slot-scope="scope">{{ scope.row.shopId }}</template>
      </el-table-column>
      <el-table-column label="商铺名" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.shopNm }}</template>
      </el-table-column>
      <el-table-column label="分销商id" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.distrId }}</template>
      </el-table-column>
      <el-table-column label="应用id" width="150" align="center">
        <template slot-scope="scope">{{ scope.row.appId }}</template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="150" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.state | statusFilter">
            {{
            stateList[scope.row.state]
            }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="Actions" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">查看详情</el-button>
          <!-- <el-button v-if="row.status!='published'" size="mini" type="success" @click="handleModifyStatus(row,'published')">
            Publish
          </el-button>
          <el-button v-if="row.status!='draft'" size="mini" @click="handleModifyStatus(row,'draft')">
            Draft
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleModifyStatus(row,'deleted')">
            Delete
          </el-button>-->
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { fetchList, fetchApps, addShop } from "@/api/shop";
import { parseTime, formatTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive

export default {
  filters: {
    statusFilter(status) {
      const statusMap = ["success", "danger"];
      return statusMap[status];
    },
  },
  components: {},
  directives: { waves },
  data() {
    return {
      list: null,
      listLoading: true,
      stateList: ["启用", "禁用"],
      listQuery: {
        keyword: undefined,
        option: 0,
        page: 1,
      },
      visible: false,
      formData: {
        shopNm: "",
        appId: undefined,
      },
      rules: {
        shopNm: [
          {
            required: true,
            message: "请输入分销商名",
            trigger: "blur",
          },
        ],
        appId: [
          {
            required: true,
            message: "请选择下拉选择",
            trigger: "change",
          },
        ],
      },
      appIdOptions: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      fetchList(this.listQuery).then((response) => {
        console.log(response);
        this.list = response.data.records;
        this.total = response.data.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 0.3 * 1000);
      });
    },
    handleUpdate(row) {
      console.log(row);
      this.$router.push({ path: "/shop/comm", query: { uid: row.shopId } });
    },
    handleAdd() {
      this.addShopShow = true;
    },
    onOpen() {
      this.visible = true;
      this.fetchData();
    },
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
      this.visible = false;
    },
    handelConfirm() {
      this.$refs["elForm"].validate((valid) => {
        if (!valid) return;
        this.addData();
        this.close();
      });
    },
    fetchData() {
      fetchApps({}).then((resp) => {
        this.appIdOptions = resp.data;
        console.log(resp);
      });
    },
    addData() {
      var o = Object.assign({}, this.formData);
      this.listLoading = true;
      // console.log(o);
      addShop(o).then((resp) => {
        console.log(resp);
        this.$message({
          message: resp.message,
          type: "success",
        });

        this.close();
        this.getList();
      });
    },
  },
};
</script>

<style scoped>
.filter-container {
  /* padding: 10px; */
}

.filter-item {
  margin-bottom: 5px;
}
</style>
