import axios from "@/utils/axios"

// 扣费记录列表
export function getCutLogList(params) {
  return axios.get("/api/getCutLogList", { params }).then(res => {
    return res
  })
}

// 删除扣费记录
export function delCutLog(data) {
  return axios.post("/api/delCutLog", data).then(res => {
    return res
  })
}

// 充值记录
export function getRecharge(params) {
  return axios.get("/api/getCompanyRecharge", { params }).then(res => {
    return res
  })
}

// 费用明细
export function getDetailed(params) {
  return axios.get("/api/getDetailed", { params }).then(res => {
    return res
  })
}

// 费用汇总
export function costAll(params) {
  return axios.get("/api/cost_all", { params }).then(res => {
    return res
  })
}

// 费用月汇总
export function costMonthAll(params) {
  return axios.get(`/api/month_cost_all`, { params }).then(res => {
    return res
  })
}

// 管理费设置
export function setManageFee(data) {
  return axios.post("/api/setManageFee", data).then(res => {
    return res
  })
}


