import axios from "@/utils/axios";

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
          commit('setTodoCount', res.data.news_count + res.data.return_count + res.data.penson_count_stop + res.data.penson_count_start + res.data.socal_count_stop + res.data.socal_count_start)
          commit('setTodo', res.data)
        }
      })
    },
    getMen({ commit }) {
      return axios.get("/api/getMen").then(res => {
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
          return res
        }
      })
    }
  },
};

export default module;
