<template>
  <div class="company_list">
    <div class="search_top">
      <el-form :inline="true" :model="formInline" class="left">
        <el-form-item>
          <el-input
            v-model="formInline.username"
            placeholder="请输入角色名称"
            @keyup.enter.native="search"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="table-btns">
      <el-button
        type="primary"
        @click="handle(0)"
        v-show="isHasAuth(210)"
        size="small"
        >新增角色</el-button
      >
    </div>
    <el-table
      height="550"
      :data="tableData"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      border
    >
      <el-table-column fixed prop="title" label="角色名称" />
      <el-table-column prop="create_at" label="添加时间" />
      <el-table-column prop="status" label="是否启用">
        <template slot-scope="scope">
          {{ scope.row.status ? "启用" : "禁用" }}
        </template>
      </el-table-column>
      <el-table-column prop="desc" label="描述" />
      <el-table-column width="200px" prop="handle" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="handle(1, scope.row)"
            v-show="isHasAuth(217)"
            >权限设置</el-button
          >
          <el-button
            type="text"
            @click="handle(2, scope.row)"
            v-show="isHasAuth(211)"
            >编辑</el-button
          >
          <el-button
            type="text"
            @click="handle(3, scope.row)"
            v-show="isHasAuth(215)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-size="pageSize"
      :total="pageTotal"
      layout="total, prev, pager, next, jumper"
      background
    >
    </el-pagination>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="40%"
      @closed="closeDialog"
    >
      <el-form :model="form" ref="form" :rules="rules" label-width="100px">
        <el-form-item label="角色名称:" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="职能描述:" prop="describe">
          <el-input type="textarea" v-model="form.describe"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="权限设置"
      :visible.sync="dialogVisible2"
      width="30%"
      @closed="closeDialog"
    >
      <div class="top">当前角色：{{ currentRow && currentRow.title }}</div>
      <el-tree
        ref="tree"
        :data="treeData"
        show-checkbox
        node-key="id"
        :default-checked-keys="treeCheckedKeys"
        @check-change="handleNodeClick"
        :props="defaultProps"
      >
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="updateAuthRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  delRole,
  addRole,
  editRole,
  getRoleAuth,
  updateAuthRole,
} from "@/api/role.js";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      formInline: {
        username: "",
        role_id: "",
      },
      tableData: [],
      multipleSelection: [],
      dialogVisible: false,
      dialogVisible2: false,
      dialogTitle: "新增角色",
      form: {
        name: "",
        describe: "",
      },
      pageTotal: 0,
      pageSize: 10,
      page: 1,
      currentRow: null,
      rules: {
        name: { required: true, message: "请输入角色名称", trigger: "change" },
        describe: {
          required: true,
          message: "请输入职称描述",
          trigger: "change",
        },
      },
      treeData: [],
      defaultProps: {
        children: "child",
        label: "title",
      },
      treeCheckedKeys: [],
    };
  },
  created() {
    this.getRoleList(1);
  },
  computed: {
    ...mapState("menu", ["defaultAuth"]),
  },
  methods: {
    ...mapActions("menu", ["getMen"]),
    handleSelectionChange() {},
    search() {
      this.getRoleList(1);
    },
    handleCurrentChange(page) {
      this.getRoleList(page);
    },
    handle(type, data) {
      switch (type) {
        case 0:
          // 新增角色
          this.dialogVisible = true;
          this.dialogTitle = "新增角色";
          break;
        case 1:
          // 权限设置
          this.currentRow = data;
          // this.$router.push(`/auth?role_id=${data.id}&role_name=${data.title}`);
          this.getRoleAuth(data.id);
          this.dialogVisible2 = true;
          break;
        case 2:
          // 编辑
          this.currentRow = data;
          this.dialogTitle = "编辑角色";
          this.form.name = data.title;
          this.form.describe = data.desc;
          this.dialogVisible = true;
          break;
        case 3:
          // 删除
          this.delRole(data.id);
          break;
      }
    },
    closeDialog() {
      this.form = this.$options.data().form;
      this.$refs.form && this.$refs.form.resetFields();
    },
    confirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.dialogTitle === "新增角色") {
            this.addRole();
          } else {
            this.editRole();
          }
        }
      });
    },
    // 获取角色列表
    getRoleList(page) {
      getRoleList({
        role_name: this.formInline.username,
        page: page,
        page_num: 10,
      }).then((res) => {
        if (res.code) {
          this.tableData = res.data;
          this.pageTotal = res.count;
          this.page = page;
        }
      });
    },
    // 删除角色
    delRole(id) {
      delRole({
        role_id: id,
      }).then((res) => {
        if (res.code) {
          this.getRoleList();
          this.$message.success("删除成功");
        }
      });
    },
    // 新增角色
    addRole() {
      addRole(this.form).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getRoleList();
          this.$message.success("角色新增成功");
        }
      });
    },
    // 编辑角色
    editRole() {
      editRole({
        id: this.currentRow.id,
        ...this.form,
      }).then((res) => {
        if (res.code) {
          this.dialogVisible = false;
          this.getRoleList();
          this.$message.success("角色编辑成功");
        }
      });
    },
    // 获取权限列表
    getRoleAuth(id) {
      getRoleAuth({
        role_id: id,
      }).then((res) => {
        if (res.code) {
          let keys = [];
          this.treeData = res.data;
          res.data.map((item) => {
            if (item.select) keys.push(item.id);
            if (item.child && item.child.length > 0) {
              item.child.map((item2) => {
                if (item2.select) keys.push(item2.id);
                if (item2.child && item2.child.length > 0) {
                  item2.child.map((item3) => {
                    if (item3.select) keys.push(item3.id);
                    if (item3.child && item3.child.length > 0) {
                      item3.child.map((item4) => {
                        if (item4.select) keys.push(item4.id);
                      });
                    }
                  });
                }
              });
            }
          });
          this.treeCheckedKeys = keys;
        }
      });
    },
    // 添加角色权限
    updateAuthRole() {
      updateAuthRole({
        role_id: this.currentRow.id,
        auth_id: this.$refs.tree.getCheckedKeys(),
      }).then((res) => {
        if (res.code) {
          this.dialogVisible2 = false;
          this.getMen();
          this.$message.success("角色权限修改成功");
        }
      });
    },
    isHasAuth(auth_id) {
      return (
        this.defaultAuth && this.defaultAuth.some((item) => item.id == auth_id)
      );
    },
    handleNodeClick(data) {
      console.log(data);
    },
  },
};
</script>

<style scoped>
.company_list .top {
  font-weight: bold;
  margin-bottom: 20px;
}
</style>