<template>
  <div class="company_list">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="社保名单" name="0">
        <SocialList :companyId="companyId" />
      </el-tab-pane>
      <el-tab-pane label="补差" name="1">
        <div class="search_top">
          <el-form :inline="true" :model="formInline2" class="left">
            <el-form-item label="姓名:" prop="username">
              <el-input
                v-model="formInline2.username"
                placeholder="请输入姓名"
                @keyup.enter.native="search(1)"
              ></el-input>
            </el-form-item>
            <el-form-item label="时间:" prop="year">
              <el-date-picker
                :clearable="false"
                v-model="formInline2.year"
                type="year"
                placeholder="选择年"
                value-format="yyyy"
                @change="search(1)"
              />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="search(1)">搜索</el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-table
          height="450"
          :data="tableData2"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            fixed
            prop="user_name"
            label="姓名"
            width="100px"
            show-overflow-tooltip
          />
          <el-table-column width="150px" prop="last_all" label="上年缴费" />
          <el-table-column
            width="150px"
            prop="difference_all"
            label="应补缴费"
          />
          <el-table-column width="150px" prop="social_log" label="上年基数" />
          <el-table-column
            width="150px"
            prop="current_social"
            label="下年基数"
          />
          <el-table-column
            width="150px"
            prop="company_pension"
            label="养老（企业比例）"
          />
          <el-table-column
            width="150px"
            prop="person_pension"
            label="养老（个人比例）"
          />
          <el-table-column
            width="150px"
            prop="company_unemployment"
            label="失业（企业比例）"
          />
          <el-table-column
            width="150px"
            prop="person_unemployment"
            label="失业（个人比例）"
          />
          <el-table-column
            width="150px"
            prop="company_medical"
            label="医疗（企业比例）"
          />
          <el-table-column
            width="150px"
            prop="person_medical"
            label="医疗（个人比例）"
          />
          <el-table-column
            width="150px"
            prop="company_injury"
            label="工伤（企业比例）"
          />
          <el-table-column
            width="150px"
            prop="person_injury"
            label="工伤（个人比例）"
          />
          <el-table-column
            width="150px"
            prop="company_birth"
            label="生育（企业比例）"
          />
          <el-table-column
            width="150px"
            prop="person_birth"
            label="生育（个人比例）"
          />
          <el-table-column
            width="150px"
            prop="company_accumulation"
            label="公积金（企业比例）"
          />
          <el-table-column
            width="150px"
            prop="person_accumulation"
            label="公积金（个人比例）"
          />
        </el-table>
        <el-pagination
          @current-change="(page) => handleCurrentChange(1, page)"
          :current-page="page2"
          :page-size="pageSize2"
          :total="pageTotal2"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="社保记录" name="2">
        <div class="search_top">
          <el-form :inline="true" :model="formInline3" class="left">
            <el-form-item label="姓名:" prop="username">
              <el-input
                v-model="formInline3.username"
                placeholder="请输入姓名"
                @keyup.enter.native="search(2)"
              ></el-input>
            </el-form-item>
            <el-form-item label="时间:" prop="year">
              <el-date-picker
                :clearable="false"
                v-model="formInline3.year"
                type="year"
                placeholder="选择日期"
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
          <el-button type="primary" @click="handle(6)" size="small"
            >导出社保记录</el-button
          >
        </div>
        <el-table
          height="400"
          :data="tableData3"
          :header-cell-style="{ textAlign: 'center' }"
          :cell-style="{ textAlign: 'center' }"
          border
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column
            fixed
            prop="user_name"
            label="姓名"
            width="100px"
            show-overflow-tooltip
          />
          <el-table-column width="150px" prop="money" label="公司缴费总额" />
          <el-table-column
            width="150px"
            prop="company_money"
            label="公司账户余额"
          />
          <el-table-column
            width="150px"
            prop="company_pension"
            label="养老（企业）"
          />

          <el-table-column
            width="150px"
            prop="company_unemployment"
            label="失业（企业）"
          />

          <el-table-column
            width="150px"
            prop="company_medical"
            label="医疗（企业）"
          />

          <el-table-column
            width="150px"
            prop="company_injury"
            label="工伤（企业）"
          />

          <el-table-column
            width="150px"
            prop="company_birth"
            label="生育（企业）"
          />

          <el-table-column
            width="150px"
            prop="company_accumulation"
            label="公积金（企业）"
          />
          <el-table-column
            width="150px"
            prop="person_pension"
            label="养老（个人）"
          />

          <el-table-column
            width="150px"
            prop="person_unemployment"
            label="失业（个人）"
          />

          <el-table-column
            width="150px"
            prop="person_medical"
            label="医疗（个人）"
          />

          <el-table-column
            width="150px"
            prop="person_injury"
            label="工伤（个人）"
          />

          <el-table-column
            width="150px"
            prop="person_birth"
            label="生育（个人）"
          />

          <el-table-column
            width="150px"
            prop="person_accumulation"
            label="公积金（个人）"
          />
        </el-table>
        <el-pagination
          @current-change="(page) => handleCurrentChange(2, page)"
          :current-page="page3"
          :page-size="pageSize3"
          :total="pageTotal3"
          layout="total, prev, pager, next, jumper"
          background
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <a ref="downloadFile"></a>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      @closed="closeDialog(0)"
    >
      <el-form
        :model="form"
        ref="form"
        :rules="dialogVisible == '修改五险比例' ? rulesPart : rulesPart"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="养老保险（企业认缴）:" prop="company_pension">
          <el-input v-model="form.company_pension" />
        </el-form-item>
        <el-form-item label="养老保险（个人认缴）:" prop="person_pension">
          <el-input v-model="form.person_pension" />
        </el-form-item>
        <el-form-item label="失业保险（企业认缴）:" prop="company_unemployment">
          <el-input v-model="form.company_unemployment" />
        </el-form-item>
        <el-form-item label=" 失业保险（个人认缴）:" prop="person_unemployment">
          <el-input v-model="form.person_unemployment" />
        </el-form-item>
        <el-form-item label="医疗保险（企业认缴）:" prop="company_medical">
          <el-input v-model="form.company_medical" />
        </el-form-item>
        <el-form-item label="医疗保险（个人认缴）:" prop="person_medical">
          <el-input v-model="form.person_medical" />
        </el-form-item>
        <el-form-item label="工伤保险（企业认缴）:" prop="company_injury">
          <el-input v-model="form.company_injury" />
        </el-form-item>
        <el-form-item label="工伤保险（个人认缴）:" prop="person_injury">
          <el-input v-model="form.person_injury" />
        </el-form-item>
        <el-form-item label="生育保险（企业认缴）:" prop="company_birth">
          <el-input v-model="form.company_birth" />
        </el-form-item>
        <el-form-item label=" 生育保险（个人认缴）:" prop="person_birth">
          <el-input v-model="form.person_birth" />
        </el-form-item>
        <el-form-item label="公积金（企业认缴）:" prop="company_accumulation">
          <el-input v-model="form.company_accumulation" />
        </el-form-item>
        <el-form-item label="公积金（个人认缴）:" prop="person_accumulation">
          <el-input v-model="form.person_accumulation" />
        </el-form-item>
        <el-form-item
          label="参保时间:"
          prop="base_time"
          v-show="dialogTitle == '员工社保'"
        >
          <el-date-picker
            v-model="form.base_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="参保类型:"
          prop="type"
          v-show="dialogTitle == '员工社保'"
        >
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="基数参保" :value="1" />
            <el-option label="工资参保" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="参保基数:"
          prop="wages_perce"
          v-show="dialogTitle == '员工社保' && form.type == 2"
        >
          <el-input v-model="form.wages_perce" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="socialConfirm">确 定xx</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="社保备注"
      :visible.sync="dialogVisible2"
      width="40%"
      @closed="closeDialog(1)"
    >
      <el-form :model="form1" ref="form1" :rules="rules1" label-width="100px">
        <el-form-item label="员工:" prop="staff_id">
          {{ currentRow && currentRow.name }}
        </el-form-item>
        <el-form-item label="备注信息:" prop="remark_string">
          <el-input type="textarea" v-model="form1.remark_string" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getSocialList,
  addCompanySocial,
  stop,
  remarkSocial,
  editPersonSocial,
  getSocialInfo,
  getSocialCompensate,
  getCompanySocialInfo,
  getSocialLow,
} from "@/api/social_insurance.js";
import { mapState } from "vuex";
import dayjs from "dayjs";
import SocialList from "./socialList.vue";
export default {
  data() {
    return {
      formInline: {
        username: "",
        is_stop: "",
        entryTime: "",
        baseTime: "",
      },
      form: {
        company_pension: "",
        company_unemployment: "",
        company_medical: "",
        company_injury: "",
        company_birth: "",
        company_accumulation: "",
        person_pension: "",
        person_unemployment: "",
        person_medical: "",
        person_injury: "",
        person_birth: "",
        person_accumulation: "",
        company_id: "",
        user_id: "",
        base_time: "",
        wages_perce: "",
        type: "",
      },
      rulesAll: {
        company_pension: {
          required: true,
          message: "请输入养老保险（企业认缴）",
          trigger: "change",
        },
        company_unemployment: {
          required: true,
          message: "请输入失业保险（企业认缴）",
          trigger: "change",
        },
        company_medical: {
          required: true,
          message: "请输入医疗保险（企业认缴）",
          trigger: "change",
        },
        company_injury: {
          required: true,
          message: "请输入工伤保险（企业认缴）",
          trigger: "change",
        },
        company_birth: {
          required: true,
          message: "请输入生育保险（企业认缴）",
          trigger: "change",
        },
        company_accumulation: {
          required: true,
          message: "请输入公积金（企业认缴）",
          trigger: "change",
        },
        person_pension: {
          required: true,
          message: "请输入养老保险（个人认缴）",
          trigger: "change",
        },
        person_unemployment: {
          required: true,
          message: "请输入失业保险（个人认缴）",
          trigger: "change",
        },
        person_medical: {
          required: true,
          message: "请输入医疗保险（个人认缴）",
          trigger: "change",
        },
        person_injury: {
          required: true,
          message: "请输入工伤保险（个人认缴）",
          trigger: "change",
        },
        person_birth: {
          required: true,
          message: "请输入生育保险（个人认缴）",
          trigger: "change",
        },
        person_accumulation: {
          required: true,
          message: "请输入公积金（个人认缴）",
          trigger: "change",
        },
        company_id: {
          required: true,
          message: "公司不能为空",
          trigger: "change",
        },
        user_id: { required: true, message: "员工不能为空", trigger: "change" },
        base_time: {
          required: true,
          message: "请选择参保时间",
          trigger: "change",
        },
        type: { required: true, message: "请选择参保类型", trigger: "change" },
      },
      rulesPart: {
        company_pension: {
          required: true,
          message: "请输入养老保险（企业认缴）",
          trigger: "change",
        },
        company_unemployment: {
          required: true,
          message: "请输入失业保险（企业认缴）",
          trigger: "change",
        },
        company_medical: {
          required: true,
          message: "请输入医疗保险（企业认缴）",
          trigger: "change",
        },
        company_injury: {
          required: true,
          message: "请输入工伤保险（企业认缴）",
          trigger: "change",
        },
        company_birth: {
          required: true,
          message: "请输入生育保险（企业认缴）",
          trigger: "change",
        },
        company_accumulation: {
          required: true,
          message: "请输入公积金（企业认缴）",
          trigger: "change",
        },
        person_pension: {
          required: true,
          message: "请输入养老保险（个人认缴）",
          trigger: "change",
        },
        person_unemployment: {
          required: true,
          message: "请输入失业保险（个人认缴）",
          trigger: "change",
        },
        person_medical: {
          required: true,
          message: "请输入医疗保险（个人认缴）",
          trigger: "change",
        },
        person_injury: {
          required: true,
          message: "请输入工伤保险（个人认缴）",
          trigger: "change",
        },
        person_birth: {
          required: true,
          message: "请输入生育保险（个人认缴）",
          trigger: "change",
        },
        person_accumulation: {
          required: true,
          message: "请输入公积金（个人认缴）",
          trigger: "change",
        },
        company_id: {
          required: true,
          message: "公司不能为空",
          trigger: "change",
        },
      },
      form1: {
        staff_id: "",
        remark_string: "",
      },
      rules1: {
        staff_id: {
          required: true,
          message: "员工不能为空",
          trigger: "change",
        },
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
      dialogTitle: "修改五险比例",
      currentRow: null,
      dialogVisible2: false,
      activeName: "0",
      formInline2: {
        username: "",
        year: dayjs().format("YYYY"),
      },
      tableData2: [],
      page2: 1,
      pageSize2: 10,
      pageTotal2: 0,
      tableData3: [],
      page3: 1,
      pageSize3: 10,
      pageTotal3: 0,
      formInline3: {
        username: "",
        year: dayjs().format("YYYY"),
      },
    };
  },
  props: ["companyId"],
  components: { SocialList },
  created() {
    this.getSocialList(1);
    this.getSocialCompensate(1);
    this.getSocialLow(1);
  },
  computed: {
    ...mapState("menu", ["defaultAuth"]),
  },
  methods: {
    handleSelectionChange() {},
    handleCurrentChange(type, page) {
      if (type === 2) {
        this.getSocialLow(page);
      } else if (type === 1) {
        this.getSocialCompensate(page);
      } else {
        this.getSocialList(page);
      }
    },
    search(type) {
      switch (type) {
        case 0:
          this.getSocialList(1);
          break;
        case 1:
          this.getSocialCompensate(1);
          break;
        case 2:
          this.getSocialLow(1);
          break;
      }
    },
    handleClick() {},
    handle(type, data) {
      let subjects = [
        "company_pension",
        "company_unemployment",
        "company_medical",
        "company_injury",
        "company_birth",
        "company_accumulation",
        "person_pension",
        "person_unemployment",
        "person_medical",
        "person_injury",
        "person_birth",
        "person_accumulation",
        "company_id",
        "user_id",
        "base_time",
        "wages_perce",
        "typ",
      ];
      switch (type) {
        case 1:
          getCompanySocialInfo({
            company_id: this.companyId,
          }).then((res) => {
            for (let i = 0; i < subjects.length; i++) {
              this.form[subjects[i]] = res.data[subjects[i]]
                ? res.data[subjects[i]] * 100
                : "";
            }
            this.dialogTitle = "修改五险比例";
            this.dialogVisible = true;
          });
          break;
        case 2:
          // 导出社保名单
          this.$refs.downloadFile.target = "_blank";
          this.$refs.downloadFile.href = `http://rlzypq.samowl.cn/api/getSocialListExcel?company_id=${
            this.companyId
          }&username=${this.formInline.username}&token=${localStorage.getItem(
            "token"
          )}`;
          this.$refs.downloadFile.click();
          break;
        case 3:
          // 编辑
          getSocialInfo({
            user_id: data.user_id,
            company_id: this.companyId,
          }).then((res) => {
            if (res.code) {
              this.dialogTitle = "员工社保";
              this.currentRow = data;
              for (let i = 0; i < subjects.length; i++) {
                this.form[subjects[i]] = res.data[subjects[i]];
              }
              this.form.type = res.data.is_base;
              this.dialogVisible = true;
            }
          });
          break;
        case 4:
          this.currentRow = data;
          this.form1.staff_id = this.currentRow.id;
          this.dialogVisible2 = true;
          // 备注
          break;
        case 5:
          this.currentRow = data;
          // 停保
          this.stop();
          break;
        case 6:
          // 导出社保记录
          this.$refs.downloadFile.target = "_blank";
          this.$refs.downloadFile.href = `http://rlzypq.samowl.cn/api/out_social_low?company_id=${
            this.companyId
          }&username=${this.formInline3.username}&year=${
            this.formInline3.year
          }&token=${localStorage.getItem("token")}`;
          this.$refs.downloadFile.click();
          break;
      }
    },
    closeDialog(type) {
      switch (type) {
        case 0:
          this.form = this.$options.data().form;
          this.$refs.form.resetFields();
          break;
        case 1:
          this.form1 = this.$options.data().form1;
          this.$refs.form1.resetFields();
          break;
      }
    },
    socialConfirm() {
      this.$refs.form.validate((value) => {
        if (!value) return;
        if (this.dialogTitle == "修改五险比例") {
          this.addCompanySocial();
          return;
        }
        this.editPersonSocial();
      });
    },
    confirm() {
      this.$refs.form1.validate((valid) => {
        if (valid) this.remarkSocial();
      });
    },
    // 获取社保名单
    getSocialList(page) {
      let params = {
        ...this.formInline,
        start_entry_time: this.formInline.entryTime
          ? this.formInline.entryTime[0]
          : "",
        end_entry_time: this.formInline.entryTime
          ? this.formInline.entryTime[1]
          : "",
        start_base_time: this.formInline.baseTime
          ? this.formInline.baseTime[0]
          : "",
        end_base_time: this.formInline.baseTime
          ? this.formInline.baseTime[1]
          : "",
        company_id: this.companyId,
        page: page,
      };
      delete params.baseTime;
      delete params.entryTime;
      getSocialList(params).then((res) => {
        if (res.code) {
          this.tableData = res.data;
          this.page = page;
          this.pageTotal = res.count;
        }
      });
    },
    // 获取社保补偿名单
    getSocialCompensate(page) {
      let params = {
        ...this.formInline2,
        company_id: this.companyId,
        page: page,
      };
      getSocialCompensate(params).then((res) => {
        if (res.code) {
          this.tableData2 = res.data;
          this.page2 = page;
          this.pageTotal2 = res.count;
        }
      });
    },
    // 获取社保记录
    getSocialLow(page) {
      let params = {
        ...this.formInline3,
        company_id: this.companyId,
        page: page,
      };
      getSocialLow(params).then((res) => {
        if (res.code) {
          this.tableData3 = res.data;
          this.page3 = page;
          this.pageTotal3 = res.count;
        }
      });
    },
    // 修改五险比例
    addCompanySocial() {
      addCompanySocial({
        ...this.form,
        company_id: this.companyId,
      }).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getSocialList(1);
          this.$message.success("修改五险比例成功");
        }
      });
    },
    // 员工停保
    stop() {
      stop({
        staff_id: this.currentRow.id,
      }).then((res) => {
        if (res.code) {
          this.$message.success("停保成功");
          this.getSocialList(1);
        }
      });
    },
    // 社保备注
    remarkSocial() {
      remarkSocial({
        staff_id: this.currentRow.id,
        remark_string: this.form1.remark_string,
      }).then((res) => {
        if (res.code) {
          this.dialogVisible2 = false;
          this.getSocialList(1);
        }
      });
    },
    editPersonSocial() {
      editPersonSocial({
        ...this.form,
        user_id: this.currentRow.id,
      }).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getSocialList(1);
          this.$message.success("编辑成功");
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