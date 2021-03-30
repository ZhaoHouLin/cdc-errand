<script>
import { GoogleSpreadsheet } from "google-spreadsheet"
import { computed, onMounted, reactive, ref } from 'vue'
import { googleFireStore , googleFirebase } from '../db'
export default {
  props: {                                                //接收App.vue用
    bool: {
      type: Boolean,
      default: true
    },
    data: {                                               
      type: Object,
      default: ()=> ({}) 
    }
  },
  emits: {
    emitAuthState: (authState)=> {                        //向App.vue傳遞用
      return authState
    },
  },
  setup(props,{emit}) {

    // Initialize the sheet - doc ID is the long id in the sheets URL
    // google-sheet ID
    const doc = new GoogleSpreadsheet('1u068XIFnWLcWC2GH68W0bbF6gK3oJc6aRLro2khwVfY')

    const sheet = ref()                                     //存放google-sheet
    const a1 = ref()                                        //存放google-spreadsheet左上角起始定位
    const rows = ref()

    const time = reactive({
      lastDate: '',
      lastTime: ''
    })

    const timeResult = reactive([])

    const authState = ref(false)

    const userData = ref()

    const workState = ref('上班')                       

    const lastTime = ref()

    const getLocation = () => {                         
      if ('geolocation' in navigator) {                     //測試地理位置定位是否存在
        navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
          let latitude = pos.coords.latitude
          let longitude = pos.coords.longitude

        })
      }
    }

    const getTime = ()=> {      
      let today = new Date()    
      let todayTime = today.getTime()                        //取得當前時間  
      // time.fullYear = new Date().getFullYear()           
      // time.month = new Date().getMonth()+1
      // time.date = new Date().getDate()
      // time.day = new Date().getDay()

      // time.hours = new Date().getHours()
      // time.minutes = new Date().getMinutes() 
      // time.seconds = new Date().getSeconds()
      // time.milliseconds = new Date().getMilliseconds()
      // time.localDate = new Date().toLocaleDateString()
      // time.loaclTime = new Date().toLocaleTimeString()
      time.localDate = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`
      time.loaclTime = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
      time.dayMilliseconds = todayTime
      // let test = todayTime.setTime()
      console.log(today,todayTime);
    }

    const handleWorkstate = (e)=> {
      workState.value = e.target.value
    }

    const handleAuthState = ()=> {                        //處理登入狀態後的頁面
      googleFirebase.auth().onAuthStateChanged(()=> {
        if (userData.value) {
          authState.value = true
          emit('emitAuthState',authState)                 //發送登入狀態到App.vue
        } else {
          authState.value = false
          emit('emitAuthState',authState)
          console.log(authState.value);
        }
      })
    }

    const handleSignOut = ()=> {
      googleFirebase.auth().signOut().then(() => {
        console.log('Sign-out successful.');
        userData.value = googleFirebase.auth().currentUser
        time.localDate = ''
        time.loaclTime = ''
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

    const handleSheet = async ()=> {                                      //google-spreadsheet-API函式
      // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
      await doc.useServiceAccountAuth({                         //google-spreadsheet-API 金鑰設定
        client_email: 'errand@fifth-legacy-271306.iam.gserviceaccount.com',
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvkuzJz4+SKJQT\nG8uFsNeTefdkrtZTwbVZn/DtDffcRrMKVpLweVgI1j2wdw8U/iLc7ctoIrAEQXqU\nQAMAJDF16Qg5/myjIqyls7nTZSPwmNnLkjPBwPPy7u6GUtKTM3y9y/zHBXVWZQJn\nOaUI6JKgFGC1ZhEXE9Zw8MeIY6AO+iR/rvCrkp/+3gBMevJHmiHjC8zeod9iP67w\nmzr8l6IA6V2h7GBkNmXXg3NZu9N6++vZSc981uzBwpM9qtkUR9f+eRMjys1MdKxV\nU0KO+zMF3x2Q+0VTptnxAMY55HwXqey8dIShYcWH41sdp7tJ/eD20uqykZMhw0iD\nsIen7b2zAgMBAAECggEAAWHiw2QC+V+gatYZMCBIUjzvmbdWsKohx2be+r7VaMKV\nvksYNRR/gPJO4gjN8ZhepeapZ1R+lkn9sRUf8OxYB1miWvKJ4G7xdQyJNgTh148c\nh+HKzoe6Y/tFnYEhb09EeCoW/2onllqNPkrR5dQO83u1lzgKgmgBlDoRGB3QsM18\nCqj5rsKZ2sW8HA5hbJLo17uoFTYjaryBbnIcnrwy8Edvu4ikE7ZKgIUmD2KGqjke\nHZFbg+59Qh3sIckdzzULIyeUEXCSfbDfqLa4dLYGQTLoEP7V9uWrUHfrxAzmQ4B/\nLrcBReS/jgZy+K2Xv3uxE8sUjMHhcpr23WjupCn7gQKBgQDlxz889+TMazEovpTe\nYXlHwmMd0fCrXMX5bC7O8K65F6Y38am1BIeDeEHrh/BQ7sLt9jFCRur1iywpT3XZ\nM7ott+Zdut1xM2bU9fbWxHK8EVEQfz2JbrfAtxSb4tuup+QYbMTtmpBeX94OMfwD\n6c6YXvTcLpb4y09bTYKSppxcYwKBgQDDnCYbBuMaVlwIRzS5IX9ns0OQ2fpRWtjh\nsksmK0FhunDI7ZgyJPU6R52FkgATC1aXWHFRCUStfHOPx+HaAtvhvkeu84YzSP9H\ns4OH2ym41DoTEkkqKpK27OgUhlUMvch3blpDO2WFiERPVo28y6AfLKBd+dfFwWlG\nVAwx+w4ScQKBgQDky+5LHieD6ORtRr/jYzmpW4ToR4iWiW1UPAWr53qDMWpAYHD0\nn0r0fQVequB/Jg+RdUh9TzJcRzU0+TtGiLxFE83d3NjtBBrLyRL9rWT1oWSPwbMb\nqtRrn6F0y4KlueVk8MFyOiqw3lK03c6sct5VWJAGwplvqLofFuICdsZRMwKBgCRV\nQ6qve81vjwammz9r3mtXm8wzANDNrA03/cdoL2vEoqBfqW5e+QHLPZIKzWK8L2hL\nMDkaHJyQyjJBsUy6TTdADbaMWzf5bhlWWa8JYVWIbgUO13IymC/MD0uIrBGCytKM\nN83XIYNNDUsjS45u0B4aPutVteNwimpawC0kcbexAoGAF/yGDVUtoytMAoCf8IbK\nv9SpJ6iDEMK3NXiwMnSRJyr/bp+mS5amKBHct0yeZFlJrPzq0FTLKyqd1v08iCOL\n+bW5MXDuyN/ZtcABFSsqoT6snnleKp3Qijk8pWQyGt0ca5SzoU4z8GJ4k2HfLNNN\nFfhNj/I6cnrDDU2VDkgerCY=\n-----END PRIVATE KEY-----\n",
      });
      
      await doc.loadInfo() // loads document properties and worksheets
      
      sheet.value = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]

      await sheet.value.loadCells('A1:E10')
      const cellA1 = await sheet.value.getCell(0, 0)            //定義sheet A1位置
      // const cellC3 = sheet.value.getCellByA1('C3')           //取得c3的值的方式

      const rows = await sheet.value.getRows();

      await rows.forEach(row => {                                     //處理使用者時間資料
        if(row.name == props.data.name) {                       //只抓登入使用者的判斷
          timeResult.push({                                     //將登入的使用者時間存起來
            currentDate: row.currentdate,
            currentTime: row.currenttime,
            dayMilliseconds: row.daymilliseconds
          })
          time.lastDate = timeResult[timeResult.length-1].currentDate
          time.lastTime = timeResult[timeResult.length-1].currentTime
          time.lastDayMilliseconds = timeResult[timeResult.length-1].dayMilliseconds
        } 
      })
      // let accumulatedHours = (time.dayMilliseconds-time.lastDayMilliseconds)/1000/60/60
      // console.log('accumulatedHours',accumulatedHours)
      const sendData = await sheet.value.addRow({               //將資料寫入sheet
        name: props.data.name,                                  //會根據key(第一列title)值寫入value
        email: props.data.email ,
        currentdate: time.localDate,
        currenttime: time.loaclTime,
        lastdate: time.lastDate,
        lasttime: time.lastTime,
        daymilliseconds: time.dayMilliseconds,
        lastdaymilliseconds: time.lastDayMilliseconds,
        state: workState.value
      })  
      
    }

    onMounted(()=> {

    })

    return {
      sheet,
      a1,
      rows,
      props,
      handleSheet,
      getTime,
      time,
      handleSignOut,
      workState,
      handleWorkstate
    }
  }

}
</script>

<template lang='pug'>
.content.bg-green-700(v-if='props.bool')
  img(:src="props.data.picture", alt="是你啦")
  .info.font-semibold.text-white
    .user-name
      .text-2xl {{props.data.name}}
    .last-time
      .text-3xl 上次打卡時間: 
      .text-4xl {{time.lastDate}} {{time.lastTime}}
    .current-time
      .text-3xl 本次打卡時間: 
      .text-4xl {{time.localDate}} {{time.loaclTime}}
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
      button.font-semibold.shadow-md.text-white.bg-indigo-500.rounded-tl-3xl(class='w-full h-1/2 hover:bg-indigo-800 hover:text-white' @click='handleSheet(),getTime()') 打卡
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
    posCenter(0%,50%)

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
