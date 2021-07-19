import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import company from "./modules/company";
import menu from "./modules/menu";

import { Message } from "element-ui";

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    user,
    company,
    menu
  },
  mutations: {
    $message(state, data) {
      Message(data);
    },
  },
});

export default store;
