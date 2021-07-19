import axios from "@/utils/axios"

// 新增补偿金
export function addCompensate(data) {
  return axios.post("/api/add_compensate", data).then(res => {
    return res
  })
}

// 补偿金列表
export function getCutLog3(params) {
  return axios.get("/api/getCutLog3", { params }).then(res => {
    return res
  })
}

// 删除补偿金记录
export function delCutLog3(data) {
  return axios.post("/api/delCutLog3", data).then(res => {
    return res
  })
}