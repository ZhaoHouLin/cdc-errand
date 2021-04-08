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
    state.stateCurrentTime.currentWorkState = payload.workState
  },
  stateLastTime(state, payload) {
    state.stateLastTime.lastDate = payload.lastDate
    state.stateLastTime.lastTime = payload.lastTime
    state.stateLastTime.lastDayMilliseconds = payload.lastDayMilliseconds
    state.stateLastTime.lastWorkState = payload.lastWorkState
  },
  stateWorkState(state,string) {
    state.workState = string
  },
  stateUserCoordinates(state, payload) {
    state.userCoordinates.latitude = payload.latitude
    state.userCoordinates.longitude = payload.longitude
  },
  stateCompanyDistance(state,number) {
    state.companyDistance = number
  },
  stateClockInState(state,string) {
    state.clockInState = string
  }
}