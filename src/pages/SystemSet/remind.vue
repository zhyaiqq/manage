<template>
  <el-form
    :model="form"
    :rules="formRules"
    ref="form"
    label-width="140px"
    class="remind"
  >
    <el-form-item label="退休提醒（退休前）:" prop="base_retire">
      <el-input v-model="form.base_retire">
        <template slot="append">天</template>
      </el-input>
    </el-form-item>
    <el-form-item label="到期提醒（到期前）:" prop="base_expire">
      <el-input v-model="form.base_expire">
        <template slot="append">天</template>
      </el-input>
    </el-form-item>
    <el-form-item label="开启社保提醒:" prop="is_open_sbremind">
      <el-switch v-model="form.is_open_sbremind"> </el-switch>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { setRemind, getRemind } from "@/api/system.js";
export default {
  data() {
    return {
      form: {
        base_expire: "",
        base_retire: "",
        is_open_sbremind: false,
      },
      formRules: {
        base_expire: {
          required: true,
          message: "请输入退休提醒时间",
          trigger: "change",
        },
        base_retire: {
          required: true,
          message: "请输入到期提醒时间",
          trigger: "change",
        },
      },
    };
  },
  created() {
    this.getRemind();
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.setRemind();
        }
      });
    },
    // 提醒设置
    setRemind() {
      setRemind({
        ...this.form,
        is_open_sbremind: Number(this.form.is_open_sbremind),
      }).then((res) => {
        if (res.code) {
          this.$message.success("设置成功");
        }
      });
    },
    // 查询提醒设置
    getRemind() {
      getRemind().then((res) => {
        if (res.code) {
          this.form.base_expire = res.data.remind_days;
          this.form.base_retire = res.data.remind_days_base_retire;
          this.form.is_open_sbremind =
            res.data.is_open_sbremind == 1 ? true : false;
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.remind {
  margin-top: 40px;
  .el-input-group {
    width: 300px;
  }
}
</style>