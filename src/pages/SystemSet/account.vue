<template>
  <el-form
    :model="form"
    :rules="formRules"
    ref="form"
    label-width="100px"
    class="account_set"
  >
    <el-form-item>
      <el-upload
        class="avatar-uploader"
        action="http://rlzypq.samowl.cn/api/upFile"
        name="image"
        :show-file-list="false"
        :on-success="uploadSuccess"
        :before-upload="beforeUpload"
      >
        <img :src="imageUrl" class="avatar" />
        <div>上传头像</div>
      </el-upload>
    </el-form-item>
    <el-form-item label="用户名：" prop="username">
      <el-input v-model="form.username" disabled />
    </el-form-item>
    <el-form-item label="Email：" prop="email">
      <el-input v-model="form.email"></el-input>
    </el-form-item>
    <el-form-item label="旧密码：" prop="password_old">
      <el-input v-model="form.password_old"></el-input>
    </el-form-item>
    <el-form-item label="新密码：" prop="password">
      <el-input v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码：" prop="password2">
      <el-input v-model="form.password2"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setUser, findLogUser } from "@/api/system.js";
export default {
  data() {
    return {
      form: {
        username: "",
        email: "",
        password_old: "",
        password: "",
        password2: "",
      },
      formRules: {
        username: {
          required: true,
          message: "请输入用户名",
          trigger: "change",
        },
        email: { required: true, message: "请输入邮箱", trigger: "change" },
        password_old: {
          required: true,
          message: "请输入原始密码",
          trigger: "change",
        },
        password: {
          required: true,
          message: "请输入新密码",
          trigger: "change",
        },
        password2: { required: true, message: "请确认密码", trigger: "change" },
      },
      imageUrl: "",
    };
  },
  created() {
    this.findLogUser();
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
    uploadSuccess(res) {
      if (res.code) {
        this.imageUrl = res.data.http;
        this.$message.success("上传成功");
      } else {
        this.$message.warning(res.info);
      }
    },
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.password2 !== this.form.password) {
            this.$message.warning("两次密码输入不一致");
            return;
          }
          this.setUser();
        }
      });
    },
    // 账户设置
    setUser() {
      let params = {
        ...this.form,
        headimg: this.imageUrl,
      };
      setUser(params).then((res) => {
        if (res.code) {
          localStorage.removeItem("token");
          localStorage.removeItem("authRoute");
          localStorage.removeItem("companyId");
          this.$message.success("账户修改成功，请重新登录");
          setTimeout(() => {
            this.$router.push("./login");
          }, 100);
        }
      });
    },
    // 查询登录用户
    findLogUser() {
      findLogUser().then((res) => {
        if (res.code) {
          this.form.username = res.data.username;
          this.form.email = res.data.contact_mail;
          this.imageUrl = res.data.headimg;
        }
      });
    },
  },
};
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