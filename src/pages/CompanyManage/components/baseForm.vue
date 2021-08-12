<template>
  <el-card class="box-card" style="margin: 15px 0;">
    <div slot="header" class="clearfix">
      <span>{{ title }} </span>
    </div>
    <el-form :model="baseForm" :rules="baseFormRules" ref="baseForm" label-width="100px">
      <el-form-item label="公司名称：" prop="name">
        <el-input v-model="baseForm.name" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="公司地址：" prop="address">
        <el-input v-model="baseForm.address" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="公司法人：" prop="corporation">
        <el-input v-model="baseForm.corporation" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="营业执照：" prop="business">
        <div class="upload-success-cn" v-if="type != 1">
          <img :src="file.http" v-show="isShowFile(baseForm.business)" style="width: 100%; height: 100%" />
          <div class="upload-name">{{file.name}}</div>
        </div>
        <el-upload
          v-else
          action="http://rlzypq.samowl.cn/api/upFile"
          :show-file-list="false"
          name="image"
          :on-success="uploadSuccess">
          <div class="upload-success-cn">
            <img :src="file.http" v-show="isShowFile(baseForm.business)" style="width: 100%; height: 100%" />
            <div class="upload-name">{{file.name}}</div>
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="负责人：" prop="charge_person">
        <el-input v-model="baseForm.charge_person" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="负责人电话：" prop="tel">
        <el-input v-model="baseForm.tel" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="发薪日期：" prop="cost_time">
        <el-input-number v-model="baseForm.cost_time" @change="handleChange" :min="1" :max="30" :disabled="type != 1" />
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      baseForm: {
        name: '',
        address: '',
        corporation: '',
        charge_person: '',
        business: '',
        tel: '',
        cost_time: 15
      },
      baseFormRules: {
        name: { required: true, message: '请输入公司名称', trigger: 'change' },
        address: { required: true, message: '请输入公司地址', trigger: 'change' },
        corporation: { required: true, message: '请输入公司法人', trigger: 'change' },
        charge_person: { required: true, message: '请上传营业执照', trigger: 'change' },
        business: { required: true, message: '请输入负责人', trigger: 'change' },
        tel: { required: true, message: '请输入负责人电话', trigger: 'change' },
        cost_time: { required: true, message: '请输入发薪日期', trigger: 'change' },
      },
      file: {
        url: '',
        http: '',
        name: ''
      },
      title: '公司基础信息新增'
    }
  },
  props: ['type', 'formData'],
  watch: {
    formData () {
      this.baseForm = this.formData
      this.file.url = this.formData.business
      this.file.http = this.formData.business_url
      this.file.name = this.formData.business_name
      this.title = this.baseForm.name ? (this.type != 1 ? '公司基础信息' : '公司基础信息编辑' ) : '公司基础信息新增'
    }
  },
  methods: {
    handleChange (value) {
      this.baseForm.cost_time = value
    },
    uploadSuccess (res) {
      if (res.code) {
        this.baseForm.business = res.data.url
        this.file.url = res.data.url
        this.file.http = res.data.http
        this.file.name = res.data.name
        this.$message.success('上传成功')
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
  }
}
</script>

<style lang="less" scoped>
  .el-input-number {
    width: 300px;
  }
</style>