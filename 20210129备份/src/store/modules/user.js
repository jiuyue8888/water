// import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
// import router, { resetRouter } from '@/router'
// import md5 from 'js-md5';

const state = {
  openId: '',
  loginState: '',
  userinfo: {},
}

const mutations = {
  SET_OPENID: (state, data) => {
    state.openId = data
  },
  SET_LOGINSTATE: (state, data) => {
    state.loginState = data
  },
  SET_USERINFO: (state, data) => {
    state.userinfo = data
  },
}

const actions = {

  //登录状态
  loginState({ commit }, data){
    commit('SET_LOGINSTATE', data)
  },

  // // 用户退出
  // logout({ commit, state }) {
  //   return new Promise((resolve, reject) => {
  //     logout().then(() => {
  //       commit('SET_TOKEN', '')
  //       commit('SET_USERINFO', '')
  //       removeToken()
  //       resetRouter()
  //       resolve()
  //     }).catch(error => {
  //       reject(error)
  //     })
  //   })
  // },

  // // 删除 token
  // resetToken({ commit }) {
  //   return new Promise(resolve => {
  //     commit('SET_TOKEN', '')
  //     commit('SET_USERINFO', '')
  //     removeToken()
  //     resolve()
  //   })
  // },

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
