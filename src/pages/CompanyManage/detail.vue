<template>
  <div class="company_detail">
    <div class="overview">
      <div v-for="(item, index) in overviewList" :key="index" :class="`item item${index+1}`" @click="clickPanel(index)">
        <div>{{ item.title }}</div>
        <div class="bold">{{ item.value }}</div>
      </div>
    </div>
    <el-tabs v-model="currentIndex" @tab-click="changeTab" v-if="companyAuth && companyAuth.child.length > 0">
      <el-tab-pane label="基础信息" name="基础信息" v-if="isShowTab(companyAuth.child,'基础信息')">
        <div style="position: relative" v-show="currentIndex == '基础信息'">
          <BaseForm :type="type" :formData="{...baseInfo}" ref="baseComp" />
          <div>
            <el-button type="primary" @click="edit(0)" v-if="type == 1">提交</el-button>
            <el-button type="primary" @click="edit(1)" v-if="type == 0" :disabled="baseInfo && baseInfo.status == 0">编辑</el-button>
            <el-button type="primary" plain @click="cancelEdit" v-if="type == 1">取消</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="人员列表" name="人员列表" v-if="isShowTab(companyAuth.child,'人员列表')">
        <DispatchTable :companyId="id" v-if="currentIndex == '人员列表'" ref="dispatchTable" />
      </el-tab-pane>
      <el-tab-pane label="社保名单" name="社保名单" v-if="isShowTab(companyAuth.child,'社保名单')">
        <SocialTable :companyId="id" v-if="currentIndex == '社保名单'" />
      </el-tab-pane>
      <el-tab-pane label="员工薪资" name="员工薪资" v-if="isShowTab(companyAuth.child,'员工薪资')">
        <SalaryTable :companyId="id" v-if="currentIndex == '员工薪资'" />
      </el-tab-pane>
      <el-tab-pane label="费用管理" name="费用管理" v-if="isShowTab(companyAuth.child,'费用管理')">
        <ChargeTable :companyId="id" :companyName="baseInfo && baseInfo.name"  v-if="currentIndex == '费用管理'" />
      </el-tab-pane>
      <el-tab-pane label="补偿金" name="补偿金" v-if="isShowTab(companyAuth.child,'补偿金')">
        <CompensationTable :companyId="id" v-if="currentIndex == '补偿金'" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseForm from './components/baseForm.vue'
// import WorkForm from './components/workForm.vue'
import DispatchTable from './components/dispatchPersonTable.vue'
import SocialTable from './components/socialInsuranceTable.vue'
import SalaryTable from './components/salaryTable.vue'
import ChargeTable from './components/chargeTable.vue'
import CompensationTable from './components/compensationTable.vue'
import { mapActions, mapGetters } from 'vuex'
import { findCompany, findStation, editCompany, editStation, getOverview } from '@/api/company.js'
import bus from '@/utils/bus.js'
export default {
  data () {
    return {
      type: 0, // 详情：0, 2，编辑：1
      id: '',
      btns: [],
      overviewList: [
        {
          title: '账户余额',
          value: '--',
          color: 'rgba(88, 163, 247, 1)'
        },
        {
          title: '派遣员工总数',
          value: '--',
          color: 'rgba(254, 192, 61, 1)'
        },
        {
          title: '本月新增员工',
          value: '--',
          color: 'rgba(251, 98, 96, 1)'
        },
        {
          title: '本月减少员工',
          value: '--',
          color: 'rgba(82, 193, 245, 1)'
        },
        {
          title: '社保缴纳',
          value: '--',
          color: 'rgba(82, 193, 245, 1)'
        },
        {
          title: '社保注销',
          value: '--',
          color: 'rgba(82, 193, 245, 1)'
        },
      ],
      currentIndex: '',
      baseInfo: null,
      jobList: null,
      isBack: false,
      pageMeta: null
    }
  },
  components: { BaseForm, DispatchTable, SocialTable, SalaryTable, ChargeTable, CompensationTable },
  created () {
    const { action } = this.$route.query
    const { id } = this.$route.params
    this.pageMeta = this.$route.meta
    this.id = id
    this.type = action === 'edit' ? 1 : (this.pageMeta.title == '公司列表' ? 2 : 0)
    this.btns = this.type == 1 ? ['基础信息'] : ['基础信息', '人员列表', '社保名单', '员工薪资', '费用管理', '补偿金']
    this.getCompanyInfo()
    this.getStationInfo()
    this.getOverview()
    this.computedCurrentIndex()
    bus.$on('updateAccountMoney', () => this.getOverview())
  },
  computed: {
    ...mapGetters('menu', ['companyAuth']),
    stationInfo () {
      let arr =[]
      this.jobList && this.jobList.map((item) => {
        arr.push({...item})
      })
      return arr
    }
  },
  watch: {
    $route (to) {
      this.isBack = false
      const { action } = to.query
      const { id } = to.params
      this.pageMeta = this.$route.meta
      this.id = id
      this.type = action === 'edit' ? 1 : 0
      this.type = action === 'edit' ? 1 : (this.pageMeta.title == '公司列表' ? 2 : 0)
      this.btns = this.type ? ['基础信息'] : ['基础信息', '人员列表', '社保名单', '员工薪资', '费用管理', '补偿金']
      this.getCompanyInfo()
      this.getStationInfo()
      this.getOverview()
      this.computedCurrentIndex()
    },
    companyAuth () {
      if (this.companyAuth && this.companyAuth.child.length > 0) {
        let result = this.companyAuth.child.map(item => item.title == '人员列表')
        if (result) {
          this.currentIndex = this.$route.path.includes('/companylist') ? this.companyAuth.child[0].title : '人员列表' 
          return
        }
        this.currentIndex = this.companyAuth.child[0].title
      }
    }
  },
  methods: {
    ...mapActions('company', ['getMenuCompany']),
    computedCurrentIndex () {
      if (this.companyAuth && this.companyAuth.child.length > 0) {
        let result = this.companyAuth.child.map(item => item.title == '人员列表')
        if (result) {
          this.currentIndex = this.$route.path.includes('/companylist') ? this.companyAuth.child[0].title : '人员列表' 
          return
        }
        this.currentIndex = this.companyAuth.child[0].title
      }
    },
    changeTab () {
      localStorage.setItem('activeName', this.currentIndex)
      this.jobList = [...this.jobList]
      this.pageMeta = this.$route.meta
      this.isBack = false
      this.type = this.pageMeta.title == '公司列表' ? this.type : 0
    },
    clickPanel (index) {
      switch (index) {
        case 0:
          this.currentIndex = '费用管理'
          break;
        case 1:
        case 2:
        case 3:
          this.currentIndex = '人员列表'
          bus.$emit('dispatchPerson', index);
          break;
      }
    },
    isShowTab (arr, title) {
      return arr.find(item => item.title == title)
    },
    // 返回
    back (type) {
      if (type) this.jobList = [...this.jobList]
      this.isBack = false
      this.type = 0
    },
    // 编辑
    edit (type) {
      // let jobList = this.$refs['workComp'].jobList
      let jobList = []
      switch (type) {
        case 0:
          // 编辑公司
          editCompany({
            ...this.$refs['baseComp'].baseForm,
            company_id: this.id
          }).then(res => {
            if (res.code) {
              this.$message.success('编辑成功')
              this.getCompanyInfo()
              this.getMenuCompany()
              this.isBack = false
              this.type = 0
            }
          })
          break;
        case 1:
        case 3:
          this.type = 1
          this.isBack = true
          break;
        case 2:
          // 编辑岗位
          for (let i = 0; i < jobList.length; i++) {
            jobList[i].company_id = this.id
          }
          editStation({
            station: jobList
          }).then(res => {
            if (res.code) {
              this.jobList = jobList
              this.isBack = false
              this.type = 0
              this.$message.success('编辑成功')
            }
          })
          break;
      }
    },
    // 取消编辑
    cancelEdit () {
      if (this.pageMeta.title == '公司列表') {
        this.getCompanyInfo()
      } else {
        this.type = 0
      }
    },
    // 查询公司详情
    getCompanyInfo () {
      findCompany(this.id).then(res => {
        if (res.code) this.baseInfo = res.data
      })
    },
    // 查询岗位详情
    getStationInfo () {
      findStation(this.id).then(res => {
        if (res.code) {
          this.jobList = res.data
        }
      })
    },
    // 获取概览信息
    getOverview () {
      getOverview({
        company_id: this.id
      }).then(res => {
        if(res.code) {
          this.overviewList[0].value = res.data.money
          this.overviewList[1].value = res.data.staff_count
          this.overviewList[2].value = res.data.new_staff
          this.overviewList[3].value = res.data.out_staff
          this.overviewList[4].value = res.data.count_social
          this.overviewList[5].value = res.data.out_social
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.company_detail {
  .overview {
    display: flex;
    margin-top: 30px;
    margin-bottom: 40px;
    .item {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 260px;
      height: 100px;
      margin-right: 20px;
      color: #fff;
      &.item1 {
        background-image: linear-gradient(to right, #309EE1 , #55BCC0);
        cursor: pointer;
      }
      &.item2 {
        background-image: linear-gradient(to right, #FC3B91 , #FF7B7E);
        cursor: pointer;
      }
      &.item3 {
        background-image: linear-gradient(to right, #9959C6 , #C443D8);
        cursor: pointer;
      }
      &.item4 {
        background-image: linear-gradient(to right, #F1A323 , #EDC11D);
        cursor: pointer;
      }
      &.item5 {
        background-image: linear-gradient(to right, rgba(238, 83, 53, 1), rgba(238, 83, 53, .6));
      }
      &.item6 {
        background-image: linear-gradient(to right, rgba(167, 212, 133, 1), rgba(167, 212, 133, .8));
      }
      .bold {
        margin-top: 10px;
        font-weight: bold;
      }
    }
  }
  .back {
    position: absolute;
    top: 150px;
    left: 1000px;
  }
  .back1 {
    top: 10px;
  }
}
</style>

agr_platform=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYW5jbG91ZHNfYWdyIiwiaXNzIjoiaGFuY2xvdWRzX2FnciIsImlhdCI6MTYyODY2MjIwNywiZXhwIjoxNjMxMjU0MjA3LCJuYmYiOjE2Mjg2NjIyMDcsImp0aSI6IjY1In0.3SUD0n5MAgoxohQPZ3wD9dbdqSvpmJtlAbW21BwXz_s; 
agr_platform_refresh=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYW5jbG91ZHNfYWdyIiwiaXNzIjoiaGFuY2xvdWRzX2FnciIsImlhdCI6MTYyODY2MjIwNywiZXhwIjoxNjMxMjU0MjA3LCJuYmYiOjE2Mjg2NjIyMDcsImp0aSI6IjY1In0.3SUD0n5MAgoxohQPZ3wD9dbdqSvpmJtlAbW21BwXz_s; 
saas-agr=eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJoYW5jbG91ZHNfYWdyIiwiaXNzIjoiaGFuY2xvdWRzX2FnciIsImlhdCI6MTYyODY2MjIwNywiZXhwIjoxNjMxMjU0MjA3LCJuYmYiOjE2Mjg2NjIyMDcsImp0aSI6IjY1In0.3SUD0n5MAgoxohQPZ3wD9dbdqSvpmJtlAbW21BwXz_s