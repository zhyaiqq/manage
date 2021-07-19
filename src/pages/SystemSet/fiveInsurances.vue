<template>
  <el-form :model="form" :rules="formRules" ref="form" label-width="400px" style="marginTop: 40px;">
    <el-form-item label="五险基数：" prop="number" required>
      <el-input v-model="form.number"></el-input>
      <div class="tip">（每月20号以后不能修改社保基数）</div>
    </el-form-item>
    <el-form-item>
      <div class="form-item-btn">
        <el-button type="success" @click="submit">提交</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { setGlobalBase } from '@/api/social_insurance.js'
export default {
  data () {
    return {
      form: {
        number: ''
      },
      formRules: {

      }
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.setGlobalBase()
        }
      })
    },
    setGlobalBase () {
      setGlobalBase({
        base: this.form.number
      }).then(res => {
        if (res.code) {
          this.$message.success('设置成功')
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