export default {
  loginUserInfoData(state) {                  //使用者登入資料
    return state.loginUserInfo 
  },
  authStateData(state) {                      //登入狀態
    return state.authState
  },
  currentTimeData(state) {                    //當前打卡時間
    return state.stateCurrentTime
  },
  lastTimeData(state) {                       //上次打卡時間
    return state.stateLastTime
  },
  workStateData(state) {                      //上班、下班、公出狀態
    return state.workState
  },
  userCoordinatesData(state) {                //使用者所在座標
    return state.userCoordinates
  },
  userCompanyDistanceData(state) {            //與公司的距離
    return state.companyDistance
  },
  clockInStateData(state) {                   //是否打卡成功
    return state.clockInState
  }
}