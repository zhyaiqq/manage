<template>
  <div class="layout">
    <div class="header">
      <div class="header_left">
        <img src="../assets/imgs/logo.svg" class="logo" />
        <h2>人力数据系统</h2>
      </div>
      <div class="header_right">
        <div>{{ userInfo && userInfo.username }}</div>
        <el-dropdown>
          <span class="message">
            <img src="../assets/imgs/info.png" class="message_icon" />
            <div class="count" v-show="todoCount > 0">{{ todoCount }}</div>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in Object.keys(todo)"
              :key="index"
            >
              <div
                @click="goTodoList(item)"
                style="
                  padding: 10px;
                  display: flex;
                  alignitems: center;
                  justifycontent: space-between;
                  width: 150px;
                "
              >
                <span>{{ todoObj[item] }}</span>
                <span>({{ todo[item] }})</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!-- <div class="message" @click="jump(1, { url: '/todolist' })">
          <img src="../assets/imgs/info.png" class="message_icon" />
          <div class="count" v-show="todoCount > 0">{{todoCount}}</div>
        </div> -->
        <div class="right_btn" @click="onLogout">退出登录</div>
      </div>
    </div>
    <div class="cn">
      <div class="left">
        <el-menu
          :default-active="menuActive"
          :default-openeds="openMenus"
          active-text-color="#269cff"
          class="left_menu"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-submenu index="0" key="0" class="layout_company">
            <div class="company">用工公司</div>
            <div class="company_menu">
              <el-input
                v-model="company"
                placeholder="搜索公司"
                @input="search"
              />
              <el-menu-item
                @click="jump(0, item1)"
                :index="String(item1.id)"
                v-for="(item1, index) in menuCompanyList"
                :key="index"
              >
                {{ item1.name }}
              </el-menu-item>
            </div>
          </el-submenu>
          <el-submenu
            :index="String(item.id)"
            v-for="(item, i) in menuList"
            :key="i + 1"
          >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ item.title }}</span>
            </template>
            <el-menu-item
              @click="jump(1, item1)"
              :index="String(item1.id)"
              v-for="(item1, index) in item.child"
              :key="index"
            >
              {{ item1.title }}
              <div
                class="count"
                v-show="item1.title == '待办事' && todoCount > 0"
              >
                {{ todoCount }}
              </div>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class="main_cn" ref="mainCn">
        <div class="sub_header" v-show="!(pageMeta && pageMeta.hideHead)">
          {{
            pageMeta
              ? pageMeta.title === "角色管理"
                ? "角色成员"
                : pageMeta.title
              : ""
          }}
        </div>
        <el-card :class="cardClass">
          <router-view />
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import bus from "@/utils/bus.js";
export default {
  data() {
    return {
      pageMeta: {},
      menuActive: "",
      companyList: [],
      company: "",
      timer: null,
      openMenus: ["0"],
      cardClass: "",
      todoObj: {
        news_count: "合同到期",
        return_count: "退休",
        penson_count_stop: "离职",
        penson_count_start: "入职",
        socal_count_stop: "停保",
        socal_count_start: "参保",
        shengyu_count: "生育变动",
        shiye_count: "失业变动",
        yanglao_count: "养老变动",
        yiliao_count: "医疗变动",
        gongshang_count: "工伤变动",
        gongjijin_count: "公积金变动"
      },
    };
  },
  created() {
    this.computedClass();
    this.getMen().then(() => {
      this.setCurrentMenu();
    });
    this.getUserInfo();
    this.getMenuCompany();
    this.getExcelUrl();
    this.getStaffList();
    this.getNewsNum();
  },
  computed: {
    ...mapState("company", ["menuCompanyList"]),
    ...mapState("user", ["userInfo"]),
    ...mapState("menu", [
      "todoCount",
      "todo",
      "authMenuList",
      "menuList",
      "showCompany",
    ]),
  },
  watch: {
    $route() {
      this.computedClass();
      this.setCurrentMenu();
    },
  },
  methods: {
    ...mapActions("company", ["getMenuCompany", "getStaffList"]),
    ...mapActions("user", ["getUserInfo"]),
    ...mapActions("menu", ["getExcelUrl", "getNewsNum", "getMen"]),
    computedClass() {
      this.pageMeta = this.$route.meta;
      if (this.pageMeta && this.pageMeta.hideHead) {
        this.cardClass = "card1";
      } else {
        this.cardClass = "card2";
      }
    },
    // 设置当前高亮的menu
    setCurrentMenu() {
      const { meta, path } = this.$route;
      let result = path.match(/\/companydetail\/(\d+)/);
      if (result) {
        this.menuActive = result[1];
      } else {
        this.searchCurrentMenu(this.menuList, meta.title);
      }
    },
    // 查找当前高亮的menu
    searchCurrentMenu(arr, title) {
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        if (element.title === title) {
          this.menuActive = String(element.id);
          break;
        } else {
          if (element.child && element.child.length > 0)
            this.searchCurrentMenu(element.child, title);
        }
      }
    },
    handleOpen(key) {
      if (key == 0) return;
      this.openMenus = ["0", key];
    },
    handleClose(key) {
      if (key == 0) return;
      this.openMenus = ["0"];
    },
    handleCommand(url) {
      console.log("eeee", url);
      // this.jump(1, {url})
    },
    jump(type, item) {
      const {
        path,
        params: { id },
      } = this.$route;
      switch (type) {
        case 0:
          if (id != item.id) {
            this.$router.push(`/companydetail/${item.id}`);
          }
          break;
        case 1:
          console.log(111111);
          if (path != item.url) {
            this.$router.push(item.url);
          }
          break;
      }
    },
    search() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.timer = setTimeout(() => {
        this.getMenuCompany({ company_name: this.company });
        clearTimeout(this.timer);
        this.timer = null;
      }, 500);
    },
    onLogout() {
      this.$confirm("确定要退出登录吗？", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("authRoute");
        localStorage.removeItem("companyId");
        this.$router.push("/login");
      });
    },
    goTodoList(index) {
      let arr = [
        "",
        "news_count",
        "return_count",
        "penson_count_start",
        "penson_count_stop",
        "socal_count_stop",
        "socal_count_start",
        "yanglao_count",
        "shiye_count",
        "yiliao_count",
        "gongshang_count",
        "shengyu_count",
        "gongjijin_count"
      ];
      let type = arr.findIndex((item) => item == index);
      if (this.$route.path !== "/todolist") {
        this.$router.push({ name: "todolist", params: { type: type } });
      } else {
        bus.$emit("currentType", type);
      }
    },
  },
};
</script>

<style scoped lang="less">
@import "@/assets/css/common.less";
.layout {
  height: 100%;
  .count {
    position: absolute;
    right: 30px;
    top: 15px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #f00;
    color: #fff;
    text-align: center;
    line-height: 20px;
    font-size: 10px;
  }
}
.header {
  padding: 0 15px;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: @primaryColor1;
  .header_left {
    display: flex;
    flex-direction: row;
    align-items: center;
    .logo {
      width: 40px;
      margin-right: 20px;
    }
    h2 {
      color: #fff;
      font-size: 20px;
    }
  }
  .header_right {
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 14px;
    .right_btn {
      font-size: 12px;
      margin-left: 20px;
      cursor: pointer;
    }
  }
  .message {
    position: relative;
    margin-left: 20px;
    width: 20px;
    cursor: pointer;
    .message_icon {
      width: 18px;
      height: 18px;
    }
    .count {
      top: -10px;
      right: -15px;
    }
  }
}
.cn {
  width: 100%;
  height: calc(100% - 70px);
  display: flex;
  flex-direction: row;
  .left {
    width: 200px;
    background-color: #fff;
  }
  .left_menu {
    width: 200px;
  }
  .main_cn {
    width: 100%;
    overflow-y: scroll;
    .sub_header {
      height: 50px;
      line-height: 50px;
      font-weight: bold;
      color: #666;
      padding-left: 30px;
      background-color: #fff;
      position: relative;
      &::after {
        position: absolute;
        top: 17px;
        left: 15px;
        content: "";
        width: 3px;
        height: 16px;
        background-color: @primaryColor1;
      }
    }
    .card1 {
      margin: 15px;
      min-height: calc(100% - 35px);
    }
    .card2 {
      margin: 15px;
      min-height: calc(100% - 85px);
    }
  }
}
</style>
<style lang="less">
.layout_company {
  .company {
    height: 50px;
    line-height: 50px;
    padding: 0 45px;
    font-size: 14px;
  }
  .el-input {
    width: 150px;
    margin-left: 15px;
    .el-input__inner {
      height: 30px;
      border-radius: 30px;
    }
  }
  .el-submenu__title {
    display: none;
  }
  .company_menu {
    height: 200px;
    overflow-y: scroll;
    overflow-x: hidden;
  }
}
</style>