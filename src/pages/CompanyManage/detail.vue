<template>
  <div class="company_detail">
    <el-tabs v-model="currentIndex" @tab-click="changeTab" v-if="companyAuth && companyAuth.child.length > 0">
      <el-tab-pane label="基础信息" name="0" v-show="isShowTab(companyAuth.child,'基础信息')">
        <div style="position: relative">
          <div class="overview">
            <div v-for="(item, index) in overviewList" :key="index" :class="`item item${index+1}`">
              <div>{{ item.title }}</div>
              <div class="bold">{{ item.value }}</div>
            </div>
          </div>
          <BaseForm :type="type" :formData="{...baseInfo}" ref="baseComp" />
          <div>
            <el-button type="primary" @click="edit(0)" v-show="type == 1">提交</el-button>
            <el-button type="primary" @click="edit(1)" v-show="type == 0">编辑</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="岗位需求" name="1" v-show="isShowTab(companyAuth.child,'岗位需求')">
        <div style="marginTop: 30px; position: relative" v-show="currentIndex == '1'">
          <WorkForm :type="type" :formData="stationInfo" ref="workComp" />
          <div>
            <el-button type="primary" @click="edit(2)" v-show="type == 1">提交</el-button>
            <el-button type="primary" @click="edit(3)" v-show="type == 0">编辑</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="派遣人员" name="2" v-show="isShowTab(companyAuth.child,'派遣人员')">
        <DispatchTable :companyId="id" v-if="currentIndex == 2" />
      </el-tab-pane>
      <el-tab-pane label="社保名单" name="3" v-show="isShowTab(companyAuth.child,'社保名单')">
        <SocialTable :companyId="id" v-if="currentIndex == 3" />
      </el-tab-pane>
      <el-tab-pane label="员工薪资" name="4" v-show="isShowTab(companyAuth.child,'员工薪资')">
        <SalaryTable :companyId="id" v-if="currentIndex == 4" />
      </el-tab-pane>
      <el-tab-pane label="扣费记录" name="5" v-show="isShowTab(companyAuth.child,'扣费记录')">
        <ChargeTable :companyId="id" :companyName="baseInfo && baseInfo.name" v-if="currentIndex == 5" />
      </el-tab-pane>
      <el-tab-pane label="补偿金" name="6" v-show="isShowTab(companyAuth.child,'补偿金')">
        <CompensationTable :companyId="id" v-if="currentIndex == 6" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import BaseForm from './components/baseForm.vue'
import WorkForm from './components/workForm.vue'
import DispatchTable from './components/dispatchPersonTable.vue'
import SocialTable from './components/socialInsuranceTable.vue'
import SalaryTable from './components/salaryTable.vue'
import ChargeTable from './components/chargeTable.vue'
import CompensationTable from './components/compensationTable.vue'
import { mapActions, mapGetters } from 'vuex'

import { findCompany, findStation, editCompany, editStation, getOverview } from '@/api/company.js'
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
        }
      ],
      currentIndex: '0',
      baseInfo: null,
      jobList: null,
      isBack: false,
      pageMeta: null
    }
  },
  components: { BaseForm, WorkForm, DispatchTable, SocialTable, SalaryTable, ChargeTable, CompensationTable },
  created () {
    const { action } = this.$route.query
    const { id } = this.$route.params
    this.pageMeta = this.$route.meta
    this.id = id
    this.type = action === 'edit' ? 1 : (this.pageMeta.title == '公司列表' ? 2 : 0)
    this.btns = this.type == 1 ? ['基础信息', '岗位需求'] : ['基础信息', '岗位需求', '派遣人员', '社保名单', '员工薪资', '扣费记录', '补偿金']
    this.getCompanyInfo()
    this.getStationInfo()
    this.getOverview()
    console.log('companyAuthcompanyAuthcompanyAuth', this.companyAuth)
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
      this.currentIndex = '0'
      this.isBack = false
      const { action } = to.query
      const { id } = to.params
      this.pageMeta = this.$route.meta
      this.id = id
      this.type = action === 'edit' ? 1 : 0
      this.type = action === 'edit' ? 1 : (this.pageMeta.title == '公司列表' ? 2 : 0)
      this.btns = this.type ? ['基础信息', '岗位需求'] : ['基础信息', '岗位需求', '派遣人员', '社保名单', '员工薪资', '扣费记录', '补偿金']
      this.getCompanyInfo()
      this.getStationInfo()
      this.getOverview()
    },
    companyAuth () {
      if (this.companyAuth && this.companyAuth.child.length > 0) {
        console.log('erwrewrwerwer---------------', this.companyAuth)
        // this.currentIndex = '1'
      }
    }
  },
  methods: {
    ...mapActions('company', ['getMenuCompany']),
    changeTab () {
      this.jobList = [...this.jobList]
      this.pageMeta = this.$route.meta
      this.isBack = false
      this.type = this.pageMeta.title == '公司列表' ? this.type : 0
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
      let jobList = this.$refs['workComp'].jobList
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
            jobList[i].company_id = 31
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
      }
      &.item2 {
        background-image: linear-gradient(to right, #FC3B91 , #FF7B7E);
      }
      &.item3 {
        background-image: linear-gradient(to right, #9959C6 , #C443D8);
      }
      &.item4 {
        background-image: linear-gradient(to right, #F1A323 , #EDC11D);
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