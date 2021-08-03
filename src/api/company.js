import axios from "@/utils/axios"

// 首页概览信息
export function getOverview(params) {
  return axios.get("/api/Indexist", { params }).then(res => {
    return res
  })
}


// 添加公司
export function addCompany(data) {
  return axios.post("/api/add_company", data).then(res => {
    return res
  })
}
// 编辑公司
export function editCompany(data) {
  return axios.post("/api/ed_company", data).then(res => {
    return res
  })
}
// 编辑岗位
export function editStation(data) {
  return axios.post("/api/ed_station", data).then(res => {
    return res
  })
}
// 公司列表
export function getCompanyList(params) {
  return axios.get("/api/getCompanyList", { params }).then(res => {
    return res
  })
}
// 禁用/启用公司
export function banCompany(data) {
  return axios.post("/api/banCompany", data).then(res => {
    return res
  })
}
// 账户充值
export function recharge(data) {
  return axios.post("/api/Recharge", data).then(res => {
    return res
  })
}
// 查询公司详情
export function findCompany(id) {
  return axios.get(`/api/findCompany?id=${id}`).then(res => {
    return res
  })
}
// 岗位详情
export function findStation(id) {
  return axios.get(`/api/getStationList?company_id=${id}`).then(res => {
    return res
  })
}

// 查询公司权限
export function getCompanySelect(id) {
  console.log('ewrwerewrewrwe', id)
  return axios.get(`/api/getCompanySelect?user_id=${id}`).then(res => {
    return res
  })
}
