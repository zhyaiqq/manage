<template>
  <el-form :model="form" :rules="formRules" ref="form" label-width="400px" style="marginTop: 40px;">
    <el-form-item label="退休提醒（退休前）:" prop="base_retire" required>
      <el-input v-model="form.base_retire"></el-input>
    </el-form-item>
    <el-form-item label="到期提醒（到期前）:" prop="base_expire" required>
      <el-input v-model="form.base_expire"></el-input>
    </el-form-item>
    <el-form-item>
      <div class="form-item-btn">
        <el-button type="success" @click="submit">提交</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { setRemind } from '@/api/system.js'
export default {
  data () {
    return {
      form: {
        base_expire: '',
        base_retire: ''
      },
      formRules: {}
    }
  },
  methods: {
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.setRemind()
        }
      })
    },
    setRemind () {
      setRemind({
        ...this.form
      }).then(res => {
        if (res.code) {
          this.$message.success('设置成功')
        }
      })
    }
  }
}
</script>