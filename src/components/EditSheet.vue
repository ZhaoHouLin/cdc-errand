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

    const time = reactive({})

    const authState = ref(false)

    const userData = ref()

    const getLocation = () => {                         
      if ('geolocation' in navigator) {                     //測試地理位置定位是否存在
        navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
          let latitude = pos.coords.latitude
          let longitude = pos.coords.longitude

        })
      }
    }

    const getTime = ()=> {                                  //取得當前時間  
      // time.fullYear = new Date().getFullYear()           
      // time.month = new Date().getMonth()+1
      // time.date = new Date().getDate()
      // time.day = new Date().getDay()

      // time.hours = new Date().getHours()
      // time.minutes = new Date().getMinutes() 
      // time.seconds = new Date().getSeconds()
      // time.milliseconds = new Date().getMilliseconds()
      time.localDate = new Date().toLocaleDateString()
      time.loaclTime = new Date().toLocaleTimeString()
      console.log(time)
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

    const f = async ()=> {                                      //google-spreadsheet-API函式
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
      // adding / removing sheets
      // await newSheet.delete()

      // create a sheet and set the header row
      // sheet.value = await doc.addSheet({ headerValues: ['name', 'email'] });
      // sheet.value = doc.sheetsById[996985920]
      // append rows

      const sendData = await sheet.value.addRow({               //將資料寫入sheet
        name: props.data.name,                                  //會根據key值寫入value
        email: props.data.email ,
        date: time.localDate,
        time: time.loaclTime
      });


      // rows.value = await sheet.value.getRows(); // can pass in { limit, offset }

      // read/write row values
      // console.log(rows[0].name);
      // rows[1].email = 'sergey@abc.xyz'; // update a value
      // await rows[1].save(); // save updates
      // await rows[1].delete(); // delete a row

    }

    onMounted(()=> {

    })

    return {
      sheet,
      a1,
      rows,
      props,
      f,
      getTime,
      time,
      handleSignOut
    }
  }

}
</script>

<template lang='pug'>
.edit-sheet.container(v-if='props.bool')
  .info.container.text-center
    h1 {{props.data.name}}
    h2 {{time.localDate}}
    h2 {{time.loaclTime}}

  .insert.container.bg-green-200.flex.justify-around
    button.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='f(),getTime()')() 打卡
    button.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='handleSignOut') 登出
</template>

<style lang="stylus">

</style>
