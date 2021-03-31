export default {
  stateLoginUserInfo(state,payload) {
    state.loginUserInfo = payload
  },
  stateAuthState(state,boolean) {
    state.authState = boolean
  }
}