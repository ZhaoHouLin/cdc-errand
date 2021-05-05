export default {
  stateLoginUserInfo(state, payload) {                //使用者登入資料
    state.loginUserInfo = payload
  },
  stateAuthState(state, boolean) {                    //登入狀態
    state.authState = boolean
  },
  stateCurrentTime(state, payload) {                  //當前打卡時間
    state.stateCurrentTime.currentDate = payload.getTimeData.currentDate
    state.stateCurrentTime.currentTime = payload.getTimeData.currentTime
    state.stateCurrentTime.dayMilliseconds = payload.getTimeData.dayMilliseconds
    state.stateCurrentTime.currentWorkState = payload.workState
  },
  stateLastTime(state, payload) {                     //上次打卡時間
    state.stateLastTime.lastDate = payload.onWorkTime.resultDate
    state.stateLastTime.lastTime = payload.onWorkTime.resultTime
    state.stateLastTime.lastDayMilliseconds = payload.ms
    state.stateLastTime.lastWorkState = '上班'
  },
  stateWorkState(state, string) {                     //上班、下班、公出狀態
    state.workState = string
  },
  stateUserCoordinates(state, payload) {              //使用者所在座標
    state.userCoordinates.latitude = payload.latitude
    state.userCoordinates.longitude = payload.longitude
  },
  stateCompanyDistance(state, number) {               //與公司的距離
    state.companyDistance = number
  },
  stateClockInState(state, string) {                 //是否打卡成功
    state.clockInState = string
  }
}