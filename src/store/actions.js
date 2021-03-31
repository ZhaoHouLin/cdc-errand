export default {
  commitLoginUserInfo({commit},payload) {
    commit('stateLoginUserInfo',payload)
  },
  commitAuthState({commit},boolean) {
    commit('stateAuthState',boolean)
  }
}