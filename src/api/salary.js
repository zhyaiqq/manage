import axios from "@/utils/axios"

// 员工薪资列表
export function getStaffSalaryList(params) {
  return axios.get("/api/getStaffSalaryList", { params }).then(res => {
    return res
  })
}

// 导入员工薪资
export function excelSalary(data) {
  return axios.post("/api/excel_salary", data).then(res => {
    return res
  })
}

// 编辑员工薪资薪资
export function editSalary(data) {
  return axios.post("/api/ed_person_salary", data).then(res => {
    return res
  })
}


// 薪资备注
export function remakSalary(data) {
  return axios.post("/api/remak_salary", data).then(res => {
    return res
  })
}

// 获取薪资页按钮
export function getSalaryButton(params) {
  return axios.get("/api/getSalaryButton", { params }).then(res => {
    return res
  })
}

// 对账发放按钮-发放
export function addSalaryButton(data) {
  return axios.post("/api/addSalaryButton", data).then(res => {
    return res
  })
}

// 对账发放按钮-对账
export function addSalaryButton2(data) {
  return axios.post("/api/addSalaryButton2", data).then(res => {
    return res
  })
}
