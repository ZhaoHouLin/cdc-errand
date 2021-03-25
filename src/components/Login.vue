<script>
import { googleFireStore , googleFirebase } from '../db'
import { onMounted, reactive, ref } from 'vue'
export default {
  props: {                                              //接收App.vue用
    bool: {
      type: Boolean,
      default: true
    }
  },
  emits: {                                              //向App.vue傳遞用
    emitAuthState: (authState)=> {
      return authState
    },
    emitData: (data)=> {
      return data
    }
  },

  setup(props,{emit}) {

    const open = ref(true)
    let cover = ref()
    let userEmail = ref('')
    let userPassword = ref('')

    let errorMsg = ref('')

    const authState = ref(false)

    const loginUserInfo = reactive({})

    const userData = ref()

    const handleAuthState = ()=> {                        //判斷登入狀態
      googleFirebase.auth().onAuthStateChanged(()=> {
        if (userData.value) {
          authState.value = true
          emit('emitAuthState',authState)
        } else {
          authState.value = false
          emit('emitAuthState',authState)
        }
      })
    }

    const googleSignIn = ()=> {                           //以google登入
      handleSignOut()
      let provider = new googleFirebase.auth.GoogleAuthProvider()
      googleFirebase.auth().languageCode = 'it';
      // To apply the default browser preference instead of explicitly setting it.
      googleFirebase.auth().useDeviceLanguage()
      googleFirebase
        .auth()
        .signInWithPopup(provider)
        .then((result) => {
          /** @type {firebase.auth.OAuthCredential} */
          userData.value = googleFirebase.auth().currentUser
          console.log(result.additionalUserInfo.profile.picture);
          loginUserInfo.data = result.additionalUserInfo.profile
          emit('emitData',loginUserInfo.data)               //發送使用者登入資料到App.vue
          handleAuthState()
        })
        .catch((error) => {
          // Handle Errors here.
          errorMsg.value = error.message

        });
    }

    const handleSignOut = ()=> {                            //登出
      googleFirebase.auth().signOut().then(() => {
        console.log('Sign-out successful.');
        userData.value = googleFirebase.auth().currentUser
        handleAuthState()
      }).catch((error) => {
        // An error happened.
      });
    }

    onMounted(()=> {
      
    })

    return {
      userEmail,
      userPassword,
      googleSignIn,
      handleSignOut,
      authState,
      cover,
      errorMsg,
      props
    }
  }
}
</script>

<template lang='pug'>
      
a.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='googleSignIn' v-if='!props.bool')
  | 疾管署 google帳號登入



</template>

<style lang='stylus'>
@css {
  .btn {
    @apply py-2 px-4 font-semibold rounded-lg shadow-md
  }
  .btn-green {
    @apply text-white bg-green-500 hover:bg-green-700
  }
  
}

.login-button
  cursor pointer  

</style>