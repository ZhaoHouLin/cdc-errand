import { useStore } from 'vuex'

const fn = ()=> {

  const store = useStore()

  const getLocation = () => {
    if ('geolocation' in navigator) {                     //測試地理位置定位是否存在
      navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
        let latitude = pos.coords.latitude
        let longitude = pos.coords.longitude
        store.dispatch('commitUserCoordinates', { latitude, longitude})
        LatLonDistance(latitude, longitude)
      })
    }
  }

  const LatLonDistance = (λA, ΦA) => {   //計算經緯度距離
    let λB = 25.043293
    let ΦB = 121.5205653
    if ((λA == λB) && (ΦA == ΦB)) {
      return 0;
    }
    else {
      let radlat1 = Math.PI * λA / 180;
      let radlat2 = Math.PI * λB / 180;
      let theta = ΦA - ΦB;
      let radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344
      // if (unit=="N") { dist = dist * 0.8684 }
      // console.log(λA,ΦA,'&',λB,ΦB ,'result',dist)
      dist = dist.toFixed(2)
      // return dist < 1 ? dist * 1000 + '公尺' : dist + '公里'
      return dist
    }
  }

  const formatTime = (val) => {                    //格式化時間(00:00)
    let dTimes = '00' + val
    return `${dTimes.substring(dTimes.length - 2)}`
  }

  const getTime = () => {
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
    let formatHours = formatTime(today.getHours())
    let formatMinutes = formatTime(today.getMinutes())
    let formatSeconds = formatTime(today.getSeconds())
    let formatMonth = formatTime(today.getMonth() + 1)
    let formatDate = formatTime(today.getDate())
    let currentDate = `${today.getFullYear()}/${formatMonth}/${formatDate}`
    let currentTime = `${formatHours}:${formatMinutes}:${formatSeconds}`
    let dayMilliseconds = todayTime
    store.dispatch('commitCurrentTime', { currentDate, currentTime, dayMilliseconds })

  }

  return {
    getLocation,
    formatTime,
    getTime
  }

}

export const commonFn = fn