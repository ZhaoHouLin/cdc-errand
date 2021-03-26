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
      
//- a.login-button.py-2.px-4.font-semibold.rounded-lg.shadow-md.text-white.bg-green-500(class='hover:bg-green-700' @click='googleSignIn' v-if='!props.bool')
//-   | 疾管署 google帳號登入

.min-h-screen.flex.items-center.justify-center.py-12.px-4(class='sm:px-6 lg:px-8 w-8/12' v-if='!props.bool')
  .max-w-xl.w-full.space-y-8
    div
      img.mx-auto.h-12.w-auto(src='https://www.cdc.gov.tw/Images/logo_1.svg' alt='Workflow')
      h2.my-6.text-center.text-3xl.font-extrabold.text-gray-900
        | CDC點點名
      div
        button.group.relative.w-full.flex.justify-center.py-2.px-4.border.border-transparent.text-sm.font-medium.rounded-md.text-white.bg-green-600(type='submit' class='hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' @click='googleSignIn')
          span.absolute.left-0.inset-y-0.flex.items-center.pl-3
            // Heroicon name: solid/lock-closed
            svg.h-5.w-5.text-green-500(class='group-hover:text-green-400' xmlns='http://www.w3.org/2000/svg' viewbox='0 0 20 20' fill='currentColor' aria-hidden='true')
              path(fill-rule='evenodd' d='M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z' clip-rule='evenodd')
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