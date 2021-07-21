<template>
  <div class="base_info">
    <div class="tag_title1">
      公司基础信息新增
    </div>
    <el-form :model="baseForm" :rules="baseFormRules" ref="baseForm" label-width="400px">
      <el-form-item label="公司名称：" prop="name" required>
        <el-input v-model="baseForm.name" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="公司地址：" prop="address" required>
        <el-input v-model="baseForm.address" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="公司法人：" prop="corporation" required>
        <el-input v-model="baseForm.corporation" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="营业执照：" prop="business" required>
        <div class="upload-success-cn" v-if="type != 1">
          <img :src="file.http" v-show="baseForm.business" style="width: 100%; height: 100%" />
        </div>
        <el-upload
          v-else
          action="http://rlzypq.samowl.cn/api/upFile"
          :show-file-list="false"
          name="image"
          :on-success="uploadSuccess">
          <div class="upload-success-cn">
            <img :src="file.http" v-show="baseForm.business" style="width: 100%; height: 100%" />
          </div>
        </el-upload>
      </el-form-item>
      <el-form-item label="负责人：" prop="charge_person" required>
        <el-input v-model="baseForm.charge_person" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="负责人电话：" prop="tel" required>
        <el-input v-model="baseForm.tel" :disabled="type != 1" />
      </el-form-item>
      <el-form-item label="发薪日期：" prop="cost_time" required>
        <el-input v-model="baseForm.cost_time" :disabled="type != 1" />
      </el-form-item>
    </el-form>
  </div>
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
        cost_time: ''
      },
      baseFormRules: {},
      file: {
        url: '',
        http: ''
      }
    }
  },
  props: ['type', 'formData'],
  watch: {
    formData () {
      this.baseForm = this.formData
      this.file.url = this.formData.business
      this.file.http = this.formData.business_url
    }
  },
  methods: {
    uploadSuccess (res) {
      if (res.code) {
        this.baseForm.business = res.data.url
        this.file.url = res.data.url
        this.file.http = res.data.http
        this.$message.success('上传成功')
      } else {
        this.$message.warning(res.info)
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>