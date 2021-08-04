<template>
  <div class="todo">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item label="状态:" prop="aready">
          <el-select v-model="formInline.aready" placeholder="全部待办" @change="search">
            <el-option label="全部待办" value=""></el-option>
            <el-option label="待处理" value="0"></el-option>
            <el-option label="已处理" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="formInline.username" placeholder="请输入用户名" @keyup.enter.native="search"></el-input>
        </el-form-item>
        <el-form-item label="类型:" prop="type">
          <el-select v-model="formInline.type" placeholder="全部" @change="search">
            <el-option label="全部" value=""></el-option>
            <el-option :label="item" :value="index + 1" v-for="(item, index) in typeList" :key="index"></el-option>
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
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="tableData"
      :header-cell-style="{textAlign: 'center'}"
      :cell-style="{textAlign: 'center'}"
      border>
      <el-table-column
        prop="name_string"
        label="任务名称" />
      <el-table-column
        prop="is_deal"
        label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row && scope.row.is_deal" style="color: #409EFF">已处理</span>
          <span v-else style="color: #3BB19C">待处理</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="类型">
        <template slot-scope="scope">
          {{typeList[scope.row.type - 1]}}
        </template>
      </el-table-column>
      <el-table-column
        prop="deal_time"
        label="更新时间" />
      <el-table-column
        prop="handle"
        label="操作">
        <template slot-scope="scope">
          <!--<el-button type="primary" @click="handle(0, scope.row)">详情</el-button>-->
          <el-button type="text" @click="handle(1, scope.row)" v-show="scope.row && scope.row.is_deal != 1">处理</el-button>
          <el-button type="text" @click="handle(2, scope.row)" v-show="scope.row && scope.row.is_ready == 2">已读</el-button>
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
    <el-dialog
      title="待办事处理"
      :visible.sync="dialogVisible"
      width="30%">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="任务名称:" prop="id">
          {{this.currentRow && this.currentRow.name}}
        </el-form-item>
        <el-form-item label="处理结果:" prop="type">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option label="直接结束" :value="2" /> 
            <el-option label="续期" :value="1" /> 
          </el-select>
        </el-form-item>
        <el-form-item label="合同开始时间:" prop="contract_start_time" v-if="this.form.type == 1">
          <el-date-picker
            v-model="form.contract_start_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同结束时间:" prop="contract_end_time" v-if="this.form.type == 1">
          <el-date-picker
            v-model="form.contract_end_time"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="选择日期">
          </el-date-picker>
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
import { getExpire, dealExpire, dealRead } from  '@/api/todo.js'
import { mapActions } from 'vuex'
import bus from '@/utils/bus.js'
export default {
  data () {
    return {
      formInline: {
        aready: '',
        username: '',
        type: '',
        time: ''
      },
      form: {
        id: '',
        type: 2,
        contract_start_time: '',
        contract_end_time: ''

      },
      rules: {
        id: { required: true, message: '任务名称不能为空', trigger: 'change' },
        type: { required: true, message: '请选择处理结果', trigger: 'change' },
        contract_start_time: { required: true, message: '请选择合同开始时间', trigger: 'change' },
        contract_end_time: { required: true, message: '请选择合同结束时间', trigger: 'change' },
      },
      tableData: [],
      pageTotal: 0,
      pageSize: 10,
      page: 1,
      currentRow: null,
      dialogVisible: false,
      typeList: ['合同到期', '退休', '入职', '离职', '停保', '参保']
    }
  },
  created () {
    let { type } = this.$route.params
    if (type) this.formInline.type = type
    this.getExpire(1)
    bus.$on('currentType', (value) => {
      this.formInline.type = value
      this.getExpire(1)
    })
  },
  methods: {
    ...mapActions("menu", ['getNewsNum']),
    handle (type, data) {
      switch (type) {
        case 0:
          this.$router.push(`/todolist/${data.id}`)
          break;
        case 1:
          this.form.id = data.id
          this.currentRow = data
          this.dialogVisible = true
          break;
        case 2: 
          // 已读
          dealRead({id: data.id}).then(res => {
            if (res.code) {
              this.getExpire(this.page)
              this.getNewsNum()
            }
          })
      }
    },
    search () {
      this.getExpire(1)
    },
    handleCurrentChange (page) {
      this.getExpire(page)
    },
    confirm () {
      this.$refs.form.validate((valid) => {
        if (valid) this.dealExpire()
      })
    },
    // 获取待办事情列表
    getExpire (page) {
      let params = {
        username: this.formInline.username,
        aready: this.formInline.aready,
        type: this.formInline.type,
        start_deal_time: this.formInline.time ? this.formInline.time[0] : '',
        end_deal_time: this.formInline.time ? this.formInline.time[1] : '',
      }
      if (params.aready == '') delete params.aready
      getExpire({
        ...params,
        page: page,
        page_num: 10
      }).then(res => {
        this.tableData = res.data
        this.pageTotal = res.count
        this.page = page
      })
    },
    // 代办事情处理
    dealExpire () {
      let params = this.form
      if (this.form.type == 2) {
        delete params.contract_end_time
        delete params.contract_start_time
      }
      dealExpire(this.form).then(res => {
        if (res.code) {
          this.dialogVisible = false
          this.getExpire(this.page)
          this.getNewsNum()
          this.$message.success('处理成功')
        }
      })
    }
  }
}
</script>