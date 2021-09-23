import axios from "@/utils/axios";
import { Promise } from "core-js";

const module = {
  namespaced: true,
  state: {
    excellUrls: null,
    todo: {},
    todoCount: 0,
    authMenuList: [],
    menuList: [],
    defaultAuth: [],
    showCompany: false  // 是否有用工公司
  },
  getters: {
    companyAuth(state) {
      return state.authMenuList.find(item => item.id == 130)
    }
  },
  mutations: {
    setExcellUrls(state, data) {
      state.excellUrls = data
    },
    setTodoCount(state, data) {
      state.todoCount = data
    },
    setTodo(state, data) {
      state.todo = data
    },
    setDefaultAuth(state, data) {
      state.defaultAuth = data
    },
    setAuthMenu(state, data) {
      state.authMenuList = data
    },
    setMenu(state, data) {
      state.menuList = data
    },
    setShowCompany(state, data) {
      state.showCompany = data
    }
  },
  actions: {
    // 获取excell模板
    getExcelUrl({ commit }) {
      return axios.get("/api/getExcelUrl").then(res => {
        if (res.code) commit('setExcellUrls', res.data)
      })
    },
    // 获取待办事总数
    getNewsNum({ commit }) {
      return axios.get("/api/news").then(res => {
        if (res.code) {
          let obj = res.data
          let count = 0
          for (const key in obj) {
            if (Object.hasOwnProperty.call(obj, key)) {
              count += obj[key];

            }
          }
          commit('setTodoCount', count)
          commit('setTodo', res.data)
        }
      })
    },
    getMen({ commit }) {
      return new Promise(resolve => {
        axios.get("/api/getMen").then(res => {
          if (res.code) {
            let authMenuList = []
            let isCompany = false
            res.data && res.data.map(item => {
              if (item.pid == 0) {
                authMenuList.push(item)
              }
              if (item.id == 130) {
                isCompany = true
              }
            })
            let menuList = authMenuList.filter(item => item.id != 130)
            commit('setDefaultAuth', res.data)
            commit('setAuthMenu', authMenuList)
            commit('setMenu', menuList)
            commit('setShowCompany', isCompany)
            resolve(res)
          }
        })
      })
    }
  },
};

export default module;
