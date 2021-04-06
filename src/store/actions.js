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
  commitWorkState({commit},string) {
    commit('stateWorkState',string)
  },
  commitUserCoordinates({commit},payload) {
    commit('stateUserCoordinates',payload)
  },
  commitCompanyDistance({commit},number) {
    commit('stateCompanyDistance',number)
  },
  commitClockInState({commit},string) {
    commit('stateClockInState',string)
  }
}