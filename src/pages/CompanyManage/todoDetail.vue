<template>
  <div class="todo_detail">
    <div class="base_info">
      <div class="tag_title1 mb40">员工基础信息</div>
      <el-form
        :model="baseForm"
        :rules="baseFormRules"
        :inline="true"
        label-width="200px"
      >
        <el-form-item label="姓名：" prop="name" required>
          <el-input v-model="baseForm.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="家庭地址：" prop="address" required>
          <el-input v-model="baseForm.address" disabled></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="sex" required>
          <el-select v-model="baseForm.sex" placeholder="请选择" disabled>
            <el-option label="女" :value="0" />
            <el-option label="男" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择身份：" prop="current_type" required>
          <el-select
            v-model="baseForm.current_type"
            placeholder="请选择"
            disabled
          >
            <el-option
              :label="item.name"
              :value="item.id"
              v-for="(item, index) in staffTypeList"
              :key="index"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="年龄：" prop="age" required>
          <el-input v-model="baseForm.age" disabled></el-input>
        </el-form-item>
        <el-form-item label="身份证号码：" prop="card_id" required>
          <el-input v-model="baseForm.card_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="入职日期：" prop="entry_time" required>
          <el-input v-model="baseForm.entry_time" disabled></el-input>
        </el-form-item>
        <el-form-item label="选择社保状态：" prop="is_stop" required>
          <el-select v-model="baseForm.is_stop" placeholder="请选择" disabled>
            <el-option label="参保" :value="1" />
            <el-option label="停保" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择岗位状态：" prop="entry_status" required>
          <el-select
            v-model="baseForm.entry_status"
            placeholder="请选择"
            disabled
          >
            <el-option label="离职" :value="1" />
            <el-option label="在职" :value="2" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="base_info">
      <div class="tag_title1 mb40">
        员工社保信息
      </div>
      <el-form :model="baseForm" :rules="baseFormRules" :inline="true" label-width="200px">
        <el-form-item label="五险基数金额：" prop="company" required>
          <el-input v-model="baseForm.company"></el-input>
        </el-form-item>
        <el-form-item label="公积金基数金额：" prop="address" required>
          <el-input v-model="baseForm.address"></el-input>
        </el-form-item>
        <el-form-item label="五险（个人认缴）：" prop="legal_person" required>
          <el-input v-model="baseForm.legal_person"></el-input>
        </el-form-item>
        <el-form-item label="公积金（公司认缴）：" prop="license" required>
          <el-input v-model="baseForm.license"></el-input>
        </el-form-item>
        <el-form-item label=" 五险（公司认缴）：" prop="charge_person" required>
          <el-input v-model="baseForm.charge_person"></el-input>
        </el-form-item>
        <el-form-item label="公积金（个人认缴）：" prop="tel" required>
          <el-input v-model="baseForm.tel"></el-input>
        </el-form-item>
        <el-form-item label=" 员工基本薪资：" prop="tel" required>
          <el-input v-model="baseForm.tel"></el-input>
        </el-form-item>
        <el-form-item label="员工绩效薪资：" prop="tel" required>
          <el-input v-model="baseForm.tel"></el-input>
        </el-form-item>
      </el-form>
    </div> -->
  </div>
</template>

<script>
import { findExpireStaff } from "@/api/todo.js";
import { mapState } from "vuex";
export default {
  data() {
    return {
      baseForm: {
        company: "",
        address: "",
        legal_person: "",
        charge_person: "",
        current_type: "",
        tel: "",
      },
      baseFormRules: {},
      id: "",
    };
  },
  created() {
    const { id } = this.$route.params;
    this.id = id;
    this.findExpireStaff();
  },
  computed: {
    ...mapState("company", ["staffTypeList"]),
  },
  methods: {
    submit() {},
    // 获取待办事详情
    findExpireStaff() {
      findExpireStaff({
        id: this.id,
      }).then((res) => {
        if (res.code) {
          this.baseForm = res.info;
        }
      });
    },
  },
};
</script>

<style scoped lang="less">
.todo_detail {
  padding-top: 40px;
  // width: 1000px;
  .el-input {
    // width: 250px;
  }
}
.el-form-item__label {
  font-size: 12px;
}
.work .cn {
  margin-top: 20px;
}
.work .cn .title {
  margin-bottom: 30px;
}
.bottom {
  text-align: center;
}
</style>