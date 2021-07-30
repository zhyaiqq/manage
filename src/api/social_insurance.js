import axios from "@/utils/axios"

// 五险基数设置
export function setGlobalBase(data) {
  return axios.post("/api/setGlobalBase", data).then(res => {
    return res
  })
}
// 查询五险基数
export function findGlobalBase() {
  return axios.get("/api/findGlobalBase").then(res => {
    return res
  })
}

// 社保名单列表
export function getSocialList(params) {
  return axios.get("/api/getSocialList", { params }).then(res => {
    return res
  })
}

// 修改公司社保比例
export function addCompanySocial(data) {
  return axios.post("/api/add_company_social", data).then(res => {
    return res
  })
}

// 导出社保名单列表
export function getSocialListExcel(params) {
  return axios.get("/api/getSocialListExcel", { params }).then(res => {
    return res
  })
}

// 员工停保
export function stop(data) {
  return axios.post("/api/entry_stop", data).then(res => {
    return res
  })
}

// 社保备注
export function remarkSocial(data) {
  return axios.post("/api/remak_social", data).then(res => {
    return res
  })
}

// 编辑员工社保比例
export function editPersonSocial(data) {
  return axios.post("/api/ed_person_social", data).then(res => {
    return res
  })
}

// 查询个人社保比例
export function getSocialInfo(params) {
  return axios.get("/api/getSocialInfo", { params }).then(res => {
    return res
  })
}


