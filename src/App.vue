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
    const data = ref('')

    const handleEmitAuthState = (val)=> {
      authState.value = val.value
    }

    const handleData = (val)=> {
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
//- router-link(to="/editsheet") EditSheet

//- router-link(to="/login") Login

EditSheet(:bool='authState' :data='data' @emitAuthState='handleEmitAuthState')
Login(@emitAuthState='handleEmitAuthState' @emitData='handleData' :bool='authState')
</template>

<style lang="stylus">
@import './css/style.styl'
#app
  size()
  flexCenter()
</style>
