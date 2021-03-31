export default {
  commitLoginUserInfo({commit},payload) {
    commit('stateLoginUserInfo',payload)
  },
  commitAuthState({commit},boolean) {
    commit('stateAuthState',boolean)
  },
  commitTime({commit},payload) {
    commit('stateTime',payload)
  },
  commitWorkState({commit},str) {
    commit('stateWorkState',str)
  }
}