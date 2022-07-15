import { createStore, createLogger } from 'vuex'
import api from '@/api'

export default createStore({
  state: {
    isLogin: null,     // 用户是否为登录态
    info: null,        // 登录用户基本信息
    favourList: null   // 登录用户的收藏列表
  },
  mutations: {
    changeIsLogin(state, bool) {
      state.isLogin = bool
    },
    changeInfo(state, payload) {
      state.info = payload
    },
    changeFavourList(state, payload) {
      state.favourList = payload
    },
    removeFavourItem(state, id) {
      if (state.favourList === null) return
      state.favourList = state.favourList.filter(item => {
        return +item.id !== +id
      })
    }
  },
  actions: {
    async changeLoginAsync({ commit }) {
      let bool = false
      let { code } = await api.checkLogin()
      // 0: 成功， 1：失败
      if (+code === 0) bool = true
      commit('changeIsLogin', bool)
    },
    async changeInfoAsync({ commit }) {
      let { code, data } = await api.getUserInfo()
      if (+code === 0) {
        commit('changeInfo', data)
      }
    },
    async changeFavourListAsync({ commit }) {
      let { code, data } = await api.getFavourList()

      if (+code !== 0) data = []
      commit('changeFavourList', data)
    }
  },
  plugins: process.env.NODE_ENV === 'production' ? [] : [createLogger()]
})
