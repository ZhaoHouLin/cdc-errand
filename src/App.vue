<script>
import { ref } from 'vue'
import EditSheet from './components/EditSheet'
import Login from './components/Login'

export default {
  components: {
    EditSheet,
    Login
  },
  setup() {
    const authState = ref(false)
    const data = ref({})

    const handleEmitAuthState = (val)=> {         //將接收的登入狀態值val存入authState
      authState.value = val.value
    }

    const handleData = (val)=> {                  //將接收的使用者登入資料存入data
      data.value = val
    }
    return {
      authState,
      data,
      handleEmitAuthState,
      handleData
    }
  }
}
</script>

<template lang='pug'>
EditSheet(:bool='authState' :data='data' @emitAuthState='handleEmitAuthState')
Login(@emitAuthState='handleEmitAuthState' @emitData='handleData' :bool='authState')
</template>

<style lang="stylus">
@import './css/style.styl'
#app
  size()
  flexCenter()
</style>
