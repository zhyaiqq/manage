<template>
  <div class="add_company">
    <BaseForm ref="baseComp" type="1" />
    <WorkForm ref="workComp" type="1" />
    <div class="bottom-btn">
      <el-button type="success" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import BaseForm from './components/baseForm.vue'
import WorkForm from './components/workForm.vue'
import { addCompany } from '@/api/company.js'
export default {
  data () {
    return {
    }
  },
  components: { BaseForm, WorkForm },
  methods: {
    submit () {
      this.$refs['baseComp'].$refs.baseForm.validate((valid) => {
        if (valid) {
          this.addCompany()
        }
      })

    },
    // 新增公司
    addCompany () {
      addCompany({
        ...this.$refs['baseComp'].baseForm,
        station: this.$refs['workComp'].jobList,
        remark: ''
      }).then(res => {
        if (res.code) {
          this.$message.success('新增成功')
          this.$router.push('/companylist')
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.add_company {
  padding-top: 30px;
}
.el-input {
  width: 250px;
}
.el-form-item__label {
  font-size: 12px;
}
.title {
  height: 40px;
  width: 200px;
  background: lightblue;
  line-height: 40px;
}
.work .cn {
  margin-top: 20px;
}
.work .cn .title {
  margin-bottom: 30px;
}
</style>