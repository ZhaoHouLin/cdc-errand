export default {
  loginUserInfo: {                            //使用者登入資料
  },
  authState: false,                           //登入狀態
  stateCurrentTime: {                         //當前打卡時間
  },
  stateLastTime: {                            //上次打卡時間
  },
  workState: '上班',                           //上班、下班、公出狀態
  userCoordinates: {                          //使用者所在座標
    latitude: '',
    longitude: ''
  },
  companyDistance: 0,                         //與公司的距離
  clockInState: ''                            //是否打卡成功
}