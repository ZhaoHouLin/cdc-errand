<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { googleFireStore , googleFirebase } from '../db'
import { useStore } from 'vuex'
import { apiGoogleSpreadSheet, apiCommonFn } from '../api'
export default {
  setup() {

    const store = useStore()

    const loginUserInfoData = computed(()=> {
      return store.getters.loginUserInfoData
    })

    const authStateData = computed(()=> {
      return store.getters.authStateData
    })

    const currentTimeData = computed(()=> {
      return store.getters.currentTimeData
    })

    const lastTimeData = computed(()=> {
      return store.getters.lastTimeData
    })

    const userCoordinatesData = computed(()=> {
      return store.getters.userCoordinatesData
    })

    const { loadSheetData, sendData } = apiGoogleSpreadSheet()

    const { getLocation } = apiCommonFn()

    const userData = ref()                  

    const handleWorkstate = (e)=> {
      store.dispatch('commitWorkState',e.target.value)
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
        let currentDate = ``
        let currentTime = ``
        let dayMilliseconds = ``
        store.dispatch('commitCurrentTime', { currentDate, currentTime, dayMilliseconds })
        handleAuthState()
      }).catch((error) => {
        // An error happened.
      });
    }

    // const getData = async (docID,sheetID,credentialsPath = './credentials.json')=> {
    //   const timeResult = [];
    //   const doc = new GoogleSpreadsheet(docID);
    //   const creds = require(credentialsPath);
    //   await doc.useServiceAccountAuth(creds);
    //   await doc.loadInfo();
    //   const sheet = doc.sheetsById[sheetID];
    //   const rows = await sheet.getRows();
    //   for (row of rows) {
    //     result.push(row._rawData);
    //   }
    // }

    onMounted(()=> {
      getLocation()
    })

    return {
      // getTime,
      handleSignOut,
      handleWorkstate,
      loginUserInfoData,
      authStateData,
      loadSheetData,
      sendData,
      currentTimeData,
      lastTimeData,
      userCoordinatesData
    }
  }

}
</script>

<template lang='pug'>
.content.bg-green-700(v-if='authStateData')
  img(:src="loginUserInfoData.picture", alt="是你啦")
  .info.font-semibold.text-white
    .user-name
      .text-xl {{loginUserInfoData.name}}
    .last-time.pl-4
      .text-2xl.mb-2 上次打卡時間: 
      .text-4xl {{lastTimeData.lastDate}} {{lastTimeData.lastTime}}
    .current-time.pl-4
      .text-2xl.mb-2 本次打卡時間: 
      .text-4xl {{currentTimeData.currentDate}} {{currentTimeData.currentTime}}
    .coordinates.pl-4
      .text-2xl 您的位置:
      .txxt-xl {{userCoordinatesData.latitude.toFixed(3)}} , {{userCoordinatesData.longitude.toFixed(3)}}

  .punch-in-out.text-xl.font-extrabold
    .state(class='w-full h-2/3')
      .on(class='h-1/3')
        label
          input(type='radio' name='workstate' checked @click='handleWorkstate($event)' value='上班')
          .text.h-full.text-white.font-semibold.shadow-md.bg-green-500.border-b.border-green-700.cursor-pointer 上班
      .off(class='h-1/3')
        label 
          input(type='radio' name='workstate' @click='handleWorkstate($event)' value='下班')
          .text.h-full.text-white.font-semibold.shadow-md.bg-green-500.border-b.border-green-700.cursor-pointer 下班
      .out(class='h-1/3')
        label 
          input(type='radio' name='workstate' @click='handleWorkstate($event)' value='公出')
          .text.h-full.text-white.font-semibold.shadow-md.bg-green-500.cursor-pointer 公出
    .control.bg-green-500(class='w-full h-1/3')
      button.font-semibold.shadow-md.text-white.bg-indigo-500.rounded-tl-3xl(class='w-full h-1/2 hover:bg-indigo-800 hover:text-white' @click='sendData()') 打卡
      button.font-semibold.shadow-md.text-white.bg-indigo-500(class='w-full h-1/2 hover:bg-indigo-800 hover:text-white' @click='handleSignOut') 登出


</template>

<style lang="stylus">
@import '../css/style.styl'
.content
  size(100%,100vh,0)
  position relative
  // border 1px solid #222
  img
    width 40%
    // border-radius 16px
    position absolute
  .info
    padding 1rem
    // border 1px solid #222
    // flexCenter(flex-start,center,column)
    size(80vw,auto)
    posCenter(0%,60%)

    .last-time,.current-time
      margin 2rem 0
      // border 1px solid #222
    .last-time,.current-time
      size(auto,8rem,0px)
      // border 1px solid #222
  .punch-in-out
    size(20vw,100vh)
    flexCenter(flex-start,,column)
    position absolute
    right 0%
    .state
      background-color rgba(16, 185, 129, 1)
      .on,.off,.out
        input
          display none
          height 100px
          background-color green
          size(auto,100%)
        input:checked + .text
          background-color rgba(6, 95, 70, 1)
          // color white
          // border-radius 2rem 0 2rem 0
        label
          padding 20px 0
        label .text
          flexCenter()
    .control
      button
        outline none
    //   border 1px solid #222
</style>
