export default {
  stateLoginUserInfo(state,payload) {
    state.loginUserInfo = payload
  },
  stateAuthState(state,boolean) {
    state.authState = boolean
  },
  stateCurrentTime(state,payload) {
    state.stateCurrentTime.currentDate = payload.currentDate
    state.stateCurrentTime.currentTime = payload.currentTime
    state.stateCurrentTime.dayMilliseconds = payload.dayMilliseconds
  },
  stateLastTime(state, payload) {
    state.stateLastTime.lastDate = payload.lastDate
    state.stateLastTime.lastTime = payload.lastTime
    state.stateLastTime.lastDayMilliseconds = payload.lastDayMilliseconds
  },
  stateWorkState(state,str) {
    state.workState = str
  }
}