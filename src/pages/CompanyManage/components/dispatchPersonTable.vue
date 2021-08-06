<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item label="姓名:" prop="username">
          <el-input v-model="formInline.username" placeholder="请输入姓名" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="状态:" prop="entry_status">
          <el-select v-model="formInline.entry_status" placeholder="请选择" @change="search">
            <el-option label="全部" value="" /> 
            <el-option label="离职" :value="1" /> 
            <el-option label="在职" :value="2" /> 
            <el-option label="半离职" :value="3" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="入职时间:" prop="entryTime">
          <el-date-picker
            @change="search"
            v-model="formInline.entryTime"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同时间:" prop="time">
          <el-date-picker
            @change="search"
            v-model="formInline.time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-btns">
      <el-upload
        style="display:inline-block; margin-right: 10px"
        action="http://rlzypq.samowl.cn/api/excel_staff"
        :data="{'company_id': companyId}"
        name="excel"
        :headers="authorization"
        :show-file-list="false"
        :on-success="uploadPerson">
        <el-button type="primary" v-show="isHasAuth(149)" size="small">导入人员数据</el-button>
      </el-upload>
      <el-button type="primary" @click="handle(1)" v-show="isHasAuth(147)" size="small">新增员工</el-button>
      <el-button type="primary" @click="handle(2)" v-show="isHasAuth(151)" size="small">导出人员数据</el-button>
      <el-button type="primary" @click="handle(6)" v-show="isHasAuth(151)" size="small">下载人员模板</el-button>
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
        width="200px"
        prop="card_id"
        label="身份证号" />
      <el-table-column
        width="100px"
        prop="age"
        label="出生日期" />
      <el-table-column
        width="200px"
        prop="address"
        label="住址" />
      <el-table-column
        prop="department"
        label="部门" />
      <el-table-column
        prop="position"
        label="岗位" />
      <el-table-column
        width="100px"
        prop="entry_time"
        label="入职日期" />
      <el-table-column
        width="200px"
        prop="current_address"
        label="用工所在地" />
      <el-table-column
        prop="contract_type"
        label="合同类型" />
      <el-table-column
        width="120px"
        prop="contract_start_time"
        label="合同开始日期" />
      <el-table-column
        width="120px"
        prop="contract_end_time"
        label="合同结束日期" />
      <el-table-column
        width="300px"
        prop="resume"
        label="简历">
        <template slot-scope="scope">
          <el-button type="text" v-show="!isShowFile(scope.row.resume)" @click="downloadFile(`${scope.row.resume_url}?token=${token}`)">下载文件</el-button>
          <img :src="scope.row.resume_url" style="width: 40px; height: 40px" v-show="isShowFile(scope.row.resume)" />
          <!-- <el-button type="text" v-show="isShowFile(scope.row.resume)" @click="downloadIamge(`${scope.row.report_url}?token=${token}`)">下载</el-button> -->
        </template>
      </el-table-column>
      <el-table-column
        width="300px"
        prop="report"
        label="报名表">
        <template slot-scope="scope">
          <el-button type="text" v-show="!isShowFile(scope.row.report)" @click="downloadFile(`${scope.row.report_url}?token=${token}`)">下载文件</el-button>
          <img :src="scope.row.report_url" style="width: 40px; height: 40px" v-show="isShowFile(scope.row.report)" />
          <!--<el-button type="text" v-show="isShowFile(scope.row.report)" @click="downloadIamge(`${scope.row.report_url}?token=${token}`)">下载</el-button>-->
        </template>
      </el-table-column>
      <el-table-column
        width="300px"
        prop="contract"
        label="合同">
        <template slot-scope="scope">
          <el-button type="text" v-show="!isShowFile(scope.row.contract)" @click="downloadFile(`${scope.row.contract_url}?token=${token}`)">下载文件</el-button>
          <img :src="scope.row.contract_url" style="width: 40px; height: 40px" v-show="isShowFile(scope.row.contract)" />
          <!--<el-button type="text" v-show="isShowFile(scope.row.contract)" @click="downloadIamge(`http://localhost:8084/logo.png`, 'ee')">下载</el-button>-->
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注" />
      <el-table-column
        prop="entry_status"
        label="状态">
        <template slot-scope="scope">
          {{ scope.row.entry_status == 1 ? '离职': (scope.row.entry_status == 2 ?'在职' : '半离职')}}
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
      <div class="mb40">
        员工基础信息
      </div>
      <el-form :model="form" ref="form" :rules="rules1" label-width="200px" :inline="true" :validate-on-rule-change="false">
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="家庭地址:" prop="address">
          <el-input v-model="form.address"/>
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-select v-model="form.sex" placeholder="请选择">
            <el-option label="女" :value="0" /> 
            <el-option label="男" :value="1" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="选择身份:" prop="current_type">
          <el-select v-model="form.current_type" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in staffTypeList" :key="index" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="出生日期:" prop="age">
          <el-date-picker
            v-model="form.age"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="身份证号码:" prop="card_id">
          <el-input v-model="form.card_id"/>
        </el-form-item>
        <el-form-item label="入职日期:" prop="entry_time">
          <el-date-picker
            v-model="form.entry_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态:" prop="entry_status">
          <el-select v-model="form.entry_status" placeholder="请选择">
            <el-option label="离职" :value="1" /> 
            <el-option label="在职" :value="2" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="选择用工公司:" prop="company_id">
          <el-select v-model="form.company_id" placeholder="请选择">
            <el-option :label="item.name" :value="item.id" v-for="(item, index) in companyList" :key="index" /> 
          </el-select> 
        </el-form-item>
        <el-form-item label="合同开始时间:" prop="contract_start_time">
          <el-date-picker
            v-model="form.contract_start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束时间:" prop="contract_end_time">
          <el-date-picker
            v-model="form.contract_end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同类型:" prop="contract_type">
          <el-select v-model="form.contract_type" placeholder="请选择">
            <el-option label="试用合同" value="试用合同" /> 
            <el-option label="正式合同" value="正式合同" /> 
            <el-option label="借调合同" value="借调合同" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="退休年纪:" prop="retire_age">
          <el-input v-model="form.retire_age"/>
        </el-form-item>
      </el-form>
      <div class="mb40">
        员工文档信息
        <!--<span style="fontSize: 12px; color: #f00">（支持上传图片和pdf文件）</span>-->
      </div>
      <el-form :model="form2" ref="form2" :rules="rules2" label-width="200px" :inline="true">
        <el-form-item label="上传简历:" prop="resume">
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            :show-file-list="false"
            name="image"
            :on-success="(res) => uploadSuccess(0, res)"
            :before-upload="uploadResume">
            <div class="upload-success-cn">
              <img :src="resumeFile.http" v-show="isShowFile(form2.resume)" style="width: 100%; height: 100%" />
            </div>
            <div class="upload-text" v-show="form2.resume">{{resumeFile.name}}</div>
            <div>上传简历</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传报名表:" prop="report">
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            name="image"
            :show-file-list="false"
            :on-success="(res) => uploadSuccess(1, res)"
            :before-upload="uploadReport">
            <div class="upload-success-cn">
              <img :src="reportFile.http" v-show="isShowFile(form2.report)" style="width: 100%; height: 100%" />
            </div>
            <div class="upload-text" v-show="form2.report">{{reportFile.name}}</div>
            <div>上传报名表</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="上传合同:" prop="contract">
          <el-upload
            class="avatar-uploader"
            action="http://rlzypq.samowl.cn/api/upFile"
            name="image"
            :show-file-list="false"
            :on-success="(res) => uploadSuccess(2, res)"
            :before-upload="uploadContract">
            <div class="upload-success-cn">
              <img :src="contractFile.http" v-show="isShowFile(form2.contract)" style="width: 100%; height: 100%" />
            </div>
            <div class="upload-text" v-show="form2.contract">{{contractFile.name}}</div>
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
      <el-form :model="form3" ref="form3" :rules="rules3" label-width="100px">
        <el-form-item label="员工:" prop="staff_id">
          {{ currentStaff && currentStaff.name }}
        </el-form-item>
        <el-form-item label="备注信息:" prop="remark_string">
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
      <el-form :model="form4" ref="form4" :rules="rules4" label-width="100px">
        <el-form-item label="离职:" prop="entry_status">
          <el-select v-model="form4.entry_status" placeholder="请选择">
            <el-option label="完全离职" :value="1" /> 
            <el-option label="半离职" :value="3" /> 
          </el-select>
          <div v-show="form4.entry_status == 1">五险一金均已停缴</div>
        </el-form-item>
        <el-form-item label="半离职:" prop="entry_status_list" v-if="form4.entry_status == 3">
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
import { mapState, mapActions } from 'vuex'
import dayjs from 'dayjs'
import bus from '@/utils/bus.js'
export default { 
  data () {
    return {
      formInline: {
        username: '',
        entry_status: '',
        entryTime: '',
        time: ''
      },
      form: {
        'name': '',
        'address': '',
        'age': '',
        'card_id': '',
        'company_id': Number(this.companyId),
        'sex': '',
        'current_type': '',
        'entry_status': '',
        'entry_time': '', 
        'contract_start_time': '', 
        'contract_end_time': '', 
        'contract_type': '',
        'retire_age': ''
      },
      rules1: {
        name: { required: true, message: '请输入姓名', trigger: 'change' },
        address: { required: true, message: '请输入家庭住址', trigger: 'change' },
        age: { required: true, message: '请选择出生日期', trigger: 'change' },
        card_id: { required: true, message: '请输入身份证号', trigger: 'change' },
        company_id: { required: true, message: '请选择公司', trigger: 'change' },
        sex: { required: true, message: '请选择性别', trigger: 'change' },
        current_type: { required: true, message: '请选择身份', trigger: 'change' },
        entry_status: { required: true, message: '请选择状态', trigger: 'change' },
        entry_time: { required: true, message: '请选择入职日期', trigger: 'change' },
        contract_start_time: { required: true, message: '请选择合同开始时间', trigger: 'change' },
        contract_end_time: { required: true, message: '请选择合同结束时间', trigger: 'change' },
        contract_type: { required: true, message: '请选择合同类型', trigger: 'change' },
        retire_age: { required: true, message: '请输入退休年纪', trigger: 'change' },
      },
      form2: {
        resume: '',
        report: '',
        contract: ''
      },
      rules2: {
        resume: { required: true, message: '请上传简历', trigger: 'change' },
        report: { required: true, message: '请上传报名表', trigger: 'change' },
        contract: { required: true, message: '请上传合同', trigger: 'change' }
      },
      form3: {
        staff_id: '',
        remark_string: ''
      },
      rules3: {
        staff_id: { required: true, message: '员工不能为空', trigger: 'change' },
        remark_string: { required: true, message: '请输入备注信息', trigger: 'change' }
      },
      form4: {
        entry_status: '',
        entry_status_list: []
      },
      rules4: {
        entry_status: { required: true, message: '请选择', trigger: 'change' },
        entry_status_list: { required: true, message: '请选择', trigger: 'change' }
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
        http: '',
        name: ''
      },
      reportFile: {
        url: '',
        http: '',
        name: ''
      },
      contractFile: {
        url: '',
        http: '',
        name: ''
      },
      token: localStorage.getItem('token')
    }
  },
  props: ['companyId'],
  created () {
    this.getCompanyList()
    this.getDispatchList(1)
    bus.$on('dispatchPerson', (index) => {
      this.formInline = this.$options.data().formInline
      switch (index) {
        case 1:
          this.formInline.entry_status = 2
          break;
        case 2:
          this.formInline.entryTime = [dayjs().startOf('month').format('YYYY-MM-DD'), dayjs().endOf('month').format('YYYY-MM-DD')]
          break;
        case 3:
          this.formInline.entry_status = 1
          break;
      }
      this.getDispatchList(1)
    });
  },
  computed: {
    ...mapState("menu", ['excellUrls', 'defaultAuth']),
    ...mapState("company", ['staffTypeList'])
  },
  watch: {
    companyId () {
      this.getCompanyList()
      this.getDispatchList(1)
    }
  },
  methods: {
    ...mapActions("menu", ['getNewsNum']),
    handleSelectionChange () {},
    handleCurrentChange (page) {
      this.getDispatchList(page)
    },
    search () {
      this.getDispatchList(1)
    },
    handle (type, data) {
      this.currentStaff = data
      let subjects = ['name', 'address', 'age', 'card_id', 'company_id', 'sex', 'current_type', 'entry_status', 'entry_time', 'contract_start_time', 'contract_end_time', 'contract_type', 'retire_age']
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
              this.form2.resume = res.data.user_info.resume
              this.form2.report = res.data.user_info.report
              this.form2.contract = res.data.user_info.contract
              this.resumeFile.url = res.data.user_info.resume
              this.resumeFile.http = res.data.user_info.resume_url
              this.resumeFile.name = res.data.user_info.resume_name
              this.reportFile.url = res.data.user_info.report
              this.reportFile.http = res.data.user_info.report_url
              this.reportFile.name = res.data.user_info.report_name
              this.contractFile.url = res.data.user_info.contract
              this.contractFile.http = res.data.user_info.contract_url
              this.contractFile.name = res.data.user_info.contract_name
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.form2.validate(valid2 => {
            if (valid2) {
              if (this.dialogTitle === '新增员工') {
                this.addStaff()
              } else {
                this.editStaff()
              } 
            }
          })
        }
      })
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
        this.form2[subject[type]] = res.data.url
        if (type == 0 ) {
          this.resumeFile.url = res.data.url
          this.resumeFile.http = res.data.http
          this.resumeFile.name = res.data.name
        }
        if (type == 1 ) {
          this.reportFile.url = res.data.url
          this.reportFile.http = res.data.http
          this.reportFile.name = res.data.name
        }
        if (type == 2 ) {
          this.contractFile.url = res.data.url
          this.contractFile.http = res.data.http
          this.contractFile.name = res.data.name
        }
        this.$message.success('上传成功')
      } else {
        this.$message.warning(res.info)
      }
    },
    uploadPerson (res) {
      if (res.code) {
        this.getDispatchList(1)
      } else {
        this.$message.warning(res.info)
      }
    },
    isShowFile (url) {
      if (!url) return false
      let type = url.substr(url.indexOf('.') + 1).toLowerCase()
      let arr = ['jpg', 'jpeg', 'png']
      if (arr.find(item => item == type)) {
        return true
      }
      return false
    },
    closeDialog (type) {
      switch (type) {
        case 0:
          this.form = this.$options.data().form
          this.$refs.form.resetFields()
          this.form2 = this.$options.data().form2
          this.$refs.form2.resetFields()
          break;
        case 1:
          this.form3 = this.$options.data().form3
          this.$refs.form3 && this.$refs.form3.resetFields()
          break;
        case 2:
          this.form4 = this.$options.data().form4
          this.$refs.form4 && this.$refs.form4.resetFields()
          break;
      } 
    },
    // 获取派遣人员列表
    getDispatchList (page) {
      let params = {
        ...this.formInline,
        start_entry_time: this.formInline.entryTime ? this.formInline.entryTime[0] : '',
        end_entry_time: this.formInline.entryTime ? this.formInline.entryTime[1] : '',
        contract_start_time: this.formInline.time ? this.formInline.time[0] : '',
        contract_end_time: this.formInline.time ? this.formInline.time[1] : '',
        company_id: this.companyId,
        page: page
      }
      delete params.time
      delete params.entryTime
      getDispatchList(params).then(res => {
        if (res.code) {
          this.tableData = res.data
          this.page = page
          this.pageTotal = res.count
        }
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
        ...this.form,
        ...this.form2
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
        ...this.form2
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
          this.getNewsNum()
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
      // console.log('werwrewr', url)
      // this.$refs.downloadFile.target = '_blank';
      // this.$refs.downloadFile.href = url
      // this.$refs.downloadFile.download = url ? url.substr(url.indexOf('') + 1) : '';
      // this.$refs.downloadFile.click();
      console.log('改了下')
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = name || 'photo'
        a.href = url
        a.dispatchEvent(event)
    },
    isHasAuth (auth_id) {
      return this.defaultAuth && this.defaultAuth.some(item => item.id == auth_id)
    },
    downloadIamge(imgsrc, name) {
      var image = new Image()
      image.crossOrigin = ''
      // image.crossOrigin = 'anonymous'
      image.src = imgsrc
      image.onload = function() {
        var canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        var context = canvas.getContext('2d')
        context.drawImage(image, 0, 0, image.width, image.height)
        var url = canvas.toDataURL('image/png')
        var a = document.createElement('a')
        var event = new MouseEvent('click')
        a.download = name || 'photo'
        a.href = url
        a.dispatchEvent(event)
      }
    }
  }
}
</script>

<style scoped>
.upload-text {
  font-size: 12px;
  width: 100px;
  line-height: 20px;
}
</style>