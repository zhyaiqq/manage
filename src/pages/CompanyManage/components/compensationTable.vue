<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item label="姓名:" prop="username">
          <el-input
            v-model="formInline.username"
            placeholder="请输入姓名"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="补偿时间:" prop="time">
          <el-date-picker
            @change="search"
            v-model="formInline.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-btns">
      <el-button
        type="primary"
        @click="handle(1)"
        v-show="isHasAuth(186)"
        size="small"
        >新增补偿</el-button
      >
    </div>
    <el-table
      height="450"
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column fixed prop="name" label="被补偿人" />
      <el-table-column prop="money" label="补偿金额" />
      <el-table-column prop="company_name" label="补偿公司" />
      <el-table-column prop="remark" label="补偿原因" />
      <el-table-column prop="creat_at" label="补偿时间" />
      <el-table-column prop="company_money" label="补偿后公司余额" />
      <el-table-column prop="current_mony" label="当前余额" />
      <el-table-column prop="username" label="操作人员" />
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
    <el-dialog
      title="新增补偿金"
      :visible.sync="dialogVisible"
      width="50%"
      @closed="closeDialog()"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules"
        label-width="200px"
        :inline="true"
      >
        <el-form-item label="补偿公司:" prop="company_id">
          <el-select
            v-model="form.company_id"
            placeholder="请选择"
            @change="selectCompany"
            disabled
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in companyList"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="被补偿人:" prop="user_id">
          <el-select v-model="form.user_id" placeholder="请选择">
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in userList"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="退费以及补偿原因:" prop="remark">
          <el-input v-model="form.remark" />
        </el-form-item>
        <el-form-item label="补偿金额:" prop="money">
          <el-input v-model="form.money" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCutLog3, addCompensate } from "@/api/compensation.js";
import { getCompanyList } from "@/api/company.js";
import { getDispatchList } from "@/api/staff.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      formInline: {
        username: "",
        time: "",
      },
      form: {
        company_id: Number(this.companyId),
        user_id: "",
        remark: "",
        money: "",
      },
      rules: {
        company_id: {
          required: true,
          message: "请选择补偿公司",
          trigger: "change",
        },
        user_id: {
          required: true,
          message: "请选择被补偿人",
          trigger: "change",
        },
        remark: { required: true, message: "请输入原因", trigger: "change" },
        money: { required: true, message: "请输入补偿金额", trigger: "change" },
      },
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false,
      companyList: [],
      userList: [],
    };
  },
  props: ["companyId"],
  created() {
    this.getCompanyList();
    this.getCutLog3(1);
  },
  computed: {
    ...mapState("menu", ["defaultAuth"]),
  },
  methods: {
    handleSelectionChange() {},
    handleCurrentChange(page) {
      this.getCutLog3(page);
    },
    search() {
      this.getCutLog3(1);
    },
    handle(type) {
      switch (type) {
        case 1:
          this.selectCompany();
          this.dialogVisible = true;
          break;
      }
    },
    closeDialog() {
      this.form = this.$options.data().form;
      this.$refs.form.resetFields();
    },
    selectCompany() {
      this.getDispatchList(this.form.company_id);
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) this.addCompensate();
      });
    },
    // 补偿金列表
    getCutLog3(page) {
      let params = {
        username: this.formInline.username,
        company_id: this.companyId,
        start_creat_at: this.formInline.time ? this.formInline.time[0] : "",
        end_creat_at: this.formInline.time ? this.formInline.time[1] : "",
        page: page,
      };
      delete params.time;
      getCutLog3(params).then((res) => {
        if (res.code) {
          this.tableData = res.data;
          this.page = page;
          this.pageTotal = res.count;
        }
      });
    },
    // 获取公司列表
    getCompanyList() {
      getCompanyList({
        page: 1,
        page_num: 1000,
      }).then((res) => {
        if (res.code) this.companyList = res.data;
      });
    },
    // 获取派遣人员列表
    getDispatchList(company_id) {
      getDispatchList({
        company_id: company_id,
        page: 1,
        page_num: 1000,
      }).then((res) => {
        if (res.code) this.userList = res.data;
      });
    },
    // 新增补偿金
    addCompensate() {
      addCompensate(this.form).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getCutLog3(1);
          this.$message.success("新增成功");
        }
      });
    },
    isHasAuth(auth_id) {
      return (
        this.defaultAuth && this.defaultAuth.some((item) => item.id == auth_id)
      );
    },
  },
};
</script>

<style scoped>
</style>