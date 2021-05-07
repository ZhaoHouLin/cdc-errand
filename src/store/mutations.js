export default {
  stateLoginUserInfo(state, payload) {                //使用者登入資料
    state.loginUserInfo = payload
  },
  stateAuthState(state, boolean) {                    //登入狀態
    state.authState = boolean
  },
  stateClockOut(state, payload) {                     //下班打卡時間
    state.clockOut.currentDate = payload.getTimeData.currentDate
    state.clockOut.currentTime = payload.getTimeData.currentTime
    state.clockOut.dayMilliseconds = payload.getTimeData.dayMilliseconds
    state.clockOut.currentWorkState = payload.workState
  },
  stateClockIn(state, payload) {                     //上班打卡時間
    state.clockIn.lastDate = payload.onWorkTime.resultDate
    state.clockIn.lastTime = payload.onWorkTime.resultTime
    state.clockIn.lastDayMilliseconds = payload.ms
    state.clockIn.lastWorkState = '上班'
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