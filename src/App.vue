<script>
import EditSheet from './components/EditSheet'
import Login from './components/Login'

export default {
  components: {
    EditSheet,
    Login
  },
  setup() {
    return {
    }
  }
}
</script>

<template lang='pug'>
EditSheet
Login
</template>

<style lang="stylus">
@import './css/style.styl'
#app
  size()
  flexCenter()
</style>
