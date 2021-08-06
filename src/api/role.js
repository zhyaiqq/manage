import axios from "@/utils/axios"

// 查询角色列表
export function getRoleList(params) {
  return axios.get("/api/RoleList", { params }).then(res => {
    return res
  })
}

// 删除角色
export function delRole(data) {
  return axios.post("/api/delRole", data).then(res => {
    return res
  })
}

// 新增角色
export function addRole(data) {
  return axios.post("/api/addRole", data).then(res => {
    return res
  })
}

// 授权列表
export function getRoleAuth(params) {
  return axios.get("/api/getRoleAuth", { params }).then(res => {
    return res
  })
}

// 添加角色权限
export function updateAuthRole(data) {
  return axios.post("/api/authRole", data).then(res => {
    return res
  })
}

// 编辑角色
export function editRole(data) {
  return axios.post("/api/edRole", data).then(res => {
    return res
  })
}

// 查询用户列表
export function getUserList(params) {
  return axios.get("/api/getRoleList", { params }).then(res => {
    return res
  })
}

// 添加用户
export function addUser(data) {
  return axios.post("/api/addUser", data).then(res => {
    return res
  })
}

// 添加用户
export function editUser(data) {
  return axios.post("/api/ed_user", data).then(res => {
    return res
  })
}

// 删除用户
export function delUser(data) {
  return axios.post("/api/delUser", data).then(res => {
    return res
  })
}

// 管理员修改密码
export function edPassword2(data) {
  return axios.post("/api/ed_password2", data).then(res => {
    return res
  })
}









