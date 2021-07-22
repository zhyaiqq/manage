<template>
  <div class="login">
    <div class="main_box">
      <h3 class="title">人力资源数据服务系统</h3>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="username">
          <el-input type="text" v-model="form.username" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="text" v-model="form.password" placeholder="请输入登录密码" />
        </el-form-item>
        <el-form-item prop="verify">
          <div class="verify-box">
            <el-input type="text" v-model="form.verify" placeholder="请输入验证码" />
            <img :src="image" @click="getCode" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm" size="medium">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { generateRoutes } from '@/utils/fn.js'
export default {
  data () {
    return {
      form: {
        username: '',
        password : '',
        verify: ''
      },
      image: '',
      uniqid: '',
      rules: {
        username: { required: true, message: '请输入用户名', trigger: 'change' },
        password: { required: true, message: '请输入密码', trigger: 'change' },
        verify: { required: true, message: '请输入验证码', trigger: 'change' }
      }
    }
  },
  computed: {
    ...mapState("menu", ['defaultAuth']),
  },
  methods: {
    ...mapActions('user', ['getCaptcha', 'login']),
    ...mapActions('company', ['getMenuCompany']),
    ...mapActions("menu", ['getMen']),
    confirm () {
      this.$refs.form.validate(valid => {
        if (valid) this.onLogin()
      })
    },
    onLogin () {
      this.login({
        ...this.form,
        uniqid: this.uniqid
      }).then((res) => {
        if (!res.code) {
          this.getCode()
          return
        }
        localStorage.setItem('token', res.data)
        this.getMenuCompany({company_name: ''}).then(res=> {
          if (res.code && res.data.length > 0) {
            localStorage.setItem('companyId', res.data[0].id)
          }
        })
        this.getMen().then(res => {
          if (res.code && res.data.length > 0) {
            let authRoute = []
            this.defaultAuth && this.defaultAuth.map(item => {
              if (item.url) {
                authRoute.push(item.url)
              }
              switch (item.id) {
                case 130:
                  authRoute.push('/companylist/:id')
                  authRoute.push('/companydetail/:id')
                  break;
                case 178:
                  authRoute.push('/costRecord')
                  break;
                case 217:
                  authRoute.push('/auth')
                  break;  
              }
            })
            if (authRoute.length > 0) {
              localStorage.setItem('authRoute', JSON.stringify(authRoute))
              generateRoutes(this.$router)
              let companyId = localStorage.getItem('companyId')
              let result = authRoute.findIndex(item => item.match(/\/\w+\/:/))
              let result2 = authRoute.findIndex(item => item.match(/^\/\w+$/))
              if (result < result2) {
                if (companyId) {
                  let url = authRoute[result].replace(':id', companyId)
                  this.$router.push(url)
                } else {
                  this.$router.push(authRoute[result2])
                }
              } else {
                this.$router.push(authRoute[result2])
              }
            }
          }
        })
      })
    },
    getCode () {
      this.getCaptcha().then(res => {
        const { image, uniqid } = res.data
        this.image = image
        this.uniqid = uniqid
      })
    }
  },
  created () {
    this.getCode()
  }
}
</script>

<style scoped lang="less">
.login {
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.main_box {
  width: 300px;
  height: 240px;
}
.title {
  text-align: center;
  margin-bottom: 40px;
}
.el-button {
  width: 100%;
  margin-top: 20px;
}
.verify-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.verify-box .el-input {
  width: 150px;
}
</style>
<style>
.verify-box .el-input .el-input__inner {
  width: 150px;
}
</style>