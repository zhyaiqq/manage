<template>
  <div class="company_list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="费用明细" name="0">
        <div class="search_top">
          <el-form :inline="true" :model="formInline2" class="left">
            <el-form-item label="类型:" prop="type">
              <el-select
                v-model="formInline2.type"
                placeholder="请选择"
                @change="search(1)"
              >
                <el-option label="全部" value="" />
                <el-option label="工资" :value="1" />
                <el-option label="五险一金" :value="2" />
                <el-option label="补偿金" :value="3" />
                <el-option label="充值" :value="4" />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-btns">
          <el-button type="primary" @click="handle(3)" size="small"
            >导出费用明细</el-button
          >
        </div>
        <el-table
          height="400"
          :data="tableData2"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed prop="company_name" label="扣费公司" />
          <el-table-column prop="money" label="扣费金额" />
          <el-table-column prop="type_string" label="类型" />
          <el-table-column prop="create_time" label="时间" />
          <el-table-column prop="username" label="操作人员" />
        </el-table>
        <el-pagination
          @current-change="(value) => handleCurrentChange(1, value)"
          :current-page="page2"
          :page-size="pageSize2"
          :total="pageTotal2"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="扣费记录" name="1">
        <div class="search_top">
          <el-form :inline="true" :model="formInline" class="left">
            <el-form-item label="姓名:" prop="username">
              <el-input
                v-model="formInline.username"
                placeholder="请输入姓名"
                @keyup.enter.native="search(0)"
              ></el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="type">
              <el-select
                v-model="formInline.type"
                placeholder="请选择"
                @change="search(0)"
              >
                <el-option label="全部" value="" />
                <el-option label="工资" :value="1" />
                <el-option label="五险一金" :value="2" />
                <el-option label="补偿金" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item label="扣费时间:" prop="time">
              <el-date-picker
                @change="search(0)"
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
              <el-button type="primary" @click="search(0)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <!-- <div class="table-btns">
          <el-button
            type="primary"
            @click="handle(1)"
            v-show="isHasAuth(180)"
            size="small"
            >追加余额</el-button
          >
        </div> -->
        <el-table
          height="450"
          :data="tableData"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed prop="name" label="相关人" />
          <el-table-column prop="money" label="扣款金额" />
          <el-table-column prop="company_name" label="扣费公司" />
          <el-table-column prop="company_money" label="公司账户余额" />
          <el-table-column prop="creat_at" label="扣费时间" />
          <el-table-column prop="sex_string" label="扣费类型" />
          <el-table-column prop="handle" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handle(2, scope.row)"
                v-show="isHasAuth(182)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @current-change="(value) => handleCurrentChange(0, value)"
          :current-page="page"
          :page-size="pageSize"
          :total="pageTotal"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="费用年汇总" name="2">
        <div class="search_top">
          <el-form :inline="true" :model="formInline3" class="left">
            <el-form-item label="年份:" prop="year">
              <el-date-picker
                :clearable="false"
                v-model="formInline3.year"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                @change="search(2)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(2)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-btns">
          <el-button type="primary" @click="handle(4)" size="small"
            >导出费用汇总</el-button
          >
        </div>
        <el-table
          height="400"
          :data="tableData3"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
          @selection-change="handleSelectionChange"
        >
          <el-table-column fixed prop="user_name" label="人员" />
          <el-table-column label="五险一金">
            <el-table-column prop="company_pension" label="养老" />
            <el-table-column prop="company_unemployment" label="失业" />
            <el-table-column prop="company_medical" label="医疗" />
            <el-table-column prop="company_injury" label="工伤" />
            <el-table-column prop="company_birth" label="生育" />
            <el-table-column prop="company_accumulation" label="公积金" />
          </el-table-column>
          <el-table-column prop="social_all_money" label="五险一金小计" />
          <el-table-column prop="salary" label="基本工资" />
          <el-table-column prop="achievements" label="绩效工资" />
          <el-table-column prop="post_salary" label="岗位工资" />
          <el-table-column prop="post_allowance" label="岗位津贴" />
          <el-table-column prop="post_check" label="考核工资" />
          <el-table-column prop="post_work" label="出勤工资" />
          <el-table-column prop="post_education" label="学历工资" />
          <el-table-column prop="post_title" label="职称工资" />
          <el-table-column prop="post_age" label="工龄工资" />
          <el-table-column prop="bu_all_money" label="补偿金" />
          <el-table-column width="100px" prop="sum_count" label="总计" />
        </el-table>
        <el-pagination
          @current-change="(value) => handleCurrentChange(2, value)"
          :current-page="page3"
          :page-size="pageSize3"
          :total="pageTotal3"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="费用月汇总" name="3">
        <div class="search_top">
          <el-form :inline="true" :model="formInline3" class="left">
            <el-form-item label="年份:" prop="year">
              <el-date-picker
                :clearable="false"
                v-model="formInline4.year"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                @change="search(3)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(3)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div class="table-btns">
          <el-button type="primary" @click="handle(5)" size="small"
            >管理费设置</el-button
          >
          <el-button type="primary" @click="handle(6)" size="small"
            >导出费用月汇总</el-button
          >
        </div>
        <el-table
          height="400"
          :data="tableData4"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
          @selection-change="handleSelectionChange"
          show-summary
        >
          <el-table-column fixed prop="month" label="月份" />
          <el-table-column prop="company_name" label="派遣单位" />
          <el-table-column prop="staff_count" label="人数" />
          <el-table-column prop="social_log" label="参保基数" />
          <el-table-column label="五险保费">
            <el-table-column prop="company_pension" label="养老" />
            <el-table-column prop="company_unemployment" label="失业" />
            <el-table-column prop="company_medical" label="医疗" />
            <el-table-column prop="company_injury" label="工伤" />
            <el-table-column prop="company_birth" label="生育" />
          </el-table-column>
          <el-table-column prop="total_wages" label="工资" />
          <el-table-column prop="company_accumulation" label="公积金" />
          <el-table-column prop="manage_fee" label="管理费" />
          <el-table-column prop="total_money" label="总合计" />
        </el-table>
        <!-- <el-pagination
          @current-change="(value) => handleCurrentChange(2, value)"
          :current-page="page3"
          :page-size="pageSize3"
          :total="pageTotal3"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination> -->
      </el-tab-pane>
    </el-tabs>
    <el-button
      style="position: absolute; top: 0px; left: 400px"
      type="primary"
      @click="handle(1)"
      v-show="isHasAuth(180)"
      size="small"
      >追加余额</el-button
    >
    <a ref="downloadFile"></a>
    <el-dialog
      title="追加余额"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="closeDialog(0)"
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="追加公司:">
          {{ companyName }}
        </el-form-item>
        <el-form-item label="追加金额:" prop="money">
          <el-input v-model="form.money" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="recharge">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="管理费设置"
      :visible.sync="dialogVisible2"
      width="40%"
      @closed="closeDialog(1)"
    >
      <el-form :model="form2" ref="form2" :rules="rules2" label-width="100px">
        <el-form-item label="公司:">
          {{ companyName }}
        </el-form-item>
        <el-form-item label="管理费:" prop="money">
          <el-input v-model="form2.money" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="setManageFee">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCutLogList,
  delCutLog,
  getDetailed,
  costAll,
  costMonthAll,
  setManageFee,
} from "@/api/charge.js";
import { recharge, findCompany } from "@/api/company.js";
import { mapState } from "vuex";
import dayjs from "dayjs";
import bus from "@/utils/bus.js";
export default {
  data() {
    return {
      formInline: {
        username: "",
        type: "",
        time: "",
      },
      formInline2: {
        type: "",
      },
      formInline3: {
        year: dayjs().format("YYYY"),
      },
      formInline4: {
        year: dayjs().format("YYYY"),
      },
      form: {
        money: "",
      },
      form2: {
        money: "",
      },
      rules: {
        money: { required: true, message: "请输入金额", trigger: "change" },
      },
      rules2: {
        money: { required: true, message: "请输入金额", trigger: "change" },
      },
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      tableData2: [],
      page2: 1,
      pageSize2: 10,
      pageTotal2: 0,
      tableData3: [],
      page3: 1,
      pageSize3: 10,
      pageTotal3: 0,
      dialogVisible: false,
      dialogVisible2: false,
      activeName: 0,
      tableData4: [],
      page4: 1,
      pageSize4: 10,
      pageTotal4: 0,
    };
  },
  props: ["companyId", "companyName"],
  created() {
    this.getCutLogList(1);
    this.getDetailed(1);
    this.costAll(1);
    this.costMonthAll(1);
  },
  computed: {
    ...mapState("menu", ["defaultAuth"]),
  },
  methods: {
    handleSelectionChange() {},
    handleCurrentChange(type, page) {
      if (type == 3) {
        this.costMonthAll(page);
      } else if (type == 2) {
        this.costAll(page);
      } else if (type == 1) {
        this.getDetailed(page);
      } else {
        this.getCutLogList(page);
      }
    },
    handleClick() {
      if (this.activeName == 0) {
        this.getDetailed(this.page2);
      }
    },
    search(type) {
      if (type == 3) {
        this.costMonthAll(1);
      } else if (type == 2) {
        this.costAll(1);
      } else if (type == 1) {
        this.getDetailed(1);
      } else {
        this.getCutLogList(1);
      }
    },
    closeDialog(index) {
      if (index == 0) {
        this.form = this.$options.data().form;
        this.$refs.form.resetFields();
      } else {
        this.form2 = this.$options.data().form2;
        this.$refs.form2.resetFields();
      }
    },
    handle(type, data) {
      switch (type) {
        case 1:
          // 追加余额
          this.dialogVisible = true;
          break;
        case 2:
          // 删除
          this.delCutLog(data.id);
          break;
        case 3:
          // 导出费用明细
          this.downloadFile(
            `http://rlzypq.samowl.cn/api/getDetailed_excel?company_id=${
              this.companyId
            }&type=${this.formInline2.type}&page=${
              this.page2
            }&token=${localStorage.getItem("token")}`
          );
          break;
        case 4:
          // 导出费用汇总
          this.downloadFile(
            `http://rlzypq.samowl.cn/api/cost_all_excel?company_id=${
              this.companyId
            }&year=${this.formInline3.year}&token=${localStorage.getItem(
              "token"
            )}`
          );
          break;
        case 5:
          // 设置管理费
          this.getCompanyInfo();
          break;
        case 6:
          // 导出费用月汇总
          this.downloadFile(
            `http://rlzypq.samowl.cn/api/out_month_cost_all?company_id=${
              this.companyId
            }&year=${this.formInline4.year}&token=${localStorage.getItem(
              "token"
            )}`
          );
          break;
      }
    },
    // 扣费记录列表
    getCutLogList(page) {
      let params = {
        ...this.formInline,
        start_creat_at: this.formInline.time ? this.formInline.time[0] : "",
        end_creat_at: this.formInline.time ? this.formInline.time[1] : "",
        company_id: this.companyId,
        page: page,
      };
      delete params.time;
      getCutLogList(params).then((res) => {
        if (res.code) {
          this.tableData = res.data;
          this.page = page;
          this.pageTotal = res.count;
        }
      });
    },
    // 账户充值
    recharge() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$alert(`确定为该账户充值${this.form.money}元吗?`, "提示", {
            confirmButtonText: "确定",
            callback: (action) => {
              if (action == "confirm")
                recharge({
                  company_id: this.companyId,
                  money: this.form.money,
                }).then((res) => {
                  if (res.code) {
                    this.dialogVisible = false;
                    this.getCutLogList(this.page);
                    this.$message.success("充值成功");
                    bus.$emit("updateAccountMoney");
                  }
                });
            },
          });
        }
      });
    },
    // 删除扣费记录
    delCutLog(id) {
      delCutLog({
        log_id: id,
      }).then((res) => {
        if (res.code) {
          this.getCutLogList(1);
          this.$message.success("删除成功");
        }
      });
    },
    // 费用明细
    getDetailed(page) {
      let params = {
        ...this.formInline2,
        company_id: this.companyId,
        page: page,
      };
      delete params.time;
      getDetailed(params).then((res) => {
        if (res.code) {
          this.tableData2 = res.data;
          this.page2 = page;
          this.pageTotal2 = res.count;
        }
      });
    },
    // 费用汇总
    costAll(page) {
      let params = {
        ...this.formInline3,
        company_id: this.companyId,
        page: page,
      };
      delete params.time;
      costAll(params).then((res) => {
        if (res.code) {
          this.tableData3 = res.data;
          this.page3 = page;
          this.pageTotal3 = res.count;
        }
      });
    },
    // 费用月汇总
    costMonthAll(page) {
      let params = {
        ...this.formInline3,
        company_id: this.companyId,
      };
      delete params.time;
      costMonthAll(params).then((res) => {
        if (res.code) {
          this.tableData4 = res.data.list_data;
          this.tableData4.map((item) => {
            item.company_name = res.data.company_name;
          });
          this.page4 = page;
          this.pageTotal4 = res.count;
        }
      });
    },
    // 查询公司详情 - 获取管理费
    getCompanyInfo() {
      findCompany(this.companyId).then((res) => {
        if (res.code) this.form2.money = res.data.manage_fee;
        this.dialogVisible2 = true;
      });
    },
    // 设置管理费
    setManageFee() {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          setManageFee({
            company_id: this.companyId,
            manage_fee: this.form2.money,
          }).then((res) => {
            if (res.code) {
              this.costMonthAll(1);
              this.dialogVisible2 = false;
            }
          });
        }
      });
    },
    downloadFile(url) {
      this.$refs.downloadFile.target = "_blank";
      this.$refs.downloadFile.href = url;
      this.$refs.downloadFile.download = url
        ? url.substr(url.indexOf("") + 1)
        : "";
      this.$refs.downloadFile.click();
    },
    isHasAuth(auth_id) {
      return (
        this.defaultAuth && this.defaultAuth.some((item) => item.id == auth_id)
      );
    },
  },
};
</script>

<style>
.el-table .cell {
  text-align: center;
}
</style>