import { GoogleSpreadsheet } from 'google-spreadsheet'
import { computed, reactive, ref } from 'vue'
import { useStore } from 'vuex'
import { apiCommonFn } from './index'

const handleSheet = ()=> {

  const { getTime } = apiCommonFn()

  const store = useStore()

  const loginUserInfoData = computed(() => {
    return store.getters.loginUserInfoData
  })

  const currentTimeData = computed(() => {
    return store.getters.currentTimeData
  })

  const lastTimeData = computed(() => {
    return store.getters.lastTimeData
  })

  const workStateData = computed(() => {
    return store.getters.workStateData
  })

  const userCompanyDistanceData = computed(()=> {
    return store.getters.userCompanyDistanceData
  })

  const timeResult = reactive([])

  const sheet = ref()

  const sendData = async ()=> {
    await loadSheetData()
    console.log(userCompanyDistanceData.value)
    if (userCompanyDistanceData.value <= 300) {
      store.dispatch('commitClockInState', '打卡成功')
      await getTime()
      const data = await sheet.value.addRow({               //將資料寫入sheet
        name: loginUserInfoData.value.name,                 //會根據key(第一列title)值寫入value
        email: loginUserInfoData.value.email,
        currentdate: currentTimeData.value.currentDate,
        currenttime: currentTimeData.value.currentTime,
        lastdate: lastTimeData.value.lastDate,
        lasttime: lastTimeData.value.lastTime,
        daymilliseconds: currentTimeData.value.dayMilliseconds,
        lastdaymilliseconds: lastTimeData.value.lastDayMilliseconds,
        state: workStateData.value
      })
      
    } else {
      store.dispatch('commitClockInState','偵測位置不正確，請重新定位')
    }
  }

  const loadSheetData = async () => {                          //Google spread sheet
    const doc = new GoogleSpreadsheet('1u068XIFnWLcWC2GH68W0bbF6gK3oJc6aRLro2khwVfY')
    //google-spreadsheet-API函式
    // await getTime()

    //google-spreadsheet-API 金鑰設定
    await doc.useServiceAccountAuth({                         
      client_email: 'errand@fifth-legacy-271306.iam.gserviceaccount.com',
      private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCvkuzJz4+SKJQT\nG8uFsNeTefdkrtZTwbVZn/DtDffcRrMKVpLweVgI1j2wdw8U/iLc7ctoIrAEQXqU\nQAMAJDF16Qg5/myjIqyls7nTZSPwmNnLkjPBwPPy7u6GUtKTM3y9y/zHBXVWZQJn\nOaUI6JKgFGC1ZhEXE9Zw8MeIY6AO+iR/rvCrkp/+3gBMevJHmiHjC8zeod9iP67w\nmzr8l6IA6V2h7GBkNmXXg3NZu9N6++vZSc981uzBwpM9qtkUR9f+eRMjys1MdKxV\nU0KO+zMF3x2Q+0VTptnxAMY55HwXqey8dIShYcWH41sdp7tJ/eD20uqykZMhw0iD\nsIen7b2zAgMBAAECggEAAWHiw2QC+V+gatYZMCBIUjzvmbdWsKohx2be+r7VaMKV\nvksYNRR/gPJO4gjN8ZhepeapZ1R+lkn9sRUf8OxYB1miWvKJ4G7xdQyJNgTh148c\nh+HKzoe6Y/tFnYEhb09EeCoW/2onllqNPkrR5dQO83u1lzgKgmgBlDoRGB3QsM18\nCqj5rsKZ2sW8HA5hbJLo17uoFTYjaryBbnIcnrwy8Edvu4ikE7ZKgIUmD2KGqjke\nHZFbg+59Qh3sIckdzzULIyeUEXCSfbDfqLa4dLYGQTLoEP7V9uWrUHfrxAzmQ4B/\nLrcBReS/jgZy+K2Xv3uxE8sUjMHhcpr23WjupCn7gQKBgQDlxz889+TMazEovpTe\nYXlHwmMd0fCrXMX5bC7O8K65F6Y38am1BIeDeEHrh/BQ7sLt9jFCRur1iywpT3XZ\nM7ott+Zdut1xM2bU9fbWxHK8EVEQfz2JbrfAtxSb4tuup+QYbMTtmpBeX94OMfwD\n6c6YXvTcLpb4y09bTYKSppxcYwKBgQDDnCYbBuMaVlwIRzS5IX9ns0OQ2fpRWtjh\nsksmK0FhunDI7ZgyJPU6R52FkgATC1aXWHFRCUStfHOPx+HaAtvhvkeu84YzSP9H\ns4OH2ym41DoTEkkqKpK27OgUhlUMvch3blpDO2WFiERPVo28y6AfLKBd+dfFwWlG\nVAwx+w4ScQKBgQDky+5LHieD6ORtRr/jYzmpW4ToR4iWiW1UPAWr53qDMWpAYHD0\nn0r0fQVequB/Jg+RdUh9TzJcRzU0+TtGiLxFE83d3NjtBBrLyRL9rWT1oWSPwbMb\nqtRrn6F0y4KlueVk8MFyOiqw3lK03c6sct5VWJAGwplvqLofFuICdsZRMwKBgCRV\nQ6qve81vjwammz9r3mtXm8wzANDNrA03/cdoL2vEoqBfqW5e+QHLPZIKzWK8L2hL\nMDkaHJyQyjJBsUy6TTdADbaMWzf5bhlWWa8JYVWIbgUO13IymC/MD0uIrBGCytKM\nN83XIYNNDUsjS45u0B4aPutVteNwimpawC0kcbexAoGAF/yGDVUtoytMAoCf8IbK\nv9SpJ6iDEMK3NXiwMnSRJyr/bp+mS5amKBHct0yeZFlJrPzq0FTLKyqd1v08iCOL\n+bW5MXDuyN/ZtcABFSsqoT6snnleKp3Qijk8pWQyGt0ca5SzoU4z8GJ4k2HfLNNN\nFfhNj/I6cnrDDU2VDkgerCY=\n-----END PRIVATE KEY-----\n",
    });
  
    await doc.loadInfo() // loads document properties and worksheets
    
    // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    sheet.value = doc.sheetsByIndex[0] 

    
    // await sheet.value.loadCells('A1:E10')
    // const cellA1 = await sheet.value.getCell(0, 0)            //定義sheet A1位置
    // const cellC3 = sheet.value.getCellByA1('C3')             //取得c3的值的方式
  
    const rows = await sheet.value.getRows()                  //取得欄
  
    await rows.forEach(row => {                               //處理使用者時間資料
      if (row.name == loginUserInfoData.value.name) {         //只抓登入使用者的判斷
        timeResult.push({                                     //將登入的使用者時間存起來
          currentDate: row.currentdate,
          currentTime: row.currenttime,
          workState: row.state,
          dayMilliseconds: row.daymilliseconds
        })
        //存最後一筆資料來呈現上次的打卡紀錄
        let lastDate = timeResult[timeResult.length - 1].currentDate    
        let lastTime = timeResult[timeResult.length - 1].currentTime
        let lastDayMilliseconds = timeResult[timeResult.length - 1].dayMilliseconds
        let lastWorkState = timeResult[timeResult.length - 1].workState
        store.dispatch('commitLastTime', { lastDate, lastTime, lastDayMilliseconds, lastWorkState })
      }
    })

  }

  return {
    loadSheetData,
    sendData,
  }
}


export const spreadSheet = handleSheet