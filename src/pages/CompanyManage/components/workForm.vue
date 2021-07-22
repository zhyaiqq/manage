<template>
  <div class="work_form">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>公司岗位需求编辑</span>
      </div>
      <el-card class="box-card-item" v-for="(item, index) in jobList" :key="index">
        <div slot="header" class="clearfix">
          <span>岗位{{index + 1}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="deleteJob(index)" v-show="type == 1 && jobList.length > 1">删除岗位</el-button>
        </div>
        <el-form :model="item" :rules="workFormRules" :ref="'workForm' + index" label-width="100px">
          <el-form-item label="岗位名称：" prop="name">
            <el-input v-model="item.name" :disabled="type != 1" />
          </el-form-item>
          <el-form-item label="岗位要求：" prop="ask">
            <el-input v-model="item.ask" :disabled="type != 1" />
          </el-form-item>
          <el-form-item label="工资待遇：" prop="treatment">
            <el-input v-model="item.treatment" :disabled="type != 1" />
          </el-form-item>
        </el-form>
      </el-card>
      <div @click="addJob" class="add" v-show="type == 1">
        <i class="el-icon-circle-plus-outline"></i>
        岗位需求
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      workForm: {
        name: '',
        ask: '',
        treatment: ''
      },
      workFormRules: {
        name: { required: true, message: '请输入岗位名称', trigger: 'change' },
        ask: { required: true, message: '请输入岗位要求', trigger: 'change' },
        treatment: { required: true, message: '请输入工资待遇', trigger: 'change' }
      },
      jobList: [
        {
          name: '',
          ask: '',
          treatment: ''
        }
      ]
    }
  },
  props: ['type', 'formData'],
  watch: {
    formData () {
      this.jobList = this.formData
    }
  },
  methods: {
    addJob () {
      this.jobList.push({
        name: '',
        ask: '',
        treatment: ''
      })
    },
    deleteJob (index) {
      this.jobList.splice(index, 1)
    },
    async validate ()  {
      let flag = true
      for (let i = 0; i < this.jobList.length; i++) {
        let result = await this.$refs.baseForm.validate()
        console.log('value====================')
        if (!result) { 
          flag = result
          return flag
        }
      }
      return flag
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/common.less';
.work_form {
  .title {
    font-weight: bold;
  }
  .box-card {
    margin: 15px 0;
  }
  .box-card-item {
    width: 700px;
    margin-bottom: 15px;
  }
  .add {
    padding-left: 100px;
    font-size: 14px;
    color: @primaryColor2;
    cursor: pointer;
    i {
      font-size: 18px;
      vertical-align: middle;
    }
  }
  .delete {
    position: absolute;
    top: 20px;
    left: 800px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>