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

    const clockInState = computed(()=> {
      return store.getters.clockInStateData
    })

    const workStateData = computed(()=> {
      return store.getters.workStateData
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
        store.dispatch('commitCurrentTime', { currentDate, currentTime, dayMilliseconds})
        store.dispatch('commitClockInState', '')
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
      userCoordinatesData,
      getLocation,
      clockInState,
      workStateData
    }
  }

}
</script>

<template lang='pug'>
.content.bg-green-700.shadow-md(v-if='authStateData')
  .avatar
    img.rounded-br-2xl(:src="loginUserInfoData.picture", alt="是你啦")
    .user-name.font-semibold.text-xl.text-white.ml-4.mt-2 {{loginUserInfoData.name}}
  .info.text-white
    .last-time.pl-4
      .text-xl.mb-2 
        i.fas.fa-history  上次打卡時間: 
      .text-3xl.text-green-300 {{lastTimeData.lastDate}} {{lastTimeData.lastTime}} {{lastTimeData.lastWorkState}}
    .current-time.pl-4
      .text-xl.mb-2  
        i.fas.fa-clock  本次打卡時間:
      .text-3xl.text-green-300 {{currentTimeData.currentDate}} {{currentTimeData.currentTime}} {{currentTimeData.currentWorkState}}
    .coordinates.pl-4
      .text-xl 
        i.fas.fa-map-marker-alt  您的位置:
      .text-xl.text-green-300 {{userCoordinatesData.latitude.toFixed(3)}} , {{userCoordinatesData.longitude.toFixed(3)}}
      .text-xl.font-semibold {{clockInState}}
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
    .control.bg-green-500.rounded-br-2xl(:class="['w-full','h-1/3',{'bg-darkgreen': workStateData=='公出'}]")
      button.font-semibold.shadow-md.text-white.bg-indigo-500.rounded-tl-3xl(class='w-full h-1/2 hover:bg-indigo-800 hover:text-white' @click='sendData(),getLocation()') 打卡
      button.font-semibold.shadow-md.text-white.bg-indigo-500.rounded-br-2xl(class='w-full h-1/2 hover:bg-indigo-800 hover:text-white' @click='handleSignOut') 登出


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
      margin 2rem 0
    .last-time,.current-time
      size(auto,6rem,0px)
    .coordinates
      size(auto,4rem,0px)

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
