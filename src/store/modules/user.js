import axios from "@/utils/axios";

const module = {
  namespaced: true,
  state: {
    userInfo: null
  },
  getters: {
  },
  mutations: {
    setUser(state, data) {
      state.userInfo = data
    }
  },
  actions: {
    // 获取验证码
    getCaptcha() {
      return new Promise((resolve) => {
        axios.get("/api/getCaptcha").then(res => {
          resolve(res)
        })
      })
    },
    // 查询登录用户信息
    getUserInfo({ commit }) {
      axios.get("/api/findLogUser").then(res => {
        if (res.code) {
          commit('setUser', res.data)
        }
      })
    },
    // 登录
    login({ state }, data) {
      console.log(state)
      return axios.post("/api/login", data).then(res => {
        return res
      })
    }
  },
};

export default module;
