<template>
  <div class="todo">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item label="状态:" prop="aready">
          <el-select
            v-model="formInline.aready"
            placeholder="全部待办"
            @change="search"
          >
            <el-option label="全部待办" value=""></el-option>
            <el-option label="待处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
            <el-option label="暂缓" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名:" prop="username">
          <el-input
            v-model="formInline.username"
            placeholder="请输入用户名"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select
            v-model="formInline.type"
            placeholder="全部"
            @change="search"
          >
            <el-option label="全部" value=""></el-option>
            <el-option
              :label="item"
              :value="index + 1"
              v-for="(item, index) in typeList"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间:" prop="time">
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
    >
      <el-table-column fixed prop="name_string" label="任务名称" />
      <el-table-column prop="is_deal" label="状态">
        <template slot-scope="scope">
          <span
            v-show="scope.row && scope.row.is_deal == 0"
            style="color: #3bb19c"
            >待处理</span
          >
          <span
            v-show="scope.row && scope.row.is_deal == 1"
            style="color: #409eff"
            >已处理</span
          >
          <span
            v-show="scope.row && scope.row.is_deal == 2"
            style="color: #3bb19c"
            >暂缓</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型">
        <template slot-scope="scope">
          {{ typeList[scope.row.type - 1] }}
        </template>
      </el-table-column>
      <el-table-column prop="username" label="操作人员" />
      <el-table-column prop="creat_time" label="创建时间" />
      <el-table-column prop="deal_time" label="处理时间" />
      <el-table-column prop="handle" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(0, scope.row)">详情</el-button>
          <el-button
            type="text"
            @click="handle(1, scope.row)"
            v-show="scope.row && scope.row.is_deal == 0"
            >处理</el-button
          >
          <el-button
            type="text"
            @click="handle(2, scope.row)"
            v-show="scope.row && scope.row.is_ready == 2"
            >已读</el-button
          >
        </template>
      </el-table-column>
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
    <el-dialog title="待办事处理" :visible.sync="dialogVisible" width="40%">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="任务名称:" prop="id">
          {{ this.currentRow && this.currentRow.name }}
        </el-form-item>
        <el-form-item
          label="处理结果:"
          prop="type"
          v-if="currentRow && [1].indexOf(currentRow.type) > -1"
        >
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="续期" :value="1" />
            <el-option label="直接结束" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="处理结果:"
          prop="type"
          v-if="currentRow && [2, 3, 4, 5, 6].indexOf(currentRow.type) > -1"
        >
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="已完成" :value="3" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="处理结果:"
          prop="type"
          v-if="
            currentRow && [7, 8, 9, 10, 11, 12].indexOf(currentRow.type) > -1
          "
        >
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="已完成" :value="3" />
            <el-option label="暂缓" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="合同开始时间:"
          prop="contract_start_time"
          v-if="this.form.type == 1"
        >
          <el-date-picker
            v-model="form.contract_start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="合同结束时间:"
          prop="contract_end_time"
          v-if="this.form.type == 1"
        >
          <el-date-picker
            v-model="form.contract_end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注:" prop="remark" v-if="this.form.type == 4">
          <el-input type="textarea" v-model="form.remark" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="员工详细信息"
      :visible.sync="dialogVisible2"
      width="70%"
      @closed="closeDialog(0)"
    >
      <div class="mb40">员工基础信息</div>
      <el-form
        :model="form3"
        ref="form3"
        label-width="200px"
        :inline="true"
        :validate-on-rule-change="false"
        class="dialog_detail"
      >
        <el-form-item label="姓名:" prop="name">
          {{ this.staffInfo && this.staffInfo.name }}
        </el-form-item>
        <el-form-item label="家庭地址:" prop="address">
          {{ this.staffInfo && this.staffInfo.address }}
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          {{ this.staffInfo && this.staffInfo.sex_string }}
        </el-form-item>
        <el-form-item label="选择身份:" prop="current_type">
          {{ this.staffInfo && this.staffInfo.current_name }}
        </el-form-item>
        <el-form-item label="出生日期:" prop="age">
          {{ this.staffInfo && this.staffInfo.age }}
        </el-form-item>
        <el-form-item label="身份证号码:" prop="card_id">
          {{ this.staffInfo && this.staffInfo.card_id }}
        </el-form-item>
        <el-form-item label="入职日期:" prop="entry_time">
          {{ this.staffInfo && this.staffInfo.entry_time }}
        </el-form-item>
        <el-form-item label="岗位状态:" prop="entry_status">
          {{ this.staffInfo && this.staffInfo.entry_status_string }}
        </el-form-item>
      </el-form>
      <div class="mb40">员工社保信息</div>
      <el-form
        :model="form4"
        ref="form4"
        label-width="200px"
        :inline="true"
        class="dialog_detail"
      >
        <el-form-item label="五险基数金额:" prop="resume">
          {{ this.proportionInfo && this.proportionInfo.base }}
        </el-form-item>
        <el-form-item label="养老（公司）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.company_pension }}
        </el-form-item>
        <el-form-item label="养老（个人）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.person_pension }}
        </el-form-item>
        <el-form-item label="公积金（公司）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.company_accumulation }}
        </el-form-item>
        <el-form-item label="公积金（个人）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.person_accumulation }}
        </el-form-item>
        <el-form-item label="失业（公司）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.company_unemployment }}
        </el-form-item>
        <el-form-item label="失业（个人）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.person_unemployment }}
        </el-form-item>
        <el-form-item label="医疗（公司）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.company_medical }}
        </el-form-item>
        <el-form-item label="医疗（个人）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.person_medical }}
        </el-form-item>
        <el-form-item label="工伤（公司）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.company_injury }}
        </el-form-item>
        <el-form-item label="工伤（个人）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.person_injury }}
        </el-form-item>
        <el-form-item label="生育（公司）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.company_birth }}
        </el-form-item>
        <el-form-item label="生育（个人）:" prop="contract">
          {{ this.proportionInfo && this.proportionInfo.person_birth }}
        </el-form-item>
        <el-form-item label="基本薪资:" prop="contract">
          {{ this.salaryInfo && this.salaryInfo.salary }}
        </el-form-item>
        <el-form-item label="绩效薪资:" prop="contract">
          {{ this.salaryInfo && this.salaryInfo.achievements }}
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible2 = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getExpire, dealExpire, dealRead } from "@/api/todo.js";
import { getStaffDetail } from "@/api/staff.js";
import { mapActions } from "vuex";
import bus from "@/utils/bus.js";
export default {
  data() {
    return {
      formInline: {
        aready: "",
        username: "",
        type: "",
        time: "",
      },
      form: {
        id: "",
        type: 2,
        contract_start_time: "",
        contract_end_time: "",
        remark: "",
      },
      rules: {
        id: { required: true, message: "任务名称不能为空", trigger: "change" },
        type: { required: true, message: "请选择处理结果", trigger: "change" },
        contract_start_time: {
          required: true,
          message: "请选择合同开始时间",
          trigger: "change",
        },
        contract_end_time: {
          required: true,
          message: "请选择合同结束时间",
          trigger: "change",
        },
      },
      form3: {
        name: "",
        address: "",
        age: "",
        card_id: "",
        company_id: Number(this.companyId),
        sex: "",
        current_type: "",
        entry_status: "",
        entry_time: "",
        contract_start_time: "",
        contract_end_time: "",
        contract_type: "",
        retire_age: "",
      },
      form4: {},
      tableData: [],
      pageTotal: 0,
      pageSize: 10,
      page: 1,
      currentRow: null,
      dialogVisible: false,
      dialogVisible2: false,
      typeList: [
        "合同到期",
        "退休",
        "入职",
        "离职",
        "停保",
        "参保",
        "养老",
        "失业",
        "医疗",
        "工伤",
        "生育",
        "公积金",
      ],
      staffInfo: null,
      salaryInfo: null,
      proportionInfo: null,
    };
  },
  created() {
    let { type } = this.$route.params;
    if (type) this.formInline.type = type;
    this.getExpire(1);
    bus.$on("currentType", (value) => {
      this.formInline.type = value;
      this.getExpire(1);
    });
  },
  methods: {
    ...mapActions("menu", ["getNewsNum"]),
    handle(type, data) {
      switch (type) {
        case 0:
          // this.$router.push(`/todolist/${data.id}`)
          data.uers_id && this.getStaffDetail(data.uers_id);
          break;
        case 1:
          // 处理
          this.form.id = data.id;
          this.form.type = [1].indexOf(data.type) > -1 ? 2 : "";
          this.currentRow = data;
          this.dialogVisible = true;
          break;
        case 2:
          // 已读
          dealRead({ id: data.id }).then((res) => {
            if (res.code) {
              this.getExpire(this.page);
              this.getNewsNum();
            }
          });
      }
    },
    search() {
      this.getExpire(1);
    },
    handleCurrentChange(page) {
      this.getExpire(page);
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) this.dealExpire();
      });
    },
    // 获取待办事情列表
    getExpire(page) {
      let params = {
        username: this.formInline.username,
        aready: this.formInline.aready,
        type: this.formInline.type,
        start_deal_time: this.formInline.time ? this.formInline.time[0] : "",
        end_deal_time: this.formInline.time ? this.formInline.time[1] : "",
      };
      if (params.aready == "") delete params.aready;
      getExpire({
        ...params,
        page: page,
        page_num: 10,
      }).then((res) => {
        this.tableData = res.data;
        this.pageTotal = res.count;
        this.page = page;
      });
    },
    // 代办事情处理
    dealExpire() {
      let params = this.form;
      if (this.form.type != 1) {
        delete params.contract_end_time;
        delete params.contract_start_time;
      }
      if (this.form.type != 4) {
        delete params.remark;
      }
      dealExpire(params).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getExpire(this.page);
          this.getNewsNum();
          this.$message.success("处理成功");
        }
      });
    },
    // 获取员工详细信息
    getStaffDetail(id) {
      getStaffDetail(id).then((res) => {
        if (res.code) {
          this.dialogVisible2 = true;
          this.staffInfo = res.data.user_info;
          this.proportionInfo = res.data.proportion_info;
          this.salaryInfo = res.data.salary;
          console.log("详情", res);
        } else {
          this.$message.warning("数据请求失败");
        }
      });
    },
  },
};
</script>

<style>
.dialog_detail.el-form--inline .el-form-item {
  width: 400px;
}
</style>