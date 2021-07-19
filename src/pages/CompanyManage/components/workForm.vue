<template>
  <div class="work">
    <div class="tag_title1">
      公司岗位需求编辑
    </div>
    <div class="cn" v-for="(item, index) in jobList" :key="index">
      <div class="tag_title2">
        岗位{{index + 1}}
      </div>
      <el-form :model="item" :rules="workFormRules" :ref="'workForm' + index" label-width="400px">
        <el-form-item label="岗位名称：" prop="name" required>
          <el-input v-model="item.name" :disabled="type != 1" />
        </el-form-item>
        <el-form-item label="岗位要求：" prop="ask" required>
          <el-input v-model="item.ask" :disabled="type != 1" />
        </el-form-item>
        <el-form-item label="工资待遇：" prop="treatment" required>
          <el-input v-model="item.treatment" :disabled="type != 1" />
        </el-form-item>
      </el-form>
    </div>
    <div @click="addJob" class="add" v-show="type == 1">
      <i class="el-icon-circle-plus-outline"></i>
      岗位需求
    </div>
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
      workFormRules: {},
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
      this.jobList.push(this.workForm)
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
.cn {
  padding-top: 60px;
  .add {
    padding-left: 400px;
    font-size: 14px;
    color: @primaryColor2;
    cursor: pointer;
    i {
      font-size: 18px;
      vertical-align: middle;
    }
  }
}
</style>