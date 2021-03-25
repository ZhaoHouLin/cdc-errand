<script>
import { GoogleSpreadsheet } from "google-spreadsheet"
import { computed, onMounted, reactive, ref } from 'vue'
import { googleFireStore , googleFirebase } from '../db'
export default {
  props: {
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
    emitAuthState: (authState)=> {
      return authState
    },
  },
  setup(props,{emit}) {

    // Initialize the sheet - doc ID is the long id in the sheets URL
    const doc = new GoogleSpreadsheet('1u068XIFnWLcWC2GH68W0bbF6gK3oJc6aRLro2khwVfY')
    const sheet = ref()
    const a1 = ref()
    const title = ref('')
    const rows = ref()
    const userKeyTitle = ref('')

    const time = reactive({})

    const authState = ref(false)

    const userData = ref()

    const getLocation = () => {                         
      if ('geolocation' in navigator) {                 //測試地理位置定位是否存在
        navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
          let latitude = pos.coords.latitude
          let longitude = pos.coords.longitude

        })
      }
    }

    const getTime = ()=> {
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

    const handleAuthState = ()=> {
      googleFirebase.auth().onAuthStateChanged(()=> {
        if (userData.value) {
          authState.value = true
          emit('emitAuthState',authState)
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

    const changeTitle = ()=> {
      doc.updateProperties({ title: userKeyTitle.value })
    }

    const f = async ()=> {
      
      // Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
      await doc.useServiceAccountAuth({
        client_email: 'errand@fifth-legacy-271306.iam.gserviceaccount.com',
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvkuzJz4+SKJQT\nG8uFsNeTefdkrtZTwbVZn/DtDffcRrMKVpLweVgI1j2wdw8U/iLc7ctoIrAEQXqU\nQAMAJDF16Qg5/myjIqyls7nTZSPwmNnLkjPBwPPy7u6GUtKTM3y9y/zHBXVWZQJn\nOaUI6JKgFGC1ZhEXE9Zw8MeIY6AO+iR/rvCrkp/+3gBMevJHmiHjC8zeod9iP67w\nmzr8l6IA6V2h7GBkNmXXg3NZu9N6++vZSc981uzBwpM9qtkUR9f+eRMjys1MdKxV\nU0KO+zMF3x2Q+0VTptnxAMY55HwXqey8dIShYcWH41sdp7tJ/eD20uqykZMhw0iD\nsIen7b2zAgMBAAECggEAAWHiw2QC+V+gatYZMCBIUjzvmbdWsKohx2be+r7VaMKV\nvksYNRR/gPJO4gjN8ZhepeapZ1R+lkn9sRUf8OxYB1miWvKJ4G7xdQyJNgTh148c\nh+HKzoe6Y/tFnYEhb09EeCoW/2onllqNPkrR5dQO83u1lzgKgmgBlDoRGB3QsM18\nCqj5rsKZ2sW8HA5hbJLo17uoFTYjaryBbnIcnrwy8Edvu4ikE7ZKgIUmD2KGqjke\nHZFbg+59Qh3sIckdzzULIyeUEXCSfbDfqLa4dLYGQTLoEP7V9uWrUHfrxAzmQ4B/\nLrcBReS/jgZy+K2Xv3uxE8sUjMHhcpr23WjupCn7gQKBgQDlxz889+TMazEovpTe\nYXlHwmMd0fCrXMX5bC7O8K65F6Y38am1BIeDeEHrh/BQ7sLt9jFCRur1iywpT3XZ\nM7ott+Zdut1xM2bU9fbWxHK8EVEQfz2JbrfAtxSb4tuup+QYbMTtmpBeX94OMfwD\n6c6YXvTcLpb4y09bTYKSppxcYwKBgQDDnCYbBuMaVlwIRzS5IX9ns0OQ2fpRWtjh\nsksmK0FhunDI7ZgyJPU6R52FkgATC1aXWHFRCUStfHOPx+HaAtvhvkeu84YzSP9H\ns4OH2ym41DoTEkkqKpK27OgUhlUMvch3blpDO2WFiERPVo28y6AfLKBd+dfFwWlG\nVAwx+w4ScQKBgQDky+5LHieD6ORtRr/jYzmpW4ToR4iWiW1UPAWr53qDMWpAYHD0\nn0r0fQVequB/Jg+RdUh9TzJcRzU0+TtGiLxFE83d3NjtBBrLyRL9rWT1oWSPwbMb\nqtRrn6F0y4KlueVk8MFyOiqw3lK03c6sct5VWJAGwplvqLofFuICdsZRMwKBgCRV\nQ6qve81vjwammz9r3mtXm8wzANDNrA03/cdoL2vEoqBfqW5e+QHLPZIKzWK8L2hL\nMDkaHJyQyjJBsUy6TTdADbaMWzf5bhlWWa8JYVWIbgUO13IymC/MD0uIrBGCytKM\nN83XIYNNDUsjS45u0B4aPutVteNwimpawC0kcbexAoGAF/yGDVUtoytMAoCf8IbK\nv9SpJ6iDEMK3NXiwMnSRJyr/bp+mS5amKBHct0yeZFlJrPzq0FTLKyqd1v08iCOL\n+bW5MXDuyN/ZtcABFSsqoT6snnleKp3Qijk8pWQyGt0ca5SzoU4z8GJ4k2HfLNNN\nFfhNj/I6cnrDDU2VDkgerCY=\n-----END PRIVATE KEY-----\n",
      });
      
      await doc.loadInfo() // loads document properties and worksheets
      // await doc.updateProperties({ title: 'test doc' });
      
      sheet.value = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
      // console.log(sheet.value.title);
      // console.log('sheet',sheet.value);
      title.value = doc
      await sheet.value.loadCells('A1:E10')
      const cellA1 = await sheet.value.getCell(0, 0)
      const cellC3 = sheet.value.getCellByA1('C3')
      // adding / removing sheets
      // const newSheet = await doc.addSheet({ title: 'zz' });
      // await newSheet.delete()

      // create a sheet and set the header row
      // sheet.value = await doc.addSheet({ headerValues: ['name', 'email'] });
      // sheet.value = doc.sheetsById[996985920]
      // append rows
      title.value = cellC3.value
      console.log(cellC3);
      const sendData = await sheet.value.addRow({ 
        name: props.data.name, 
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
      title,
      userKeyTitle,
      changeTitle,
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
  //- input(@input='changeTitle' v-model='userKeyTitle')
  .insert.container.bg-green-200.flex.justify-around
    button.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='f(),getTime()')() 打卡
    button.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='handleSignOut') 登出
</template>

<style lang="stylus">

</style>
