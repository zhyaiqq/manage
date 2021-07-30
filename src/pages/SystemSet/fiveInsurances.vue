<template>
  <el-form :model="form" :rules="formRules" ref="form" label-width="100px" style="marginTop: 40px;">
    <el-form-item label="当前五险基数：">
      <span>{{base}}</span>
    </el-form-item>
    <el-form-item label="五险基数：" prop="number">
      <el-input v-model="form.number"></el-input>
      <div class="tip">（每月20号以后不能修改社保基数）</div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setGlobalBase, findGlobalBase } from '@/api/social_insurance.js'
export default {
  data () {
    return {
      form: {
        number: ''
      },
      base: '-',
      formRules: {
        number: { required: true, message: '请输入基数', trigger: 'change' }
      }
    }
  },
  created () {
    this.findGlobalBase()
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.setGlobalBase()
        }
      })
    },
    // 设置五险基数
    setGlobalBase () {
      setGlobalBase({
        base: this.form.number
      }).then(res => {
        if (res.code) {
          this.findGlobalBase()
          this.$message.success('设置成功')
        }
      })
    },
    // 查询五险基数
    findGlobalBase () {
      findGlobalBase().then(res => {
        if (res.code) {
          this.base = res.data
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.tip {
  font-size: 12px;
  color: #606266;
}
</style>