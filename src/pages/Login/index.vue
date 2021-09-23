<template>
  <div class="login">
    <el-card class="main_box">
      <div class="title">
        <img src="../../assets/imgs/logo.png" class="logo" />
        人力资源数据服务系统
      </div>
      <el-form :model="form" ref="form" :rules="rules">
        <el-form-item prop="username">
          <el-input
            type="text"
            v-model="form.username"
            placeholder="请输入用户名称"
            @keyup.enter.native="confirm"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="form.password"
            placeholder="请输入登录密码"
            @keyup.enter.native="confirm"
          />
        </el-form-item>
        <el-form-item prop="verify">
          <div class="verify-box">
            <el-input
              type="text"
              v-model="form.verify"
              placeholder="请输入验证码"
              @keyup.enter.native="confirm"
            />
            <img :src="image" @click="getCode" class="img" />
          </div>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="confirm" size="medium"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { generateRoutes } from "@/utils/fn.js";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        verify: "",
      },
      image: "",
      uniqid: "",
      rules: {
        username: {
          required: true,
          message: "请输入用户名",
          trigger: "change",
        },
        password: { required: true, message: "请输入密码", trigger: "change" },
        verify: { required: true, message: "请输入验证码", trigger: "change" },
      },
    };
  },
  computed: {
    ...mapState("menu", ["defaultAuth"]),
  },
  methods: {
    ...mapActions("user", ["getCaptcha", "login"]),
    ...mapActions("company", ["getMenuCompany"]),
    ...mapActions("menu", ["getMen"]),
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) this.onLogin();
      });
    },
    onLogin() {
      this.login({
        ...this.form,
        uniqid: this.uniqid,
      }).then((res) => {
        if (!res.code) {
          this.getCode();
          return;
        }
        localStorage.setItem("token", res.data);
        this.getMenuCompany({ company_name: "" }).then((res) => {
          if (res.code && res.data.length > 0) {
            localStorage.setItem("companyId", res.data[0].id);
          }
        });
        this.getMen().then((res) => {
          if (res.code && res.data.length > 0) {
            let authRoute = [];
            this.defaultAuth &&
              this.defaultAuth.map((item) => {
                if (item.url) {
                  authRoute.push(item.url);
                }
                switch (item.id) {
                  case 130:
                    authRoute.push("/companylist/:id");
                    authRoute.unshift("/companydetail/:id");
                    break;
                  case 178:
                    authRoute.push("/costRecord");
                    break;
                  case 217:
                    authRoute.push("/auth");
                    break;
                }
              });
            if (authRoute.length > 0) {
              localStorage.setItem("authRoute", JSON.stringify(authRoute));
              generateRoutes(this.$router);
              let companyId = localStorage.getItem("companyId");
              let result = authRoute.findIndex((item) =>
                item.match(/\/\w+\/:/)
              );
              let result2 = authRoute.findIndex((item) =>
                item.match(/^\/\w+$/)
              );
              if (result < result2) {
                if (companyId) {
                  let url = authRoute[result].replace(":id", companyId);
                  this.$router.push(url);
                } else {
                  this.$router.push(`${authRoute[result2]}?id=${companyId}`);
                }
              } else {
                this.$router.push(`${authRoute[result2]}?id=${companyId}`);
              }
            }
          }
        });
      });
    },
    getCode() {
      this.getCaptcha().then((res) => {
        const { image, uniqid } = res.data;
        this.image = image;
        this.uniqid = uniqid;
      });
    },
  },
  created() {
    this.getCode();
  },
};
</script>

<style scoped lang="less">
.login {
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../assets/imgs/bg.png");
  background-color: rgba(0, 121, 254, 1);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .img {
    height: 40px;
  }
}
.title {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
  margin-top: 20px;
  font-size: 24px;
  color: #0079fe;
  font-weight: bold;
  .logo {
    width: 115px;
    height: 115px;
    margin-bottom: 20px;
  }
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
  width: 220px;
}
</style>
<style>
.login .verify-box .el-input .el-input__inner {
  width: 220px;
}
.login .el-form .el-input__inner {
  width: 350px;
}
.login .el-card__body {
  padding: 20px 30px;
}
</style>