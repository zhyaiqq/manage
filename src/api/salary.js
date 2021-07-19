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
