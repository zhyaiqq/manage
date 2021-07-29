import axios from "@/utils/axios"

// 扣费记录列表
export function getCutLogList(params) {
  return axios.get("/api/getCutLogList", { params }).then(res => {
    return res
  })
}

// 删除扣费记录
export function delCutLog(data) {
  return axios.get("/api/delCutLog", data).then(res => {
    return res
  })
}

// 充值记录
export function getRecharge(data) {
  console.log('werewrererwer', data)
  return axios.get("/api/getCompanyRecharge", data).then(res => {
    return res
  })
}