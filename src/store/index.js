import Vue from 'vue'
import Vuex from 'vuex'
import { Ability } from "@casl/ability";

import authPlugin from "./modules/authPlugin";
import homeStore from "./modules/homeStore.js";
import userStore from "./modules/userStore.js";
import airmapStore from "./modules/airmapStore.js";
import projectStore from "./modules/projectStore.js";
import chatStore from "./modules/chatStore.js";
Vue.use(Vuex)

//Helper function to initialize state and erase it on logout
const getInitialState = () => {
  return {
    isSpinnerShowing: false,
    rules: [],
  }
}
export default new Vuex.Store({
  plugins: [authPlugin],
  state: getInitialState(),
  getters: {
    ability() {
      return new Ability()
    }
  },
  actions: {
    toggleSpinner: ({ commit }) => {
      commit('setIsSpinnerShowing')
    },
    resetRoot: ({ commit }) => {
      commit('resetRoot')
    },
  },
  mutations: {
    setIsSpinnerShowing(state) {
      state.isSpinnerShowing = !state.isSpinnerShowing
    },
    resetRoot(state) {
      Object.assign(state, getInitialState())
    }
  },
  modules: {
    homeStore,
    userStore,
    airmapStore,
    projectStore,
    chatStore,
  }
})

