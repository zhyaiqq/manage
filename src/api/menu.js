import axios from "@/utils/axios"

// 菜单公司列表
export function getMenuCompany(params) {
  return axios.get("/api/getMenuCompany", { params }).then(res => {
    return res
  })
}

// 获取菜单
export function getMen() {
  return axios.get("/api/getMen").then(res => {
    return res
  })
}

// 获取excell模板
export function getExcelUrl(params) {
  return axios.get("/api/getExcelUrl", { params }).then(res => {
    return res
  })
}

