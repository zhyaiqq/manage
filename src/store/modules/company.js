import axios from "@/utils/axios";

const module = {
  namespaced: true,
  state: {
    companyList: [], // 公司列表
    menuCompanyList: [], // 菜单公司列表
    staffTypeList: [] // 员工身份列表
  },
  getters: {
  },
  mutations: {
    setCompany(state, data) {
      state.companyList = data
    },
    setMenuCompany(state, data) {
      state.menuCompanyList = data
    },
    setStaffTypes(state, data) {
      state.staffTypeList = data
    }
  },
  actions: {
    // 获取所有公司
    getAllCompany({ commit }) {
      return axios.get("/api/getCompanyList", {
        page: 1,
        page_num: 1000
      }).then(res => {
        if (res.code) {
          commit('setCompany', res.data)
        }
      })
    },
    // 获取左侧菜单公司列表
    getMenuCompany({ commit }, params) {
      return axios.get("/api/getMenuCompany", { params }).then(res => {
        if (res.code) {
          commit('setMenuCompany', res.data)
          return res
        }

      })
    },
    // 获取员工身份列表
    getStaffList({ commit }) {
      return axios.get("/api/getStaffList").then(res => {
        if (res.code) {
          commit('setStaffTypes', res.data)
        }
      })
    }
  },
};

export default module;
