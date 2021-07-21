<template>
  <div class="company_detail">
    <div class="top" v-if="companyAuth && companyAuth.child.length > 0">
      <el-button type="primary" :class="{'current': currentIndex == index}" @click="changeTab(index)" v-for="(item, index) in companyAuth.child" :key="index">{{ item.title }}</el-button>
    </div>
    <div class="cn">
      <div v-show="currentIndex === 0" style="position: relative">
        <div class="overview">
          <div v-for="(item, index) in overviewList" :key="index" :class="`item item${index+1}`">
            <div>{{ item.title }}</div>
            <div class="bold">{{ item.value }}</div>
          </div>
        </div>
        <!--
        <div class="back" v-show="isBack">
          <el-button type="primary" @click="back(0)">返回</el-button>
        </div>
        -->
        <BaseForm :type="type" :formData="{...baseInfo}" ref="baseComp" />
        <div class="btn-wrap">
          <el-button type="success" @click="edit(0)" v-show="type == 1">提交</el-button>
          <el-button type="success" @click="edit(1)" v-show="type == 0">编辑</el-button>
        </div>
      </div>
      <div v-show="currentIndex === 1" style="marginTop: 30px; position: relative">
        <!--
        <div class="back back1" v-show="isBack">
          <el-button type="primary" @click="back(1)">返回</el-button>
        </div>
        -->
        <WorkForm :type="type" :formData="stationInfo" ref="workComp" />
        <div class="btn-wrap">
          <el-button type="success" @click="edit(2)" v-show="type == 1">提交</el-button>
          <el-button type="success" @click="edit(3)" v-show="type == 0">编辑</el-button>
        </div>
      </div>
      <DispatchTable v-if="currentIndex === 2" :companyId="id" />
      <SocialTable v-if="currentIndex === 3" :companyId="id" />
      <SalaryTable v-if="currentIndex === 4" :companyId="id" />
      <ChargeTable v-if="currentIndex === 5" :companyId="id" :companyName="baseInfo && baseInfo.name" />
      <CompensationTable v-if="currentIndex === 6" :companyId="id" />
    </div>
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
      currentIndex: 3,
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
      this.currentIndex = 0
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
    }
  },
  methods: {
    ...mapActions('company', ['getMenuCompany']),
    changeTab (index) {
      this.jobList = [...this.jobList]
      this.pageMeta = this.$route.meta
      this.isBack = false
      this.type = this.pageMeta.title == '公司列表' ? this.type : 0
      this.currentIndex = index
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
  .top {
    padding: 20px 0;
    display: flex;
    flex-direction: row;
    .el-button {
      width: 140px;
      margin-right: 40px;
      &.current {
        background: #66b1ff;
        border-color: #66b1ff;
      }
    }
  }
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
  .btn-wrap {
    margin-left: 400px;
    padding-top: 40px;
    width: 300px;
    text-align: center;
    .el-button {
      width: 150px;
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