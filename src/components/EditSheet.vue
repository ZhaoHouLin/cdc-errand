<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { googleFireStore , googleFirebase } from '../db'
import { useStore } from 'vuex'
import { apiGoogleSpreadSheet, apiCommonFn } from '../api'

export default {
  setup() {

    const store = useStore()
    const { getLocation, getTime } = apiCommonFn()
    const userData = ref()  

    const loginUserInfoData = computed(()=> {             //使用者登入資料
      return store.getters.loginUserInfoData
    })
    const authStateData = computed(()=> {                 //登入狀態
      return store.getters.authStateData
    })
    const clockOutData = computed(()=> {                  //下班打卡時間
      return store.getters.clockOutData
    })
    const clockInData = computed(()=> {                   //上班打卡時間
      return store.getters.clockInData
    })
    const userCoordinatesData = computed(()=> {           //使用者所在座標
      return store.getters.userCoordinatesData
    })
    const clockInState = computed(()=> {                  //是否打卡成功
      return store.getters.clockInStateData
    })
    const workStateData = computed(()=> {                 //上班、下班、公出狀態
      return store.getters.workStateData
    })
    const docExistData = computed(()=> {                  //日期資料是否存在
      return store.getters.docExistData
    })
    const userCompanyDistanceData = computed(()=> {
      return store.getters.userCompanyDistanceData
    })

    const timeData = ref({
      '上班': {
        time: '防資料覆寫'
      },
      '下班': {
        time: '防資料覆寫'
      },
      '公出': {
        time: '防資料覆寫'
      }
    })
  
    const handleWorkstate = (e)=> {                       //上班、下班、公出狀態
      console.log(e.target.value);
      store.dispatch('commitWorkState',e.target.value)
      console.log(workStateData.value);
    }

    const handleAuthState = ()=> {                        //處理登入狀態後的頁面
      googleFirebase.auth().onAuthStateChanged(()=> {
        if (userData.value) {
          store.dispatch('commitAuthState',true)
        } else {
          store.dispatch('commitAuthState',false)
        }
      })
    }

    const handleSignOut = ()=> {
      googleFirebase.auth().signOut().then(() => {
        console.log('Sign-out successful.');
        userData.value = googleFirebase.auth().currentUser
        let getTimeData = {
          currentDate: ``,
          currentTime: ``,
          dayMilliseconds: ``
        }
        store.dispatch('commitClockOut', { getTimeData })
        store.dispatch('commitClockInState', '')
        handleAuthState()
      }).catch((error) => {
        // An error happened.
      });
    }

    const fsSet = (state)=> {
      let getTimeData = getTime()
      let workState
      console.log(userCompanyDistanceData.value);
      docExistData.value?workState = state :workState = '上班'

      if(userCompanyDistanceData.value <= 800 ) {        //判斷距離公司X00公尺內才能打卡
        const ref = googleFireStore.collection(loginUserInfoData.value.name).doc(getTimeData.currentDate)
  
        timeData.value[workState][getTimeData.currentTime] = getTimeData.dayMilliseconds
  
        ref.set(timeData.value,{merge: true}).then(() => {              //傳到firestore
          if(workState == state) {
            store.dispatch('commitClockOut',{getTimeData,workState})    //介面顯示時間
          } 
          store.dispatch('commitClockInState', '打卡成功')
        })
      } else {
        store.dispatch('commitClockInState', '打卡失敗，位置不正確')
      }
    }

    onMounted(()=> {
      getLocation()
    })

    return {
      handleSignOut,
      handleWorkstate,
      loginUserInfoData,
      authStateData,
      clockOutData,
      clockInData,
      userCoordinatesData,
      getLocation,
      clockInState,
      workStateData,
      fsSet
    }
  }

}
</script>

<template lang='pug'>
.content.bg-green-800.shadow-md(v-if='authStateData')
  .avatar
    img.rounded-br-2xl(:src="loginUserInfoData.picture", alt="是你啦")
    .user-name.font-semibold.text-xl.text-white.ml-4.mt-2 {{loginUserInfoData.name}}
  .info.text-white
    .last-time.pl-4
      .text-xl.mb-2 
        i.fas.fa-history  今日上班打卡時間: 
      .time  
        .bar.ml-2
        .text-3xl.text-green-300.ml-6 {{clockInData.lastDate}} {{clockInData.lastTime}} {{clockInData.lastWorkState}}
    .current-time.pl-4
      .text-xl.mb-2  
        i.fas.fa-clock  今日下班打卡時間:
      .time
        .bar.ml-2
        .text-3xl.text-green-300.ml-6 {{clockOutData.currentDate}} {{clockOutData.currentTime}} {{clockOutData.currentWorkState}}
    .coordinates.pl-4
      .text-xl.mb-2
        i.fas.fa-street-view  您的位置:
      .pos
        .bar.ml-2
        .text-xl.text-green-300.ml-4 {{userCoordinatesData.latitude.toFixed(3)}} , {{userCoordinatesData.longitude.toFixed(3)}}
      .text-xl.font-semibold.ml-6 {{clockInState}}
  .punch-in-out.text-xl.font-extrabold
    .control.bg-transparent.rounded-br-2xl(:class="['w-full','h-full']")
      button.font-semibold.shadow-md.text-white.bg-green-700.rounded-tl-3xl.border-b(class='w-full h-1/3 hover:bg-green-800 hover:text-green-300' @click='fsSet("下班"),getLocation()') 
        i.fas.fa-user-clock
        h3 打卡
      button.font-semibold.shadow-md.text-white.bg-green-600.border-b(class='w-full h-1/3 hover:bg-green-800 hover:text-green-300' @click='fsSet("公出"),getLocation()')
        i.fas.fa-business-time
        h3 公出
      button.font-semibold.shadow-md.text-white.bg-green-500.rounded-br-2xl(class='w-full h-1/3 hover:bg-green-800 hover:text-green-300' @click='handleSignOut')
        i.fas.fa-sign-out-alt
        h3 登出


</template>

<style lang="stylus">
@import '../css/style.styl'
.content
  size(90%,96%,1rem)
  position relative
  .avatar
    position absolute
    img
      width 8rem
  .info
    padding 1rem
    size(80%,auto)
    posCenter(0%,60%)
     
    .last-time,.current-time,.coordinates
      margin 2.5rem 0
    .last-time,.current-time
      size(auto,6rem,0px)

          
    .last-time,.current-time 
      .time
        flexCenter(flex-start,center,)
        .bar
          size(4px,5rem)
          background-color #fff
          position absolute
        .text-3xl.text-green-300
          size(260px,72px)

    .coordinates
      size(auto,4rem,0px)
      .pos
        flexCenter(flex-start,center,)
        .bar
          size(4px,2rem)
          background-color #fff

  .punch-in-out
    size(20%,100%,0)
    flexCenter(flex-start,,column)
    position absolute
    right 0%
    .state
      .on,.off,.out
        input
          display none
          height 100px
          background-color green
          size(auto,100%)
        input:checked + .text
          background-color rgba(6, 95, 70, 1)
        label
          padding 20px 0
        label .text
          flexCenter()
      .on .text
        border-radius 0 1rem 0 0
    .control
      button
        flexCenter(center,center,column)
        i
          margin 1rem
        outline none
      &.bg-darkgreen
        background-color rgba(6, 95, 70, 1)
        border none
      


@media screen and (min-width 420px)
  .content
    size(420px,96%,1rem)
    .info
      posCenter(0%,50%)
</style>
