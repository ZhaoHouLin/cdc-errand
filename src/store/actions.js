export default {
  commitLoginUserInfo({commit},payload) {         //登入使用者資料
    commit('stateLoginUserInfo',payload)
  },
  commitAuthState({commit},boolean) {             //登入狀態
    commit('stateAuthState',boolean)
  },
  commitCurrentTime({commit},payload) {           //當前打卡時間
    commit('stateCurrentTime',payload)
  },
  commitLastTime({commit}, payload) {             //上次打卡時間
    commit('stateLastTime', payload)
  },
  commitWorkState({commit},string) {              //上班、下班、公出狀態
    commit('stateWorkState',string)
  },
  commitUserCoordinates({commit},payload) {       //使用者所在座標
    commit('stateUserCoordinates',payload)
  },
  commitCompanyDistance({commit},number) {        //與公司的距離
    commit('stateCompanyDistance',number)
  },
  commitClockInState({commit},string) {           //是否打卡成功
    commit('stateClockInState',string)
  }
}