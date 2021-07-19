<template>
  <el-form :model="form" :rules="formRules" ref="form" label-width="400px" class="account_set">
    <el-form-item>
      <el-upload
        class="avatar-uploader"
        action="/api/upFile"
        name="image"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload">
        <img :src="imageUrl" class="avatar">
        <div>上传头像</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="用户名：" prop="username" required>
      <el-input v-model="form.username" disabled />
    </el-form-item>
    <el-form-item label="Email：" prop="email" required>
      <el-input v-model="form.email" disabled></el-input>
    </el-form-item>
    <el-form-item label="旧密码：" prop="password_old" required>
      <el-input v-model="form.password_old"></el-input>
    </el-form-item>
    <el-form-item label="新密码：" prop="password" required>
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="password2" required>
      <el-input v-model="form.password2"></el-input>
    </el-form-item>
    <el-form-item>
      <div class="form-item-btn">
        <el-button type="success" @click="submit">提交</el-button>
      </div>
    </el-form-item>
  </el-form>
</template>

<script>
import { setUser, findLogUser } from '@/api/system.js'
export default {
  data () {
    return {
      form: {
        username: '',
        email: '',
        password_old: '',
        password: '',
        password2: ''
      },
      formRules: {

      },
      imageUrl: ''
    }
  },
  created () {
    this.findLogUser()
  },
  methods: {
    beforeUpload() {
      // console.log('file-=-------', file)
      // this.file = file
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }
      // return isJPG && isLt2M;
    },
    uploadSuccess (res) {
      if (res.code) {
        this.imageUrl = res.data.http
        this.$message.success('上传成功')
      }
    },
    submit () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.password2 !== this.form.password) {
            this.$message.warning('两次密码输入不一致')
            return
          }
          this.setUser()
        }
      })
    },
    // 账户设置
    setUser () {
      let params = {
        ...this.form,
        headimg: this.imageUrl
      }
      setUser(params).then(res => {
        if (res.code) {
          localStorage.removeItem('token')
          this.$message.success('账户修改成功，请重新登录')
          setTimeout(() => {
            this.$router.push('./login')
          }, 100)
        }
      })
    },
    // 查询登录用户
    findLogUser () {
      findLogUser().then(res => {
        if (res.code) {
          this.form.username = res.data.username
          this.form.email = res.data.contact_mail
          this.imageUrl = res.data.headimg
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.account_set {
  padding-top: 30px;
  .avatar-uploader {
    width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }
}
</style>