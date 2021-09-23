<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline">
        <el-form-item label="操作人员：">
          <el-select
            v-model="formInline.user_id"
            placeholder="请选择操作人员"
            @change="search"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              :label="item.username"
              :value="item.id"
              v-for="(item, index) in userList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="操作日期：" prop="time">
          <el-date-picker
            @change="search"
            v-model="formInline.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      height="600"
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed width="120px" prop="id" label="编号">
      </el-table-column>
      <el-table-column fixed prop="username" label="操作者"> </el-table-column>
      <el-table-column prop="create_at" label="操作日期"> </el-table-column>
      <el-table-column prop="geoip" label="IP地址"> </el-table-column>
      <el-table-column prop="content" label="操作记录"> </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="pageTotal"
      layout="total, prev, pager, next, jumper"
      background
    >
    </el-pagination>
  </div>
</template>

<script>
import { getLog } from "@/api/system.js";
import { getUserList } from "@/api/role.js";
export default {
  data() {
    return {
      formInline: {
        user_id: "",
        time: "",
      },
      userList: [],
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      form: {
        company: "",
        money: "",
      },
      pageTotal: 0,
      pageSize: 10,
      page: 1,
    };
  },
  created() {
    this.getUserList();
    this.getLog(1);
  },
  methods: {
    handleSelectionChange() {},
    handleCurrentChange(page) {
      this.getLog(page);
    },
    search() {
      this.getLog(1);
    },
    // 获取操作日志
    getLog(page) {
      getLog({
        user_id: this.formInline.user_id,
        start_date: this.formInline.time ? this.formInline.time[0] : "",
        end_date: this.formInline.time ? this.formInline.time[1] : "",
        page: page,
      }).then((res) => {
        if (res.code) {
          this.tableData = res.data;
          this.pageTotal = res.count;
          this.page = page;
        }
      });
    },
    // 获取用户列表
    getUserList() {
      getUserList({
        page: 1,
        page_num: 1000,
      }).then((res) => {
        if (res.code) {
          this.userList = res.data;
        }
      });
    },
  },
};
</script>

<style scoped>
</style>