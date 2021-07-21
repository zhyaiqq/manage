<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-input v-model="formInline.username" placeholder="请输入姓名" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="right">
        <el-upload
          style="display:inline-block; margin-right: 20px"
          action="http://rlzypq.samowl.cn/api/excel_staff"
          :data="{'company_id': companyId}"
          name="excel"
          :headers="authorization"
          :show-file-list="false">
          <el-button type="primary" v-show="isHasAuth(149)">导入人员数据</el-button>
        </el-upload>
        <el-button type="primary" @click="handle(1)" v-show="isHasAuth(147)">新增员工</el-button>
        <el-button type="primary" @click="handle(2)" v-show="isHasAuth(151)">导出人员数据</el-button>
        <el-button type="primary" @click="handle(6)" v-show="isHasAuth(151)">下载人员模板</el-button>
      </div>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名" />
      <el-table-column
        prop="sex"
        label="性别">
        <template slot-scope="scope">
          {{ scope.row && scope.row.sex ? '男': '女' }}
        </template>
      </el-table-column>
      <el-table-column
        prop="card_id"
        label="身份证号" />
      <el-table-column
        prop="age"
        label="出生日期" />
      <el-table-column
        prop="address"
        label="住址" />
      <el-table-column
        prop="entry_time"
        label="入职日期" />
      <el-table-column
        prop="entry_status"
        label="用工所在地" />
      <el-table-column
        prop="entry_status"
        label="合同类型" />
      <el-table-column
        prop="contract_start_time"
        label="合同起始日期" />
      <el-table-column
        prop="contract_start_time"
        label="合同结束日期" />
      <el-table-column
        prop="remark"
        label="备注" />
      <el-table-column
        prop="entry_status"
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.entry_status == 1 ? '离职': '在职'}}
        </template>
      </el-table-column>
      <el-table-column
        width="150px"
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="handle(3, scope.row)" v-show="isHasAuth(141)">编辑</el-button>
          <el-button type="text" @click="handle(4, scope.row)" v-show="isHasAuth(142)">备注</el-button>
          <el-button type="text" @click="handle(5, scope.row)" v-show="isHasAuth(143)">
            {{scope.row && scope.row.entry_status == 2 ? '离职' : '在职'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="pageTotal"
      layout="total, prev, pager, next, jumper"
      background>
    </el-pagination>
    <a ref="downloadFile"></a>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="70%"
      @closed="closeDialog(0)">
      <div class="tag_title1 mb40">
        员工基础信息
      </div>
      <el-form :model="form" ref="form" :rules="rules" label-width="200px" :inline="true" :validate-on-rule-change="false">
        <el-form-item label="姓名:" prop="name" required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="家庭地址:" prop="address" required>
          <el-input v-model="form.address"/>
        </el-form-item>
        <el-form-item label="性别:" prop="sex" required>
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option label="女" :value="0" /> 
            <el-option label="男" :value="1" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="选择身份:" prop="current_type" required>
          <el-select v-model="form.current_type" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in staffTypeList" :key="index" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期:" prop="age" required>
          <el-date-picker
            v-model="form.age"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号码:" prop="card_id" required>
          <el-input v-model="form.card_id"/>
        </el-form-item>
        <el-form-item label="入职日期:" prop="entry_time" required>
          <el-date-picker
            v-model="form.entry_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态:" prop="entry_status" required>
          <el-select v-model="form.entry_status" placeholder="请选择">
            <el-option label="离职" :value="1" /> 
            <el-option label="在职" :value="2" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="选择用工公司:" prop="company_id" required>
          <el-select v-model="form.company_id" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in companyList" :key="index" /> 
          </el-select> 
        </el-form-item>
        <el-form-item label="合同开始时间:" prop="contract_start_time" required>
          <el-date-picker
            v-model="form.contract_start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束时间:" prop="contract_end_time" required>
          <el-date-picker
            v-model="form.contract_end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退休年纪:" prop="retire_age" required>
          <el-input v-model="form.retire_age"/>
        </el-form-item>
      </el-form>
      <div class="tag_title1 mb40">
        员工文档信息
      </div>
      <el-form :model="form2" ref="form2" label-width="200px" :inline="true">
        <el-form-item label="上传简历:" prop="resume" required>
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            :show-file-list="false"
            name="image"
            :on-success="(res) => uploadSuccess(0, res)"
            :before-upload="uploadResume">
            <div class="upload-success-cn">
              <img :src="resumeFile.http" v-show="form2.resume" style="width: 100%; height: 100%" />
            </div>
            <div>上传简历</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传报名表:" prop="report" required>
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            name="image"
            :show-file-list="false"
            :on-success="(res) => uploadSuccess(1, res)"
            :before-upload="uploadReport">
            <div class="upload-success-cn">
              <img :src="reportFile.http" v-show="form2.report" style="width: 100%; height: 100%" />
            </div>
            <div>上传报名表</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传合同:" prop="contract" required>
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            name="image"
            :show-file-list="false"
            :on-success="(res) => uploadSuccess(2, res)"
            :before-upload="uploadContract">
            <div class="upload-success-cn">
              <img :src="contractFile.http" v-show="form2.contract" style="width: 100%; height: 100%" />
            </div>
            <div>上传合同</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="员工备注"
      :visible.sync="dialogVisible2"
      width="30%"
      @closed="closeDialog(1)">
      <el-form :model="form3" ref="form3" label-width="100px">
        <el-form-item label="员工:" prop="staff_id" required>
          {{ currentStaff && currentStaff.name }}
        </el-form-item>
        <el-form-item label="备注信息:" prop="remark_string" required>
          <el-input type="textarea" v-model="form3.remark_string"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="staffRemark">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="员工离职"
      :visible.sync="dialogVisible3"
      width="30%"
      @closed="closeDialog(2)">
      <el-form :model="form4" ref="form4" label-width="100px">
        <el-form-item label="离职:" prop="entry_status" required>
          <el-select v-model="form4.entry_status" placeholder="请选择">
            <el-option label="完全离职" :value="1" /> 
            <el-option label="半离职" :value="3" /> 
          </el-select>
          <div v-show="form4.entry_status == 1">五险一金均已停缴</div>
        </el-form-item>
        <el-form-item label="半离职:" prop="entry_status_list" required v-if="form4.entry_status == 3">
         <el-checkbox-group v-model="form4.entry_status_list">
            <el-checkbox :label="1">五险在缴</el-checkbox>
            <el-checkbox :label="2">公积金在缴</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3 = false">取 消</el-button>
        <el-button type="primary" @click="quitConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getDispatchList, addStaff, staffQuit, staffRemark, editStaff, getStaffDetail } from '@/api/staff.js'
import { getCompanyList } from '@/api/company.js'
import { mapState } from 'vuex'
export default { 
  data () {
    return {
      formInline: {
        username: ''
      },
      form: {
        'name': '',
        'address': '',
        'age': '',
        'card_id': '',
        'company_id': '',
        'sex': '',
        'current_type': '',
        'entry_status': '',
        'entry_time': '', 
        'contract_start_time': '', 
        'contract_end_time': '', 
        'retire_age': ''
      },
      rules: {
        name: [
          { required: true, message: '请输入习惯名', trigger: 'blur' },
        ]
      },
      form2: {
        resume: '',
        report: '',
        contract: ''
      },
      form3: {
        staff_id: '',
        remark_string: ''
      },
      form4: {
        entry_status: '',
        entry_status_list: []
      },
      companyList: [],
      tableData: [],
      multipleSelection: [],
      page: 1,
      pageSize: 10,
      pageTotal: 0,
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      currentStaff: null,
      dialogTitle: '新增员工',
      authorization: { 'Authorization': localStorage.getItem('token') },
      resumeFile: {
        url: '',
        http: ''
      },
      reportFile: {
        url: '',
        http: ''
      },
      contractFile: {
        url: '',
        http: ''
      }
    }
  },
  props: ['companyId'],
  created () {
    this.getCompanyList()
    this.getDispatchList(1)
  },
  computed: {
    ...mapState("menu", ['excellUrls', 'defaultAuth']),
    ...mapState("company", ['staffTypeList'])
  },
  methods: {
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getDispatchList(page)
    },
    search () {
      this.getDispatchList(1)
    },
    handle (type, data) {
      this.currentStaff = data
      let subjects = ['name', 'address', 'age', 'card_id', 'company_id', 'sex', 'current_type', 'entry_status', 'entry_time', 'contract_start_time', 'contract_end_time', 'retire_age']
      switch (type) {
        case 0:
          // 导入派遣人员数据
          break;
        case 1: 
          // 新增员工
          this.dialogTitle = '新增员工'
          this.dialogVisible = true
          break;
        case 2:
          this.downloadFile(`http://rlzypq.samowl.cn/api/getDispatchListExcel?company_id=${this.companyId}&username=${this.formInline.username}&token=${localStorage.getItem('token')}`)
          break;
        case 3:
          // 编辑
          getStaffDetail(this.currentStaff.id).then(res => {
            if (res.code) {
              for (let i = 0; i < subjects.length; i++) {
                this.form[subjects[i]] = res.data.user_info[subjects[i]]
              }
              console.log('eeeeeeeeeeeeeeeeeee22', this.form)
              this.form2.resume = res.data.user_info.resume
              this.form2.report = res.data.user_info.report
              this.form2.contract = res.data.user_info.contract
              this.resumeFile.url = res.data.user_info.resume
              this.resumeFile.http = res.data.user_info.resume_url
              this.reportFile.url = res.data.user_info.report
              this.reportFile.http = res.data.user_info.report_url
              this.contractFile.url = res.data.user_info.contract
              this.contractFile.http = res.data.user_info.contract_url
              this.dialogTitle = '编辑员工'
              this.dialogVisible = true
            }
          })
          break;
        case 4:
          // 备注
          this.form3.staff_id = data.id
          if (data.remark) this.form3.remark_string = data.remark
          this.dialogVisible2 = true
          break;
        case 5: 
          if (data.entry_status == 2) {
            // 离职
            this.dialogVisible3 = true
          } else {
            // 在职
            this.staffQuit({
              staff_id: this.currentStaff.id,
              entry_status: 2
            })
          }
          break;
        case 6:
          // 下载人员模板
          this.downloadFile(this.excellUrls.staff)
          break;
      }
    },
    confirm () {
      if (this.dialogTitle === '新增员工') {
        this.$refs.form.validate((valid) => {
          if (valid) this.addStaff()
        })
      } else {
        this.editStaff()
      }
    },
    quitConfirm () {
      console.log(this.form4)
      let params = {
        staff_id: this.currentStaff.id,
        ...this.form4
      }
      this.$refs.form4.validate((valid) => {
        if (valid) {
          this.staffQuit(params)
        }
      })
    },
    uploadResume () {
    },
    // 上传报名单
    uploadReport () {
    },
    // 上传合同
    uploadContract () {
    },
    uploadSuccess (type, res) {
      if (res.code) {
        let subject = ['resume', 'report', 'contract']
        this.form[subject[type]] = res.data.url
        if (type == 0 ) {
          this.resumeFile.url = res.data.url
          this.resumeFile.http = res.data.http
        }
        if (type == 1 ) {
          this.reportFile.url = res.data.url
          this.reportFile.http = res.data.http
        }
        if (type == 2 ) {
          this.contractFile.url = res.data.url
          this.contractFile.http = res.data.http
        }
        this.$message.success('上传成功')
      } else {
        this.$message.warning(res.info)
      }
    },
    closeDialog (type) {
      console.log('dddd', type)
      if (type) {
        this.form3 = this.$options.data().form3
        this.$refs.form3 && this.$refs.form3.resetFields()
        return
      }
      this.form = this.$options.data().form
      this.$refs.form.resetFields()
    },
    // 获取派遣人员列表
    getDispatchList (page) {
      getDispatchList({
        username: this.formInline.username,
        company_id: this.companyId,
        page: page
      }).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.page = page
          this.pageTotal = res.count
        }
        ('获取派遣人员列表', res)
      })
    },
    // 获取公司列表
    getCompanyList () {
      getCompanyList({
        page: 1,
        page_num: 1000
      }).then(res => {
        if (res.code) this.companyList = res.data
      })
    },
    // 新增员工
    addStaff () {
      addStaff({
        ...this.form
      }).then(res => {
        if (res.code) {
          this.getDispatchList(1)
          this.dialogVisible = false
          this.$message.success('新增成功')
        }
      })
    },
    // 编辑员工
    editStaff () {
      editStaff({
        id: this.currentStaff.id,
        ...this.form,
        ...this.from2
      }).then(res => {
        if (res.code) {
          this.getDispatchList(this.page)
          this.dialogVisible = false
          this.$message.success('编辑成功')
        }
      })
    },
    // 员工离职
    staffQuit (params) {
      staffQuit (params).then(res => {
        if (res.code) {
          this.dialogVisible3 = false
          this.getDispatchList(this.page)
          this.$message.success('操作成功')
        }
      })
    },
    // 员工备注
    staffRemark() {
      staffRemark({
        ...this.form3
      }).then(res => {
        if (res.code) {
          this.getDispatchList(this.page)
          this.dialogVisible2 = false
          this.$message.success('操作成功')
        }
      })
    },
    downloadFile (url) {
      this.$refs.downloadFile.target = '_blank';
      this.$refs.downloadFile.href = url
      this.$refs.downloadFile.click();
    },
    isHasAuth (auth_id) {
      return this.defaultAuth && this.defaultAuth.some(item => item.id == auth_id)
    }
  }
}
</script>

<style scoped>

</style>