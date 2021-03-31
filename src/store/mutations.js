export default {
  stateLoginUserInfo(state,payload) {
    state.loginUserInfo = payload
  },
  stateAuthState(state,boolean) {
    state.authState = boolean
  },
  stateTime(state,payload) {
    state.time.localDate = payload.localDate
    state.time.loaclTime = payload.loaclTime
    state.time.lastDate = payload.lastDate
    state.time.lastTime = payload.lastTime
    state.time.dayMilliseconds = payload.dayMilliseconds
    state.time.lastDayMilliseconds = payload.lastDayMilliseconds
    console.log(state.time);
  },
  stateWorkState(state,str) {
    state.workState = str
  }
}