import { useStore } from 'vuex'

const fn = ()=> {

  const store = useStore()

  const getLocation = () => {
    if ('geolocation' in navigator) {                     //測試地理位置定位是否存在
      navigator.geolocation.getCurrentPosition((pos) => { //取得使用者目前經緯度
        let latitude = pos.coords.latitude
        let longitude = pos.coords.longitude
      })
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
    let currentDate = `${today.getFullYear()}/${formatMonth}/${today.getDate()}`
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