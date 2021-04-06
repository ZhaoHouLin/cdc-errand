export default {
  loginUserInfoData(state) {  
    return state.loginUserInfo 
  },
  authStateData(state) {
    return state.authState
  },
  currentTimeData(state) {
    return state.stateCurrentTime
  },
  lastTimeData(state) {
    return state.stateLastTime
  },
  workStateData(state) {
    return state.workState
  },
  userCoordinatesData(state) {
    return state.userCoordinates
  },
  userCompanyDistanceData(state) {
    return state.companyDistance
  },
  clockInStateData(state) {
    return state.clockInState
  }
}