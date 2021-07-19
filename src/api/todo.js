import axios from "@/utils/axios"

// 待办事列表
export function getExpire(params) {
  return axios.get("/api/getExpire", { params }).then(res => {
    return res
  })
}

// 待办事详情
export function findExpireStaff(params) {
  return axios.get("/api/findExpireStaff", { params }).then(res => {
    return res
  })
}

// 待办事处理
export function dealExpire(data) {
  return axios.post("/api/deal_expire", data).then(res => {
    return res
  })
}

// 消息中心
export function getNews () {
  return axios.get("/api/news").then(res => {
    return res
  })
}




