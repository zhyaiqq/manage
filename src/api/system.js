import axios from "@/utils/axios"


// 查询登录用户
export function findLogUser(params) {
  return axios.get("/api/findLogUser", { params }).then(res => {
    return res
  })
}

// 上传文件
export function uploadFile(data) {
  return axios.post("/api/upFile", data).then(res => {
    return res
  })
}

// 账户设置
export function setUser(data) {
  return axios.post("/api/on_user", data).then(res => {
    return res
  })
}

// 获取操作日志
export function getLog(params) {
  return axios.get("/api/getLog", { params }).then(res => {
    return res
  })
}

// 提醒设置
export function setRemind(data) {
  return axios.post("/api/setRemind", data).then(res => {
    return res
  })
}

// 查询提醒设置
export function getRemind(data) {
  return axios.get("/api/getRemind", data).then(res => {
    return res
  })
}

