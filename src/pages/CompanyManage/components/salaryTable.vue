<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-input
            v-model="formInline.username"
            placeholder="请输入姓名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            class="select-date"
            v-model="formInline.time"
            type="month"
            value-format="yyyy-MM"
            placeholder="选择日期"
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
        size="small"
        :style="{ marginRight: item == 'record' ? '0px' : '10px' }"
        @click="item == 'record' ? recordBtn() : grantBtn()"
        v-for="(item, index) in Object.keys(btns)"
        :key="index"
      >
        {{ item == "record" ? "确认对账" : "确认发放" }}
      </el-button>
      <el-upload
        v-show="isHasAuth(174)"
        style="display: inline-block; margin-right: 10px"
        action="http://rlzypq.samowl.cn/api/excel_salary"
        :data="{ company_id: companyId }"
        name="excel"
        :headers="authorization"
        :show-file-list="false"
        :on-success="uploadSuccess"
      >
        <el-button type="primary" size="small">导入薪资数据</el-button>
      </el-upload>
      <el-button
        type="primary"
        @click="handle(1)"
        v-show="isHasAuth(176)"
        size="small"
        >导出薪资数据</el-button
      >
      <el-button
        type="primary"
        @click="handle(2)"
        v-show="isHasAuth(174)"
        size="small"
        >下载薪资模板</el-button
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
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column fixed prop="name" width="120px" label="姓名" />
      <el-table-column prop="sex" label="性别">
        <template slot-scope="scope">
          {{ scope.row && scope.row.sex ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column prop="card_id" width="180px" label="身份证号" />
      <el-table-column prop="department" label="部门" />
      <el-table-column prop="position" label="职位" />
      <el-table-column prop="salary" width="100px" label="基本工资" />
      <el-table-column prop="post_salary" width="100px" label="岗位工资" />
      <el-table-column width="100px" prop="post_allowance" label="岗位津贴" />
      <el-table-column width="100px" prop="post_check" label="考核工资" />
      <el-table-column width="100px" prop="post_work" label="出勤工资" />
      <el-table-column width="100px" prop="post_education" label="学历工资">
      </el-table-column>
      <el-table-column
        prop="post_title"
        width="100px"
        label="职称工资"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column width="100px" prop="post_age" label="工龄工资" />
      <el-table-column width="100px" prop="achievements" label="绩效工资" />
      <el-table-column width="100px" prop="post_tax" label="扣税额" />
      <el-table-column
        prop="person_pension"
        label="养老保险"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column
        prop="person_accident"
        label="意外伤害保险"
        show-overflow-tooltip
      >
      </el-table-column> -->
      <el-table-column
        prop="person_unemployment"
        label="失业险"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="person_medical"
        label="医疗保险"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column
        prop="person_accumulation"
        label="住房公积金"
        show-overflow-tooltip
      >
      </el-table-column>
      <!-- <el-table-column prop="post_management" label="管理费" /> -->
      <el-table-column prop="all_post" label="实发工资" />
      <el-table-column
        prop="creat_at"
        label="发薪日期"
        width="180px"
        show-overflow-tooltip
      >
      </el-table-column>
      <el-table-column width="100px" prop="is_record_string" label="确认对账" />
      <el-table-column width="100px" prop="is_out_string" label="是否发放" />
      <el-table-column prop="remak" label="备注" show-overflow-tooltip>
      </el-table-column>
      <el-table-column
        :prop="key"
        :label="tableColumn[key]"
        show-overflow-tooltip
        v-for="(key, index) in Object.keys(tableColumn)"
        :key="index"
      >
      </el-table-column>
      <el-table-column width="150px" prop="handle" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handle(5, scope.row)"
            v-show="scope.row.is_out == 0"
          >
            发放
          </el-button>
          <el-button
            type="text"
            @click="handle(3, scope.row)"
            v-show="isHasAuth(169) && scope.row.is_record != 1"
          >
            编辑
          </el-button>
          <el-button
            type="text"
            @click="handle(4, scope.row)"
            v-show="isHasAuth(172) && scope.row.is_record != 1"
          >
            备注
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <a ref="downloadFile"></a>
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
      title="编辑薪资信息"
      :visible.sync="dialogVisible"
      width="80%"
      @closed="closeDialog(0)"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="rules1"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="基本工资:" prop="salary">
          <el-input v-model="form.salary" />
        </el-form-item>
        <el-form-item label="岗位工资:" prop="post_salary">
          <el-input v-model="form.post_salary" />
        </el-form-item>
        <el-form-item label="绩效工资:" prop="achievements">
          <el-input v-model="form.achievements" />
        </el-form-item>
        <el-form-item label="岗位津贴:" prop="post_allowance">
          <el-input v-model="form.post_allowance" />
        </el-form-item>
        <el-form-item label="考核工资:" prop="post_check">
          <el-input v-model="form.post_check" />
        </el-form-item>
        <el-form-item label="出勤工资:" prop="post_work">
          <el-input v-model="form.post_work" />
        </el-form-item>
        <el-form-item label="学历工资:" prop="post_education">
          <el-input v-model="form.post_education" />
        </el-form-item>
        <el-form-item label="职称工资:" prop="post_title">
          <el-input v-model="form.post_title" />
        </el-form-item>
        <el-form-item label="工龄工资:" prop="post_age">
          <el-input v-model="form.post_age" />
        </el-form-item>
        <el-form-item label="扣税额:" prop="post_tax">
          <el-input v-model="form.post_tax" />
        </el-form-item>
        <el-form-item label="个人养老保险:" prop="person_pension">
          <el-input v-model="form.person_pension" />
        </el-form-item>
        <!-- <el-form-item label="个人意外伤害保险:" prop="person_accident">
          <el-input v-model="form.person_accident" />
        </el-form-item> -->
        <el-form-item label="个人失业险:" prop="person_unemployment">
          <el-input v-model="form.person_unemployment" />
        </el-form-item>
        <el-form-item label="个人医疗保险:" prop="person_medical">
          <el-input v-model="form.person_medical" />
        </el-form-item>
        <!-- <el-form-item label="个人生育保险:" prop="person_birth">
          <el-input v-model="form.person_birth" />
        </el-form-item> -->
        <el-form-item label="个人公积金:" prop="person_accumulation">
          <el-input v-model="form.person_accumulation" />
        </el-form-item>
        <el-form-item label="银行卡号:" prop="bank_card">
          <el-input v-model="form.bank_card" />
        </el-form-item>
        <el-form-item label="所属银行:" prop="bank">
          <el-input v-model="form.bank" />
        </el-form-item>
        <el-form-item label="发薪日期:" prop="pay_date">
          <el-input-number
            v-model="form.pay_date"
            @change="handleChange"
            :min="1"
            :max="30"
            disabled
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="薪资备注"
      :visible.sync="dialogVisible2"
      width="40%"
      @closed="closeDialog(1)"
    >
      <el-form :model="form2" ref="form2" :rules="rules2" label-width="100px">
        <el-form-item label="姓名:" prop="psu_id">
          {{ currentRow && currentRow.name }}
        </el-form-item>
        <el-form-item label="备注信息:" prop="remark_string">
          <el-input type="textarea" v-model="form2.remark_string" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="remakSalary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getStaffSalaryList,
  editSalary,
  remakSalary,
  getSalaryButton,
  addSalaryButton,
  addSalaryButton2,
  addSalaryButton3,
} from "@/api/salary.js";
import { mapState } from "vuex";
import bus from "@/utils/bus.js";
export default {
  data() {
    return {
      formInline: {
        username: "",
        time: "",
      },
      form: {
        salary: "",
        post_salary: "",
        achievements: "",
        post_allowance: "",
        post_check: "",
        post_work: "",
        post_education: "",
        post_age: "",
        post_title: "",
        post_tax: "",
        person_pension: "",
        person_accident: "",
        person_unemployment: "",
        person_medical: "",
        person_birth: "",
        person_accumulation: "",
        bank: "",
        bank_card: "",
        pay_date: 15,
      },
      rules1: {
        salary: {
          required: true,
          message: "请输入基本工资",
          trigger: "change",
        },
        post_salary: {
          required: true,
          message: "请输入岗位工资",
          trigger: "change",
        },
        achievements: {
          required: true,
          message: "请输入绩效工资",
          trigger: "change",
        },
        post_allowance: {
          required: true,
          message: "请输入岗位津贴",
          trigger: "change",
        },
        post_check: {
          required: true,
          message: "请输入考核工资",
          trigger: "change",
        },
        post_work: {
          required: true,
          message: "请输入出勤工资",
          trigger: "change",
        },
        post_education: {
          required: true,
          message: "请输入学历工资",
          trigger: "change",
        },
        post_title: {
          required: true,
          message: "请输入职称工资",
          trigger: "change",
        },
        post_age: {
          required: true,
          message: "请输入工龄工资",
          trigger: "change",
        },
        post_tax: {
          required: true,
          message: "请输入扣税额",
          trigger: "change",
        },
        person_pension: {
          required: true,
          message: "请输入养老保险",
          trigger: "change",
        },
        person_accident: {
          required: true,
          message: "请输入意外伤害保险",
          trigger: "change",
        },
        person_unemployment: {
          required: true,
          message: "请输入失业险",
          trigger: "change",
        },
        person_medical: {
          required: true,
          message: "请输入医疗保险",
          trigger: "change",
        },
        person_birth: {
          required: true,
          message: "请输入生育保险",
          trigger: "change",
        },
        person_accumulation: {
          required: true,
          message: "请输入住房公积金",
          trigger: "change",
        },
        bank: { required: true, message: "请输入所属银行", trigger: "change" },
        bank_card: {
          required: true,
          message: "请输入银行卡号",
          trigger: "change",
        },
        pay_date: {
          required: true,
          message: "请输入发薪日期",
          trigger: "change",
        },
      },
      form2: {
        psu_id: "",
        remark_string: "",
      },
      rules2: {
        psu_id: { required: true, message: "姓名不能为空", trigger: "change" },
        remark_string: {
          required: true,
          message: "请输入备注信息",
          trigger: "change",
        },
      },
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false,
      dialogVisible2: false,
      currentRow: null,
      authorization: { Authorization: localStorage.getItem("token") },
      btns: {},
      tableColumn: {},
    };
  },
  props: ["companyId"],
  created() {
    this.getSalaryButton();
    this.getStaffSalaryList(1);
  },
  computed: {
    ...mapState("menu", ["excellUrls", "defaultAuth"]),
  },
  methods: {
    handleSelectionChange() {},
    handleCurrentChange(page) {
      this.getStaffSalaryList(page);
    },
    search() {
      this.getStaffSalaryList(1);
    },
    handle(type, data) {
      let subjects = [
        "salary",
        "post_salary",
        "achievements",
        "post_allowance",
        "post_check",
        "post_work",
        "post_education",
        "post_age",
        "post_title",
        "post_tax",
        "person_pension",
        "person_accident",
        "person_unemployment",
        "person_medical",
        "person_birth",
        "person_accumulation",
        "bank",
        "bank_card",
        "pay_date",
      ];
      switch (type) {
        case 1:
          // 导出薪资数据
          this.downFile(
            `http://rlzypq.samowl.cn/api/getStaffSalaryListExcel?company_id=${
              this.companyId
            }&username=${this.formInline.username}&time=${
              this.formInline.time
            }&token=${localStorage.getItem("token")}`
          );
          break;
        case 2:
          // 下载薪资模板
          this.downFile(this.excellUrls.money);
          break;
        case 3:
          // 编辑
          for (let i = 0; i < subjects.length; i++) {
            this.form[subjects[i]] = data[subjects[i]];
          }
          this.currentRow = data;
          this.dialogVisible = true;
          break;
        case 4:
          // 备注
          this.currentRow = data;
          this.form2.psu_id = this.currentRow.psu_id;
          this.dialogVisible2 = true;
          break;
        case 5:
          // 发放
          this.grantBtn(1, data.psu_id);
          break;
      }
    },
    uploadSuccess(res) {
      if (res.code) {
        this.getStaffSalaryList(this.page);
      } else {
        this.$message.warning(res.info);
      }
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) this.editSalary();
      });
    },
    handleChange(value) {
      this.form.pay_date = value;
    },
    closeDialog(type) {
      if (type) {
        this.form2 = this.$options.data().form2;
        this.$refs.form2 && this.$refs.form2.resetFields();
        return;
      }
      this.form = this.$options.data().form;
      this.$refs.form.resetFields();
    },
    // 员工薪资列表
    getStaffSalaryList(page) {
      getStaffSalaryList({
        ...this.formInline,
        company_id: this.companyId,
        page: page,
      }).then((res) => {
        if (res.code) {
          this.tableColumn = res.data.company_salary_custom || [];
          let arr = [];
          let staff_list = res.data.staff_list || [];
          staff_list.map((item) => {
            let { custom_content, ...other } = item;
            if (custom_content) {
              for (const key in custom_content) {
                if (Object.hasOwnProperty.call(custom_content, key)) {
                  other[key] = custom_content[key];
                }
              }
            }
            arr.push(other);
          });
          this.tableData = arr;
          this.page = page;
          this.pageTotal = res.count;
        }
      });
    },
    // 薪资备注
    remakSalary() {
      this.$refs.form2.validate((valid) => {
        if (valid) {
          remakSalary(this.form2).then((res) => {
            if (res.code) {
              this.dialogVisible2 = false;
              this.getStaffSalaryList(this.page);
              this.$message.success("备注成功");
            }
          });
        }
      });
    },
    // 编辑薪资信息
    editSalary() {
      editSalary({
        psu_id: this.currentRow.psu_id,
        ...this.form,
      }).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getStaffSalaryList(this.page);
          this.$message.success("编辑成功");
        }
      });
    },
    // 导出薪资数据
    downFile(url) {
      this.$refs.downloadFile.target = "_blank";
      this.$refs.downloadFile.href = url;
      this.$refs.downloadFile.click();
    },
    // 获取薪资页按钮
    getSalaryButton() {
      getSalaryButton({
        company_id: this.companyId,
      }).then((res) => {
        if (res.code) {
          let obj = {};
          for (let i in res.data) {
            if (res.data[i] == 1) {
              obj[i] = res.data[i];
            }
          }
          this.btns = obj;
        }
      });
    },
    // 对账发放按钮-发放
    grantBtn(flag, id) {
      let params = {
        company_id: this.companyId,
        is: 1,
      };
      if (flag) params.salary_id = id;
      addSalaryButton(params).then((res) => {
        if (res.code) {
          this.getSalaryButton();
          this.getStaffSalaryList(this.page);
          bus.$emit("updateAccountMoney");
          this.$message.success("操作成功");
        }
      });
    },
    // 对账发放按钮-对账
    recordBtn() {
      addSalaryButton2({
        company_id: this.companyId,
        is: 0,
      }).then((res) => {
        if (res.code) {
          this.getStaffSalaryList(this.page);
          this.getSalaryButton();
          this.$message.success("操作成功");
        }
      });
    },
    addSalaryButton3(id) {
      addSalaryButton3({
        company_id: this.companyId,
        is: 1,
        id,
      }).then((res) => {
        if (res.code) {
          this.getStaffSalaryList(this.page);
        }
        console.log(res);
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

<style>
.select-date .el-input__inner {
  width: 200px !important;
}
.el-input-number {
  width: auto;
}
</style>