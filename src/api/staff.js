import axios from "@/utils/axios"

// 派遣人员列表
export function getDispatchList(params) {
  return axios.get("/api/getDispatchList", { params }).then(res => {
    return res
  })
}

// 员工身份列表
export function getStaffList(params) {
  return axios.get("/api/getStaffList", { params }).then(res => {
    return res
  })
}

// 导入员工
export function excelStaff(data) {
  return axios.post("/api​/excel_staff", data).then(res => {
    return res
  })
}

// 新增员工
export function addStaff(data) {
  return axios.post("/api/add_staff", data).then(res => {
    return res
  })
}

// 编辑员工
export function editStaff(data) {
  return axios.post("/api/ed_staff", data).then(res => {
    return res
  })
}

// 导出派遣人员
export function getDispatchListExcel(params) {
  return axios.get("/api/getDispatchListExcel", { params }).then(res => {
    return res
  })
}

// 员工离职
export function staffQuit(data) {
  return axios.post("/api/entry_status", data).then(res => {
    return res
  })
}

// 员工备注
export function staffRemark(data) {
  return axios.post("/api/remak", data).then(res => {
    return res
  })
}

// 员工详情
export function getStaffDetail(id) {
  return axios.get(`/api/findStaff?id=${id}`).then(res => {
    return res
  })
}

// 编辑员工文件
export function editStaffFile(data) {
  return axios.post('/api/ed_staff_file', data).then(res => {
    return res
  })
}






