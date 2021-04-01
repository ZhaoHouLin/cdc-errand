export default {
  commitLoginUserInfo({commit},payload) {
    commit('stateLoginUserInfo',payload)
  },
  commitAuthState({commit},boolean) {
    commit('stateAuthState',boolean)
  },
  commitCurrentTime({commit},payload) {
    commit('stateCurrentTime',payload)
  },
  commitLastTime({commit}, payload) {
    commit('stateLastTime', payload)
  },
  commitWorkState({commit},str) {
    commit('stateWorkState',str)
  }
}